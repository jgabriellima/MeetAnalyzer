'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check, ArrowRight, ArrowLeft, Network, FileText, Target, Calendar, Zap, MessagesSquare, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { createSPASassClient } from '@/lib/supabase/client';
import { createClient } from '@/lib/supabase/client';

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Bem-vindo ao MeetAnalyzer',
    description: 'Sua plataforma para transformar reuniões em insights acionáveis'
  },
  {
    id: 2,
    title: 'Análise Temática',
    description: 'Descubra temas recorrentes e conexões entre suas reuniões'
  },
  {
    id: 3,
    title: 'Configuração Inicial',
    description: 'Vamos configurar seu espaço de trabalho'
  },
  {
    id: 4,
    title: 'Comece sua Jornada',
    description: 'Está pronto para obter insights transformadores'
  }
];

/**
 * Componente para exibir fluxo de onboarding para novos usuários
 */
export function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    // Verificar se há um plano selecionado no localStorage
    const plan = localStorage.getItem('selectedPlan');
    if (plan) {
      setSelectedPlan(plan);
    }
    
    // Buscar informações do usuário
    const fetchUserInfo = async () => {
      try {
        const sassClient = createSPASassClient();
        const supabase = createClient();
        const user = await sassClient.getUser();
        if (user) {
          // Buscar perfil do usuário para obter o nome
          const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
          if (data && data.full_name) {
            setUserName(data.full_name);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
      }
    };
    
    fetchUserInfo();
  }, []);
  
  const handleDismiss = () => {
    setIsVisible(false);
    // Salvar no localStorage que o usuário viu o onboarding
    localStorage.setItem('onboardingCompleted', 'true');
  };
  
  const handleNextStep = () => {
    if (step < ONBOARDING_STEPS.length) {
      setStep(step + 1);
    } else {
      handleDismiss();
    }
  };
  
  if (!isVisible) {
    return null;
  }
  
  const progressPercentage = (step / ONBOARDING_STEPS.length) * 100;
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-lg font-medium mb-3">
                Olá {userName || 'Usuário'}, seja bem-vindo ao MeetAnalyzer!
              </h3>
              <p className="text-muted-foreground mb-4">
                {selectedPlan 
                  ? `Você escolheu o plano ${selectedPlan}.` 
                  : 'Você está no período de avaliação gratuito.'}
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Análise baseada em temas</p>
                    <p className="text-sm text-muted-foreground">Agrupe insights por assuntos, não apenas por reuniões</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Network className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Visualização de relações</p>
                    <p className="text-sm text-muted-foreground">Veja conexões entre temas e participantes</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Target className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Extração automática de ações</p>
                    <p className="text-sm text-muted-foreground">Acompanhe compromissos assumidos nas reuniões</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="/images/onboarding-welcome.svg" 
                alt="Bem-vindo ao MeetAnalyzer" 
                className="max-w-full h-auto md:max-h-64" 
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-lg font-medium mb-3">Descubra insights ocultos em suas reuniões</h3>
              <p className="text-muted-foreground mb-4">
                Em vez de simplesmente organizar reuniões cronologicamente, o MeetAnalyzer identifica temas e cria uma rede de conhecimento conectada.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Visualização tema a tema entre diferentes reuniões</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Identificação de padrões recorrentes nas discussões</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Resumos inteligentes com pontos-chave</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Análise de sentimento dos participantes</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="/images/theme-analysis.svg" 
                alt="Análise temática de reuniões" 
                className="max-w-full h-auto md:max-h-64" 
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Configurando seu espaço de trabalho</h3>
            <p className="text-muted-foreground">
              Complete estas etapas iniciais para obter o máximo do MeetAnalyzer:
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <Calendar className="h-5 w-5 text-primary mr-2" />
                  <h4 className="font-medium">Conecte seu calendário</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Sincronize reuniões automaticamente do Google Calendar ou Outlook
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/app/settings/integrations">
                    Configurar
                  </Link>
                </Button>
              </div>
              
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <MessagesSquare className="h-5 w-5 text-primary mr-2" />
                  <h4 className="font-medium">Integre com outros apps</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Conecte com Slack, Teams, Zoom e outras ferramentas de colaboração
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/app/settings/integrations">
                    Explorar integrações
                  </Link>
                </Button>
              </div>
              
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <FileText className="h-5 w-5 text-primary mr-2" />
                  <h4 className="font-medium">Importe sua primeira reunião</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Faça upload de um arquivo de áudio/vídeo ou transcrição existente
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/app/meetings/new">
                    Importar reunião
                  </Link>
                </Button>
              </div>
              
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <Zap className="h-5 w-5 text-primary mr-2" />
                  <h4 className="font-medium">Convide sua equipe</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Compartilhe insights e colabore com colegas de equipe
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/app/settings/team">
                    Adicionar membros
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="flex flex-col items-center text-center space-y-6">
            <img 
              src="/images/onboarding-complete.svg" 
              alt="Configuração concluída" 
              className="w-40 h-40 mb-2" 
            />
            <div>
              <h3 className="text-xl font-medium mb-2">Tudo pronto para começar!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Você está configurado para transformar suas reuniões em insights valiosos e ações concretas.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
              <Button variant="default" asChild>
                <Link href="/app/meetings/new">
                  Adicionar primeira reunião
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/app/templates">
                  Explorar templates
                </Link>
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Card className="mb-8 border-blue-200 shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-primary/10 to-blue-50 px-6 pt-6 pb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium">
              {step}
            </div>
            <h2 className="text-xl font-semibold">{ONBOARDING_STEPS[step-1].title}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            Pular
          </Button>
        </div>
        <p className="text-muted-foreground">{ONBOARDING_STEPS[step-1].description}</p>
        <Progress value={progressPercentage} className="h-1.5 mt-4" />
      </div>
      
      <div className="p-6">
        {renderStepContent()}
      </div>
      
      <div className="px-6 py-4 bg-muted/20 flex justify-between">
        <Button 
          variant="ghost" 
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button onClick={handleNextStep}>
          {step < ONBOARDING_STEPS.length ? (
            <>
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            'Começar a usar'
          )}
        </Button>
      </div>
    </Card>
  );
} 