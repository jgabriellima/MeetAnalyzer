'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  requiredPlan?: string;
  fallbackUrl?: string;
  loadingComponent?: React.ReactNode;
}

/**
 * Componente para proteger conteúdo baseado em assinatura
 * Redireciona para a página de preços se o usuário não tiver a assinatura necessária
 */
export function SubscriptionGuard({
  children,
  requiredPlan = 'any',
  fallbackUrl = '/precos',
  loadingComponent = <div>Verificando assinatura...</div>,
}: SubscriptionGuardProps) {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch('/api/subscription/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requiredPlan }),
        });

        if (!response.ok) {
          setHasAccess(false);
          router.push(fallbackUrl);
          return;
        }

        const { hasAccess } = await response.json();
        setHasAccess(hasAccess);
        
        if (!hasAccess) {
          router.push(fallbackUrl);
        }
      } catch (error) {
        console.error('Erro ao verificar assinatura:', error);
        setHasAccess(false);
        router.push(fallbackUrl);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [requiredPlan, router, fallbackUrl]);

  if (loading) {
    return <>{loadingComponent}</>;
  }

  return hasAccess ? <>{children}</> : null;
} 