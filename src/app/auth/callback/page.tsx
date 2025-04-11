'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createSPASassClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Recuperar parâmetros de redirecionamento e plano
        const plan = searchParams.get('plan');
        const returnTo = searchParams.get('returnTo');
        let redirect = searchParams.get('redirect') || '/app/dashboard';
        
        // Verificar se o usuário está autenticado
        const client = createSPASassClient();
        const user = await client.getUser();
        
        if (!user) {
          throw new Error('Falha na autenticação');
        }
        
        // Armazenar o plano selecionado no localStorage, se existir
        if (plan) {
          localStorage.setItem('selectedPlan', plan);
          
          // Adicionar parâmetro de onboarding ao redirect se não existir
          if (!redirect.includes('newUser=')) {
            redirect += redirect.includes('?') ? '&newUser=true' : '?newUser=true';
          }
        }
        
        // Determinar para onde redirecionar
        let finalRedirect = redirect;
        
        // Se existe um parâmetro returnTo (página original) e for uma página de pricing/checkout,
        // retornar para essa página em vez do dashboard genérico
        if (returnTo) {
          try {
            const decodedReturnTo = decodeURIComponent(returnTo);
            // Verificar se é uma página de pricing ou alguma página de produto
            if (decodedReturnTo.includes('/pricing') || 
                decodedReturnTo.includes('/checkout') || 
                decodedReturnTo.includes('/plans')) {
              finalRedirect = decodedReturnTo;
            }
          } catch (e) {
            console.error('Erro ao decodificar returnTo:', e);
          }
        }
        
        // Redirecionar para o destino pretendido
        router.push(finalRedirect);
      } catch (error) {
        console.error('Erro no callback de autenticação:', error);
        setError('Ocorreu um erro durante o processo de autenticação. Por favor, tente novamente.');
      }
    };
    
    handleCallback();
  }, [searchParams, router]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 max-w-md">
          <h3 className="text-lg font-semibold mb-2">Erro de autenticação</h3>
          <p>{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
            onClick={() => router.push('/auth/login')}
          >
            Voltar para o login
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Redirecionando...</p>
        </div>
      )}
    </div>
  );
} 