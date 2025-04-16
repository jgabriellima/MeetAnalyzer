import { NextResponse } from 'next/server';
import { checkSubscriptionStatus } from '@/lib/subscription';

/**
 * API route para obter o status da assinatura do usuário
 * Endpoint: GET /api/subscription/status
 */
export async function GET() {
  try {
    // Use o método AWAIT explicitamente para garantir comportamento assíncrono
    const subscriptionStatus = await checkSubscriptionStatus();
    
    // Log para debug
    console.log('Subscription status fetched successfully:', subscriptionStatus);
    
    return NextResponse.json(subscriptionStatus);
  } catch (error) {
    console.error('Erro ao obter status da assinatura:', error);
    
    // Retorna um resultado padrão para evitar quebrar a UI em caso de erro
    return NextResponse.json({
      isActive: false,
      plan: null,
      cancelAtPeriodEnd: false,
      currentPeriodEnd: null,
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
} 