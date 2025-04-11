import { NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';
import { PaymentProviderFactory } from '@/providers/stripe';

/**
 * API route para criar uma sessão do portal do cliente do Stripe
 * Endpoint: POST /api/stripe/create-portal-session
 */
export async function POST(req: Request) {
  try {
    const { returnUrl } = await req.json();
    
    // Verificar dados obrigatórios
    if (!returnUrl) {
      return NextResponse.json(
        { error: 'URL de retorno é obrigatória' },
        { status: 400 }
      );
    }

    // Obter usuário autenticado
    const client = await createSSRSassClient();
    const user = await client.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }
    
    // Buscar o ID do cliente Stripe associado ao usuário
    const { data: userData } = await client.getSupabaseClient().from('accounts')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();
    
    if (!userData?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Cliente Stripe não encontrado' },
        { status: 404 }
      );
    }
    
    // Obter o provider de pagamentos
    const paymentProvider = PaymentProviderFactory.getProvider();
    
    // Criar a sessão do portal
    const session = await paymentProvider.createPortalSession(
      userData.stripe_customer_id,
      returnUrl
    );

    return NextResponse.json(session);
  } catch (error) {
    console.error('Erro ao criar sessão do portal:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 