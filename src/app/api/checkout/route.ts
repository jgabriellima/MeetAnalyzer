import { NextResponse } from 'next/server';

/**
 * API route para criar uma sessão de checkout
 * Este endpoint redireciona para o endpoint de stripe correto para manter compatibilidade
 * Endpoint: POST /api/checkout
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { priceId, successUrl, cancelUrl } = body;
    
    // Verificar dados obrigatórios
    if (!priceId) {
      return NextResponse.json(
        { error: 'Dados obrigatórios ausentes: priceId' },
        { status: 400 }
      );
    }

    // Criar URL de retorno se não foi fornecida
    const returnUrl = successUrl || `${new URL(req.url).origin}/app/billing/success`;
    
    // Fazer chamada para o endpoint real
    const response = await fetch(new URL('/api/stripe/create-checkout-session', req.url).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.get('cookie') || '', // Passar cookies para manter a sessão
      },
      body: JSON.stringify({
        priceId,
        returnUrl,
      }),
    });

    // Obter dados da resposta
    const data = await response.json();
    
    // Retornar a resposta original, incluindo eventuais erros de autenticação
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 