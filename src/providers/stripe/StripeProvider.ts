import Stripe from 'stripe';
import { PaymentProvider, CheckoutSessionOptions, SubscriptionInfo, CustomerInfo } from './PaymentProvider';

/**
 * Implementação concreta do PaymentProvider usando Stripe
 */
export class StripeProvider implements PaymentProvider {
  private stripe: Stripe;
  private webhookSecret: string;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
    });

    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  }

  /**
   * Criar uma sessão de checkout do Stripe
   */
  async createCheckoutSession(options: CheckoutSessionOptions): Promise<{ url: string }> {
    const { 
      priceId, 
      customerId, 
      customerEmail, 
      metadata, 
      returnUrl,
      checkoutTitle,
      checkoutDescription,
      features,
      socialProof,
      guaranteeText,
      upsellText
    } = options;

    // Preparar os metadados estendidos com detalhes para melhorar a conversão
    const enhancedMetadata = {
      ...metadata,
      ...(checkoutTitle && { checkout_page_title: checkoutTitle }),
      ...(checkoutDescription && { checkout_page_description: checkoutDescription }),
      ...(features && { features: JSON.stringify(features) }),
      ...(socialProof && { social_proof: socialProof }),
      ...(guaranteeText && { guarantee_text: guaranteeText }),
      ...(upsellText && { upsell_text: upsellText })
    };

    // Criar a sessão de checkout com configurações aprimoradas
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: !customerId ? customerEmail : undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${returnUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?canceled=true`,
      metadata: enhancedMetadata,
      // Adicionar configurações de UI para melhorar a experiência
      custom_text: {
        submit: {
          message: guaranteeText || 'Sua assinatura pode ser cancelada a qualquer momento'
        }
      },
      // Habilitar ajustes de promoção se fornecido texto de upsell
      allow_promotion_codes: !!upsellText
    });

    if (!session.url) {
      throw new Error('Failed to create checkout session');
    }

    return { url: session.url };
  }

  /**
   * Criar uma sessão do portal do cliente do Stripe
   */
  async createPortalSession(customerId: string, returnUrl: string): Promise<{ url: string }> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  }

  /**
   * Obter informações da assinatura
   */
  async getSubscription(subscriptionId: string): Promise<SubscriptionInfo> {
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
    
    const plan = subscription.items.data[0]?.price.nickname || 'desconhecido';
    
    return {
      id: subscription.id,
      status: subscription.status,
      plan,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    };
  }

  /**
   * Obter um cliente existente ou criar um novo
   */
  async getOrCreateCustomer(email: string, metadata?: Record<string, string>): Promise<CustomerInfo> {
    // Verificar se o cliente já existe
    const customers = await this.stripe.customers.list({ email });
    
    if (customers.data.length > 0) {
      const customer = customers.data[0];
      return {
        id: customer.id,
        email: customer.email || email,
      };
    }
    
    // Criar um novo cliente
    const customer = await this.stripe.customers.create({
      email,
      metadata,
    });
    
    return {
      id: customer.id,
      email: customer.email || email,
    };
  }

  /**
   * Verificar e construir um evento de webhook do Stripe
   */
  constructWebhookEvent(payload: string, signature: string): Stripe.Event {
    if (!this.webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set');
    }
    
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.webhookSecret
    );
  }
} 