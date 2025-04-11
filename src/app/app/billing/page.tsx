'use client';

import { useEffect, useState } from 'react';
import { SubscriptionStatus } from '@/components/billing/SubscriptionStatus';
import { ManageSubscriptionButton } from '@/components/billing/ManageSubscriptionButton';
import { type SubscriptionStatus as SubscriptionStatusType } from '@/lib/subscription';
import { ArrowUpRight, Clock, CreditCard, Calendar, Shield, Check, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

/**
 * Página de gerenciamento de assinatura na conta do usuário
 * Esta página está dentro do AppLayout para manter consistência com o resto da aplicação
 */
export default function BillingPage() {
  const [subscription, setSubscription] = useState<SubscriptionStatusType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/subscription/status');
        if (response.ok) {
          const data = await response.json();
          setSubscription(data);
        }
      } catch (error) {
        console.error('Erro ao obter informações da assinatura:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Central de Assinatura</h1>
        <p className="text-muted-foreground">
          Gerencie sua assinatura, acesse faturas e aproveite ao máximo os benefícios do MeetAnalyzer
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Carregando informações da assinatura...</p>
          </div>
        </div>
      ) : !subscription ? (
        <div className="bg-gradient-to-br from-muted/40 to-muted/20 rounded-xl py-12 px-8">
          <div className="max-w-2xl mx-auto text-center">
            <Award className="h-16 w-16 mx-auto mb-6 text-muted-foreground/60" />
            <h2 className="text-2xl font-bold mb-4">Desbloqueie todo o potencial das suas reuniões</h2>
            <p className="text-muted-foreground mb-8">
              Você ainda não possui uma assinatura ativa. Assine agora para acessar recursos avançados, transcrições ilimitadas e insights poderosos para suas reuniões.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/precos">
                  Ver Planos Disponíveis <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/app">
                  Voltar ao Dashboard
                </Link>
              </Button>
            </div>
            
            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              <div className="bg-background p-4 rounded-lg shadow-sm">
                <Clock className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-medium mb-1">Economize tempo</h3>
                <p className="text-sm text-muted-foreground">Reduza o tempo de documentação em até 80%</p>
              </div>
              <div className="bg-background p-4 rounded-lg shadow-sm">
                <Award className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-medium mb-1">Insights valiosos</h3>
                <p className="text-sm text-muted-foreground">Capture insights que normalmente seriam perdidos</p>
              </div>
              <div className="bg-background p-4 rounded-lg shadow-sm">
                <Shield className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-medium mb-1">Satisfação garantida</h3>
                <p className="text-sm text-muted-foreground">Cancele facilmente a qualquer momento</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <SubscriptionStatus 
              status={subscription.isActive ? 'active' : 'inativa'}
              plan={subscription.plan || 'Básico'}
              currentPeriodEnd={subscription.currentPeriodEnd || undefined}
              cancelAtPeriodEnd={subscription.cancelAtPeriodEnd}
            />
            
            {subscription.isActive && (
              <div className="mt-8 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Gerenciar Assinatura
                    </CardTitle>
                    <CardDescription>
                      Atualize seu plano, método de pagamento ou configurações de faturamento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span>Altere seu plano a qualquer momento</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span>Atualize suas informações de pagamento</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        <span>Gerencie cancelamento ou renovação</span>
                      </li>
                    </ul>
                    <ManageSubscriptionButton variant="default" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Histórico de Faturas
                    </CardTitle>
                    <CardDescription>
                      Acesse e faça download de faturas e comprovantes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Para acessar seu histórico completo de faturas, baixar recibos ou alterar informações fiscais, acesse o portal do cliente.
                    </p>
                    <ManageSubscriptionButton variant="outline" />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          
          <div>
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle>Dicas de Uso</CardTitle>
                <CardDescription>Aproveite ao máximo sua assinatura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-primary pl-4 py-1">
                  <h3 className="font-medium">Integre calendários</h3>
                  <p className="text-sm text-muted-foreground">Conecte seu Google Calendar para análise automática de reuniões</p>
                </div>
                <div className="border-l-4 border-primary pl-4 py-1">
                  <h3 className="font-medium">Convide sua equipe</h3>
                  <p className="text-sm text-muted-foreground">Adicione colaboradores para compartilhar insights</p>
                </div>
                <div className="border-l-4 border-primary pl-4 py-1">
                  <h3 className="font-medium">Configure integrações</h3>
                  <p className="text-sm text-muted-foreground">Conecte com seu CRM para enriquecer seus dados</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/app/settings/integrations">
                    Configurar Integrações <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            {subscription.isActive && !subscription.plan?.includes("Enterprise") && (
              <Card className="mt-6 border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle>Quer mais recursos?</CardTitle>
                  <CardDescription>Faça upgrade para um plano superior</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Mais horas de transcrição</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Análise avançada de sentimento</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>Suporte prioritário</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/precos">Ver Planos Superiores</Link>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-16 bg-muted/30 rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Precisa de ajuda com sua assinatura?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Nossa equipe de suporte está disponível para ajudar com qualquer dúvida sobre faturamento, planos ou recursos.
        </p>
        <Button variant="outline" asChild>
          <Link href="/app/suporte">Contatar Suporte</Link>
        </Button>
      </div>
    </div>
  );
} 