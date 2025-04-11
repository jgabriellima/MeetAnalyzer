'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckoutButton } from '@/components/billing/CheckoutButton';
import { createSPASassClient } from '@/lib/supabase/client';
import { usePathname } from 'next/navigation';

interface AdaptiveButtonProps {
  priceId: string;
  planName: string;
  isBasic?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
}

/**
 * Botão adaptativo que se comporta de maneira diferente dependendo do estado de autenticação
 */
export function AdaptiveButton({ priceId, planName, isBasic = false, variant = 'default' }: AdaptiveButtonProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const client = createSPASassClient();
        const user = await client.getUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Estado de carregamento enquanto verifica autenticação
  if (isAuthenticated === null) {
    return (
      <Button variant={variant} className="w-full" disabled>
        Carregando...
      </Button>
    );
  }
  
  // Usuário não autenticado - botão de signup
  if (!isAuthenticated) {
    // Codificar o caminho atual para redirecionamento após login
    const returnPath = encodeURIComponent(pathname);
    const redirectPath = encodeURIComponent('/app/dashboard');
    
    return (
      <Button asChild variant={variant} className="w-full">
        <Link href={`/auth/signup?plan=${planName}&returnTo=${returnPath}&redirect=${redirectPath}`}>
          {isBasic ? 'Começar Grátis' : 'Experimentar Agora'}
        </Link>
      </Button>
    );
  }
  
  // Usuário autenticado - para plano básico, redireciona para dashboard
  if (isAuthenticated && isBasic) {
    return (
      <Button variant={variant} className="w-full" asChild>
        <Link href="/app/dashboard">
          Acessar Dashboard
        </Link>
      </Button>
    );
  }
  
  // Usuário autenticado - para planos pagos, exibe botão de checkout
  return (
    <CheckoutButton priceId={priceId} planName={planName} variant={variant} />
  );
} 