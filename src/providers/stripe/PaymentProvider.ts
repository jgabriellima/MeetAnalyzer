/**
 * Interface para providers de pagamento
 * Define os métodos e tipos necessários para integração de pagamentos
 */

export interface CheckoutSessionOptions {
  priceId: string;
  customerId?: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
  returnUrl: string;
  // Campos para customizar a experiência de checkout
  checkoutTitle?: string;
  checkoutDescription?: string;
  features?: string[];
  socialProof?: string;
  guaranteeText?: string;
  upsellText?: string;
}

export interface SubscriptionInfo {
  id: string;
  status: string;
  plan: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface CustomerInfo {
  id: string;
  email: string;
}

export interface PaymentProvider {
  /**
   * Criar uma sessão de checkout
   */
  createCheckoutSession(options: CheckoutSessionOptions): Promise<{ url: string }>;

  /**
   * Criar uma sessão do portal do cliente
   */
  createPortalSession(customerId: string, returnUrl: string): Promise<{ url: string }>;

  /**
   * Obter informações da assinatura
   */
  getSubscription(subscriptionId: string): Promise<SubscriptionInfo>;

  /**
   * Obter ou criar um cliente
   */
  getOrCreateCustomer(email: string, metadata?: Record<string, string>): Promise<CustomerInfo>;
  
  /**
   * Verificar evento de webhook
   */
  constructWebhookEvent(payload: string, signature: string): any;
} 