'use client';

import { useState, useEffect } from 'react';
import { SubscriptionGuard } from '@/components/auth/SubscriptionGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UpgradeBanner } from '@/components/billing/UpgradeBanner';
import { CheckoutButton } from '@/components/billing/CheckoutButton';

/**
 * Página de recursos premium
 * Mostra recursos premium para assinantes ou promoção de upgrade para usuários sem assinatura
 */
export default function PremiumFeaturesPage() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    isActive: boolean;
    plan: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Buscar o status da assinatura do usuário
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await fetch('/api/subscription/status');
        if (response.ok) {
          const data = await response.json();
          setSubscriptionStatus(data);
        }
      } catch (error) {
        console.error('Erro ao obter status da assinatura:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  // Se estiver carregando, mostrar indicador de carregamento
  if (loading) {
    return (
      <div className="container py-10 flex justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  // Se o usuário não tiver assinatura ativa, mostrar página de upgrade
  if (!subscriptionStatus?.isActive) {
    return (
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Recursos Premium</h1>
        
        <UpgradeBanner variant="full" />
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Escolha seu plano</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plano Básico */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle>Básico</CardTitle>
                <CardDescription>Para times pequenos</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">R$49</span>
                  <span className="text-gray-500 ml-1">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>10 horas de gravações/mês</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Transcrição automática</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Organização por temas</span>
                  </li>
                </ul>
                <CheckoutButton
                  priceId="price_1234567890"
                  planName="Básico"
                />
              </CardContent>
            </Card>
            
            {/* Plano Pro */}
            <Card className="border-2 border-primary-500 shadow-md transform md:-translate-y-2">
              <CardHeader className="bg-primary-50 rounded-t-lg">
                <div className="text-center text-primary-700 text-sm font-semibold mb-2">RECOMENDADO</div>
                <CardTitle>Pro</CardTitle>
                <CardDescription>Para equipes profissionais</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">R$99</span>
                  <span className="text-gray-500 ml-1">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>50 horas</strong> de gravações/mês</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Acesso a todos recursos básicos</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Visualizações de relacionamento</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Integração com CRM</span>
                  </li>
                </ul>
                <CheckoutButton
                  priceId="price_0987654321"
                  planName="Pro"
                />
              </CardContent>
            </Card>
            
            {/* Plano Enterprise */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>Para grandes organizações</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">R$249</span>
                  <span className="text-gray-500 ml-1">/mês</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Horas ilimitadas</strong> de gravações</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Acesso a todos recursos Pro</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Análise emocional</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Suporte dedicado 24/7</span>
                  </li>
                </ul>
                <CheckoutButton
                  priceId="price_2468135790"
                  planName="Enterprise"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Se o usuário tiver assinatura ativa, mostrar os recursos premium
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Recursos Premium</h1>
      <p className="text-muted-foreground mb-8">
        Aproveite os recursos exclusivos disponíveis para assinantes do plano {subscriptionStatus.plan || 'Pro'}.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          title="Visualizações de Relacionamento"
          description="Visualize conexões entre temas e tópicos em várias reuniões com gráficos interativos avançados."
          icon="🔗"
        />
        
        <FeatureCard
          title="Integração com CRM"
          description="Conecte insights de reuniões diretamente ao seu sistema de CRM para acompanhamento de oportunidades."
          icon="💼"
        />
        
        <FeatureCard
          title="Relatórios Avançados"
          description="Gere relatórios personalizados com métricas detalhadas e tendências ao longo do tempo."
          icon="📊"
        />
        
        <FeatureCard
          title="Compartilhamento Avançado"
          description="Compartilhe insights específicos com controles granulares de permissão e colaboração em tempo real."
          icon="🔄"
        />
        
        <FeatureCard
          title="Horas Adicionais"
          description="Processe até 50 horas de gravações mensalmente para capturar mais conversas importantes."
          icon="⏱️"
        />
        
        <FeatureCard
          title="Exportação de Dados"
          description="Exporte transcrições, temas e análises em vários formatos para uso em outras ferramentas."
          icon="📤"
        />
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="text-3xl">{icon}</div>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
} 