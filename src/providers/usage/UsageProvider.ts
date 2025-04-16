import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Constantes de limites dos planos
export const PLAN_LIMITS = {
  free: {
    meetings: 5,
    storage_days: 30
  },
  pro: {
    meetings: 100000, // ilimitado para fins práticos
    storage_days: 365
  },
  enterprise: {
    meetings: 100000, // ilimitado para fins práticos
    storage_days: 3650 // ~10 anos
  }
};

// Interface para resultado da verificação de limites
export interface UsageLimitResult {
  current: number;
  limit: number;
  isLimited: boolean;
  percentUsed: number;
}

// Interface para item de uso
interface UsageItem {
  feature: string;
  count: number;
}

/**
 * Provedor para rastreamento de uso de recursos
 */
export class UsageProvider {
  private supabase;

  constructor() {
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  /**
   * Incrementa o contador de uso para um recurso específico
   */
  async incrementUsage(userId: string, feature: string): Promise<UsageLimitResult> {
    if (!userId) {
      throw new Error('ID de usuário é obrigatório');
    }

    try {
      // Incrementar o contador na tabela de uso
      const { data, error } = await this.supabase
        .from('usage')
        .upsert(
          { 
            user_id: userId, 
            feature, 
            count: 1,
            updated_at: new Date().toISOString()
          }, 
          { 
            onConflict: 'user_id,feature' 
          }
        )
        .select('count')
        .single();

      if (error) throw error;

      // Buscar plano atual do usuário
      const { data: accountData, error: accountError } = await this.supabase
        .from('accounts')
        .select('subscription_plan, subscription_status')
        .eq('id', userId)
        .single();

      if (accountError) throw accountError;

      const plan = accountData?.subscription_plan || 'free';
      const limits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;
      const limit = limits[feature as keyof typeof limits] || 0;
      const current = data?.count || 1;
      
      return {
        current,
        limit,
        isLimited: current >= limit,
        percentUsed: limit ? Math.min(100, Math.round((current / limit) * 100)) : 100
      };
    } catch (error) {
      console.error('Erro ao incrementar contador de uso:', error);
      throw error;
    }
  }

  /**
   * Verifica se um usuário atingiu o limite de um recurso
   */
  async checkUsageLimit(userId: string, feature: keyof typeof PLAN_LIMITS['free']): Promise<UsageLimitResult> {
    if (!userId) {
      throw new Error('ID de usuário é obrigatório');
    }

    try {
      // Buscar plano atual do usuário através da conta
      const { data: accountData, error: accountError } = await this.supabase
        .from('accounts')
        .select('subscription_plan')
        .eq('id', userId)
        .single();

      if (accountError) {
        console.error('Erro ao buscar plano atual do usuário:', accountError);
        throw accountError;
      }

      const plan = accountData?.subscription_plan || 'free';
      const limits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;
      const limit = limits[feature as keyof typeof limits] || 0;

      // Buscar contagem atual
      const { data, error } = await this.supabase
        .from('usage')
        .select('count')
        .eq('user_id', userId)
        .eq('feature', feature)
        .single();

      if (error && error.code !== 'PGRST116') { // Ignorar erro de não encontrado
        throw error;
      }

      const current = data?.count || 0;
      
      return {
        current,
        limit,
        isLimited: current >= limit,
        percentUsed: limit ? Math.min(100, Math.round((current / limit) * 100)) : 100
      };
    } catch (error) {
      console.error('Erro ao verificar limite de uso:', error);
      // Retornar valores padrão em caso de erro
      return {
        current: 0,
        limit: PLAN_LIMITS.free[feature] || 0,
        isLimited: false,
        percentUsed: 0
      };
    }
  }

  /**
   * Busca o uso atual de todos os recursos para um usuário
   */
  async getUserUsage(userId: string): Promise<Record<string, UsageLimitResult>> {
    if (!userId) {
      throw new Error('ID de usuário é obrigatório');
    }

    try {
      // Buscar todos os contadores de uso
      const { data, error } = await this.supabase
        .from('usage')
        .select('feature, count')
        .eq('user_id', userId);

      if (error) throw error;

      // Buscar plano atual do usuário
      const { data: accountData, error: accountError } = await this.supabase
        .from('accounts')
        .select('subscription_plan, subscription_status')
        .eq('id', userId)
        .single();

      if (accountError) throw accountError;

      const plan = accountData?.subscription_plan || 'free';
      const limits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;
      
      // Formatar resultado
      const result: Record<string, UsageLimitResult> = {};
      
      // Inicializar resultado com todas as features possíveis
      Object.keys(limits).forEach(feature => {
        const limit = limits[feature as keyof typeof limits] || 0;
        result[feature] = {
          current: 0,
          limit,
          isLimited: false,
          percentUsed: 0
        };
      });
      
      // Atualizar com dados reais
      data?.forEach((item: UsageItem) => {
        const feature = item.feature;
        const current = item.count;
        const limit = limits[feature as keyof typeof limits] || 0;
        
        result[feature] = {
          current,
          limit,
          isLimited: current >= limit,
          percentUsed: limit ? Math.min(100, Math.round((current / limit) * 100)) : 100
        };
      });
      
      return result;
    } catch (error) {
      console.error('Erro ao buscar uso do usuário:', error);
      throw error;
    }
  }

  /**
   * Factory para obter instância do provedor
   */
  static getProvider(): UsageProvider {
    return new UsageProvider();
  }
} 