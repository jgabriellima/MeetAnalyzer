'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2, CreditCard } from 'lucide-react';

interface ManageSubscriptionButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

/**
 * Botão para acessar o portal do cliente Stripe para gerenciar assinaturas
 */
export function ManageSubscriptionButton({ 
  variant = 'outline', 
  size = 'default',
  className = ''
}: ManageSubscriptionButtonProps) {
  const [loading, setLoading] = useState(false);
  
  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/app/billing`,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao acessar portal');
      }
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Erro ao acessar portal do cliente:', error);
      alert('Não foi possível acessar o portal de gerenciamento de assinatura. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleManageSubscription} 
      disabled={loading}
      variant={variant}
      size={size}
      className={`group transition-all ${className} ${variant === 'default' ? 'hover:bg-primary/90' : variant === 'outline' ? 'hover:bg-primary/5' : ''}`}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Carregando...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          Gerenciar Assinatura
          <ExternalLink className="h-3.5 w-3.5 ml-2 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </>
      )}
    </Button>
  );
} 