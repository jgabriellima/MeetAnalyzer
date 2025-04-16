import { createSSRSassClient } from '@/lib/supabase/server';
import { PaymentProviderFactory } from '@/providers/stripe';

export type SubscriptionStatus = {
  isActive: boolean;
  plan: string | null;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
};

// Interface para dados do usuário
interface UserData {
  stripe_subscription_id?: string | null;
  subscription_status?: string | null;
  subscription_plan?: string | null;
}

/**
 * Verifica o status da assinatura de um usuário
 */
export async function checkSubscriptionStatus(): Promise<SubscriptionStatus> {
  try {
    // Obter cliente do Supabase
    const client = await createSSRSassClient();
    
    let user;
    try {
      user = await client.getUser();
    } catch (userError) {
      console.error('Erro ao obter informações do usuário:', userError);
      return {
        isActive: false,
        plan: null,
        cancelAtPeriodEnd: false,
        currentPeriodEnd: null,
      };
    }
    
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
    let userData: UserData | null = null;
    try {
      // Primeiro, vamos tentar buscar o registro existente
      const { data, error } = await client.getSupabaseClient().from('accounts')
        .select('stripe_subscription_id, subscription_status, subscription_plan')
        .eq('user_id', user.id)
        .maybeSingle(); // Usando maybeSingle em vez de single para não lançar erro se não existir
      
      // Se não houver erro mas também não houver dados, isso significa que o usuário não tem um registro na tabela accounts
      if (!error && !data) {
        console.log(`Usuário ${user.id} não tem registro na tabela accounts. Criando um registro padrão.`);
        
        // Vamos criar um registro padrão para o usuário
        const { data: newAccountData, error: insertError } = await client.getSupabaseClient()
          .from('accounts')
          .insert({
            user_id: user.id,
            created_at: new Date().toISOString(),
            subscription_status: 'inactive',
            subscription_plan: null,
            stripe_subscription_id: null
          })
          .select('stripe_subscription_id, subscription_status, subscription_plan')
          .single();
          
        if (insertError) {
          console.error('Erro ao criar registro de conta para o usuário:', insertError);
          // Continuar com dados nulos mesmo com erro
        } else {
          userData = newAccountData as UserData;
          console.log('Registro criado com sucesso:', userData);
        }
      } else if (error) {
        // Se houver outro tipo de erro na consulta, registramos o erro
        console.error('Erro ao buscar dados de assinatura do banco:', error);
      } else {
        // Caso normal, dados encontrados
        userData = data as UserData;
      }
    } catch (dbError) {
      console.error('Erro inesperado ao interagir com o banco de dados:', dbError);
    }
    
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
    try {
      const paymentProvider = PaymentProviderFactory.getProvider();
      const subscription = await paymentProvider.getSubscription(userData.stripe_subscription_id);
      
      return {
        isActive: subscription.status === 'active',
        plan: subscription.plan,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        currentPeriodEnd: subscription.currentPeriodEnd,
      };
    } catch (stripeError) {
      console.error('Erro ao verificar assinatura no Stripe:', stripeError);
      // Retornar baseado nos dados do banco, mesmo sem confirmar com o Stripe
      return {
        isActive: userData.subscription_status === 'active',
        plan: userData.subscription_plan || null,
        cancelAtPeriodEnd: false,
        currentPeriodEnd: null,
      };
    }
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