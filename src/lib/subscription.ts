import { createSSRSassClient } from '@/lib/supabase/server';
import { PaymentProviderFactory } from '@/providers/stripe';

export type SubscriptionStatus = {
  isActive: boolean;
  plan: string | null;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
};

/**
 * Verifica o status da assinatura de um usuário
 */
export async function checkSubscriptionStatus(): Promise<SubscriptionStatus> {
  try {
    // Obter cliente do Supabase
    const client = await createSSRSassClient();
    const user = await client.getUser();
    
    // Se não houver usuário autenticado, retornar sem assinatura
    if (!user) {
      return {
        isActive: false,
        plan: null,
        cancelAtPeriodEnd: false,
        currentPeriodEnd: null,
      };
    }
    
    // Buscar informações do usuário
    const { data: userData } = await client.getSupabaseClient().from('accounts')
      .select('stripe_subscription_id, subscription_status, subscription_plan')
      .eq('id', user.id)
      .single();
    
    // Se não houver dados ou assinatura, retornar sem assinatura
    if (!userData || !userData.stripe_subscription_id || userData.subscription_status !== 'active') {
      return {
        isActive: false,
        plan: userData?.subscription_plan || null,
        cancelAtPeriodEnd: false,
        currentPeriodEnd: null,
      };
    }
    
    // Se houver assinatura, obter detalhes da assinatura
    const paymentProvider = PaymentProviderFactory.getProvider();
    const subscription = await paymentProvider.getSubscription(userData.stripe_subscription_id);
    
    return {
      isActive: subscription.status === 'active',
      plan: subscription.plan,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      currentPeriodEnd: subscription.currentPeriodEnd,
    };
  } catch (error) {
    console.error('Erro ao verificar status da assinatura:', error);
    return {
      isActive: false,
      plan: null,
      cancelAtPeriodEnd: false,
      currentPeriodEnd: null,
    };
  }
}

/**
 * Middleware para verificar se o usuário tem uma assinatura ativa
 */
export function createSubscriptionGuard() {
  return async function subscriptionGuard(requiredPlan: string = 'any') {
    const status = await checkSubscriptionStatus();
    
    // Se não for necessário plano específico, apenas verifique se está ativo
    if (requiredPlan === 'any') {
      return status.isActive;
    }
    
    // Verificar se o plano do usuário atende aos requisitos
    if (!status.isActive || !status.plan) {
      return false;
    }
    
    // Permitir acesso se o plano for o requerido ou de nível superior
    if (status.plan === requiredPlan) {
      return true;
    }
    
    // Lógica para verificar hierarquia de planos
    if (requiredPlan === 'basico' && ['pro', 'enterprise'].includes(status.plan.toLowerCase())) {
      return true;
    }
    
    if (requiredPlan === 'pro' && status.plan.toLowerCase() === 'enterprise') {
      return true;
    }
    
    return false;
  };
} 