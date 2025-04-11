import { NextResponse } from 'next/server';
import { createSSRSassClient } from '@/lib/supabase/server';
import { PaymentProviderFactory } from '@/providers/stripe';
import { cookies } from 'next/headers';

// Textos persuasivos para cada plano
const CHECKOUT_COPY = {
  'price_pro_monthly': {
    title: 'Desbloqueie Todo o Potencial das Suas Reuniões',
    description: 'O Plano Pro oferece análises ilimitadas de reuniões, transcrição avançada e muito mais.',
    features: [
      '✓ Economize 5+ horas por semana em documentação de reuniões',
      '✓ Capture insights valiosos que normalmente seriam perdidos',
      '✓ Integração com suas ferramentas favoritas'
    ],
    socialProof: 'Mais de 500 equipes já transformaram suas reuniões com o MeetAnalyzer',
    guaranteeText: 'Cancele facilmente a qualquer momento. Sem compromisso de longo prazo.',
    upsellText: 'Ganhe 2 meses grátis com pagamento anual'
  },
  'price_enterprise_monthly': {
    title: 'Solução Enterprise Personalizada',
    description: 'Tudo que você precisa para transformar a comunicação da sua empresa.',
    features: [
      '✓ Análise ilimitada para equipes de qualquer tamanho',
      '✓ Suporte dedicado e implementação personalizada',
      '✓ Segurança e compliance de nível empresarial'
    ],
    socialProof: 'Utilizado por empresas como Acme Inc., TechCorp e Global Solutions',
    guaranteeText: 'Satisfação garantida ou seu dinheiro de volta em até 30 dias.',
    upsellText: 'Fale com nosso time de vendas para um desconto personalizado'
  }
};

/**
 * API route para criar uma sessão de checkout do Stripe
 * Endpoint: POST /api/stripe/create-checkout-session
 */
export async function POST(req: Request) {
  try {
    const { priceId, returnUrl } = await req.json();
    
    // Verificar dados obrigatórios
    if (!priceId || !returnUrl) {
      return NextResponse.json(
        { error: 'Dados obrigatórios ausentes: priceId, returnUrl' },
        { status: 400 }
      );
    }

    // Obter usuário autenticado
    const client = await createSSRSassClient();
    const user = await client.getUser();
    
    if (!user) {
      console.error('Usuário não autenticado');
      return NextResponse.json(
        { error: 'Usuário não autenticado', redirectTo: '/auth/login' },
        { status: 401 }
      );
    }

    // Obter o provider de pagamentos
    const paymentProvider = PaymentProviderFactory.getProvider();
    
    // Obter textos persuasivos para o plano específico ou usar texto padrão
    const checkoutCopy = CHECKOUT_COPY[priceId as keyof typeof CHECKOUT_COPY] || {
      title: 'Assine o MeetAnalyzer',
      description: 'Transforme suas reuniões em insights acionáveis',
      features: ['Análise de reuniões', 'Transcrição avançada', 'Insights de negócios'],
      guaranteeText: 'Cancele a qualquer momento'
    };
    
    // Criar a sessão de checkout com textos otimizados
    const session = await paymentProvider.createCheckoutSession({
      priceId,
      customerEmail: user.email,
      metadata: { 
        userId: user.id,
        planId: priceId 
      },
      returnUrl,
      // Adicionar textos persuasivos
      checkoutTitle: checkoutCopy.title,
      checkoutDescription: checkoutCopy.description,
      features: checkoutCopy.features,
      socialProof: checkoutCopy.socialProof,
      guaranteeText: checkoutCopy.guaranteeText,
      upsellText: checkoutCopy.upsellText
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 