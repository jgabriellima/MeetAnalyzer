'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ManageSubscriptionButton } from './ManageSubscriptionButton';
import { Check, Clock, ShieldCheck, CalendarClock, AlertTriangle } from 'lucide-react';

interface SubscriptionStatusProps {
  status: string;
  plan?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

/**
 * Componente para exibir o status da assinatura atual do usuário
 */
export function SubscriptionStatus({
  status,
  plan = 'Básico',
  currentPeriodEnd,
  cancelAtPeriodEnd = false,
}: SubscriptionStatusProps) {
  // Determinar cor do badge com base no status
  const getBadgeVariant = () => {
    switch (status) {
      case 'active':
        return 'default';
      case 'past_due':
      case 'unpaid':
        return 'destructive';
      case 'canceled':
      case 'inativa':
        return 'secondary';
      case 'trialing':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  // Obter texto do status em português
  const getStatusText = () => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'past_due':
        return 'Pagamento Pendente';
      case 'unpaid':
        return 'Não Paga';
      case 'canceled':
      case 'inativa':
        return 'Cancelada';
      case 'trialing':
        return 'Em Período de Teste';
      default:
        return status;
    }
  };

  // Obter ícone do status
  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <Check className="h-5 w-5" />;
      case 'past_due':
      case 'unpaid':
        return <AlertTriangle className="h-5 w-5" />;
      case 'canceled':
      case 'inativa':
        return <Clock className="h-5 w-5" />;
      case 'trialing':
        return <ShieldCheck className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  // Formatar data de término do período
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Card className="w-full overflow-hidden border-2 border-primary/10">
      <div className={`w-full h-2 ${status === 'active' ? 'bg-primary' : status === 'past_due' || status === 'unpaid' ? 'bg-destructive' : 'bg-muted'}`}></div>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">Plano {plan}</CardTitle>
            <CardDescription className="mt-1">
              {status === 'active' && !cancelAtPeriodEnd 
                ? 'Sua assinatura está ativa e será renovada automaticamente.'
                : cancelAtPeriodEnd 
                  ? 'Sua assinatura será cancelada ao final deste período.'
                  : 'Você não possui uma assinatura ativa.'
              }
            </CardDescription>
          </div>
          <Badge 
            variant={getBadgeVariant()} 
            className="px-4 py-2 text-base flex items-center gap-2 self-start sm:self-center"
          >
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-6">
        {currentPeriodEnd && (status === 'active' || cancelAtPeriodEnd) && (
          <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
            <CalendarClock className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="font-medium">
                {cancelAtPeriodEnd 
                  ? 'Acesso disponível até'
                  : 'Próxima cobrança em'
                }
              </p>
              <p className="text-muted-foreground">
                {formatDate(currentPeriodEnd)}
              </p>
            </div>
          </div>
        )}

        {status === 'active' && !cancelAtPeriodEnd && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-primary/5 rounded-lg p-4 flex flex-col">
              <h3 className="font-medium mb-2 flex items-center">
                <ShieldCheck className="h-5 w-5 text-primary mr-2" />
                Benefícios do Plano {plan}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground flex-grow">
                {plan === 'Pro' || plan === 'Enterprise' ? (
                  <>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Transcrição automática avançada</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Análise ilimitada de reuniões</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>Análise básica de reuniões</span>
                    </li>
                  </>
                )}
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  <span>Armazenamento seguro</span>
                </li>
              </ul>
            </div>
            
            {(plan === 'Básico' || plan === 'Pro') && (
              <div className="flex-1 bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 flex flex-col">
                <h3 className="font-medium mb-2 text-blue-700 dark:text-blue-400 flex items-center">
                  <span className="h-5 w-5 rounded-full bg-blue-700 dark:bg-blue-400 text-white mr-2 flex items-center justify-center text-xs">+</span>
                  Benefícios do próximo plano
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground flex-grow">
                  {plan === 'Básico' ? (
                    <>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Análise ilimitada de reuniões</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Visualizações avançadas</span>
                      </li>
                    </>
                  ) : plan === 'Pro' ? (
                    <>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>Suporte prioritário 24/7</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                        <span>API dedicada</span>
                      </li>
                    </>
                  ) : null}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {status === 'active' && (
        <CardFooter className="bg-muted/30 pt-4">
          <ManageSubscriptionButton variant="default" />
        </CardFooter>
      )}
    </Card>
  );
} 