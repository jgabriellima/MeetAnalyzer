'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CheckoutButtonProps {
  priceId: string;
  planName: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
}

/**
 * Botão para iniciar o processo de checkout do Stripe
 */
export function CheckoutButton({ priceId, planName, variant = 'default' }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Chamar a API para criar a sessão de checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/app/billing/success`,
          cancelUrl: `${window.location.origin}/app/pricing`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Verificar se é um erro de autenticação
        if (response.status === 401 && data.redirectTo) {
          // Redirecionar para a página de login com parâmetro de redirecionamento
          const returnPath = encodeURIComponent(window.location.pathname);
          router.push(`${data.redirectTo}?returnTo=${returnPath}&plan=${planName}`);
          return;
        }
        throw new Error(data.error || 'Falha ao criar sessão de checkout');
      }

      // Redirecionar para a página de checkout do Stripe
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de checkout não recebida');
      }
    } catch (error) {
      console.error('Erro ao iniciar checkout:', error);
      alert('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout} 
      disabled={loading}
      variant={variant}
      className="w-full"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </>
      ) : (
        <>Assinar plano {planName}</>
      )}
    </Button>
  );
} 