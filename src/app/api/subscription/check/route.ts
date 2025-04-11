import { NextResponse } from 'next/server';
import { createSubscriptionGuard } from '@/lib/subscription';

/**
 * API route para verificar a assinatura do usuário
 * Endpoint: POST /api/subscription/check
 */
export async function POST(req: Request) {
  try {
    const { requiredPlan = 'any' } = await req.json();
    
    const subscriptionGuard = createSubscriptionGuard();
    const hasAccess = await subscriptionGuard(requiredPlan);
    
    return NextResponse.json({ hasAccess });
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 