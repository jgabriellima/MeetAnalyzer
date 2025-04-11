import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createSSRSassClient } from '@/lib/supabase/server';
import { PaymentProviderFactory } from '@/providers/stripe';

/**
 * API route para processar webhooks do Stripe
 * Endpoint: POST /api/stripe/webhook
 */
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Assinatura do webhook ausente' },
        { status: 400 }
      );
    }

    // Obter o provider de pagamentos
    const paymentProvider = PaymentProviderFactory.getProvider();
    
    // Verificar e construir o evento
    let event: Stripe.Event;
    try {
      event = paymentProvider.constructWebhookEvent(body, signature);
    } catch (error) {
      console.error('Erro na verificação da assinatura do webhook:', error);
      return NextResponse.json(
        { error: 'Assinatura inválida' },
        { status: 400 }
      );
    }
    
    // Obter cliente do Supabase
    const client = await createSSRSassClient();
    
    // Processar eventos
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        
        if (userId && session.customer && session.subscription) {
          // Atualizar banco de dados com informações da assinatura
          await client.getSupabaseClient().from('accounts')
            .update({
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              subscription_status: 'active',
            })
            .eq('id', userId);
            
          console.log(`Assinatura ativada para o usuário ${userId}`);
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Buscar usuário pelo customer_id
        const { data: userData } = await client.getSupabaseClient().from('accounts')
          .select('id')
          .eq('stripe_customer_id', subscription.customer as string)
          .single();
        
        if (userData) {
          await client.getSupabaseClient().from('accounts')
            .update({
              subscription_status: subscription.status,
            })
            .eq('id', userData.id);
            
          console.log(`Status da assinatura atualizado para ${subscription.status} para o usuário ${userData.id}`);
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Buscar usuário pelo customer_id
        const { data: userData } = await client.getSupabaseClient().from('accounts')
          .select('id')
          .eq('stripe_customer_id', subscription.customer as string)
          .single();
        
        if (userData) {
          await client.getSupabaseClient().from('accounts')
            .update({
              subscription_status: 'inativa',
              stripe_subscription_id: null,
            })
            .eq('id', userData.id);
            
          console.log(`Assinatura cancelada para o usuário ${userData.id}`);
        }
        break;
      }
      
      default:
        console.log(`Evento não processado: ${event.type}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 