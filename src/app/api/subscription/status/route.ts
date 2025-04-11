import { NextResponse } from 'next/server';
import { checkSubscriptionStatus } from '@/lib/subscription';

/**
 * API route para obter o status da assinatura do usuário
 * Endpoint: GET /api/subscription/status
 */
export async function GET() {
  try {
    const subscriptionStatus = await checkSubscriptionStatus();
    return NextResponse.json(subscriptionStatus);
  } catch (error) {
    console.error('Erro ao obter status da assinatura:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 