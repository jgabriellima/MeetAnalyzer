"use client";
import React, { useEffect, useState } from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { 
  CalendarDays, 
  Settings, 
  ExternalLink, 
  FileText, 
  Users, 
  Clock, 
  ChevronRight, 
  Zap, 
  Check,
  PieChart,
  ListChecks,
  Network,
  Upload,
  AlertCircle,
  Calendar,
  BarChart,
  FileVideo,
  Info,
  Plus,
  BarChart2,
  Settings2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MeetingsList } from '@/components/meetings/MeetingsList';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { Suspense } from 'react';
import { createSPASassClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
import { EmptyThemesState } from '@/components/meetings/EmptyThemesState';

const WordCloud = dynamic(() => import('@/components/visualizations/WordCloud').then(mod => mod.WordCloud), {
    ssr: false,
    loading: () => <div className="h-[200px] w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
});

export default function DashboardContent() {
    const { user } = useGlobal();
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const isNewUser = searchParams.get('newUser') === 'true';
    const [userName, setUserName] = useState('');
    const [userSubscription, setUserSubscription] = useState<{
        status: 'trial' | 'active' | 'canceled' | 'none',
        plan: string | null,
        trialEndsAt: Date | null,
        daysRemaining: number
    }>({
        status: 'none',
        plan: null,
        trialEndsAt: null,
        daysRemaining: 0
    });
    const [usageStats, setUsageStats] = useState({
        meetingsAnalyzed: 0,
        meetingsLimit: 10,
        hoursProcessed: 0,
        hoursLimit: 5,
        themesIdentified: 0
    });
    const [mostDiscussedThemes, setMostDiscussedThemes] = useState<{name: string, count: number, trend: 'up' | 'down' | 'stable'}[]>([]);
    const [pendingActions, setPendingActions] = useState([]);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [userDaysSinceRegistration, setDaysSinceRegistration] = useState(0);
    
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const sassClient = createSPASassClient();
                const supabase = createSPASassClient();
                const user = await sassClient.getUser();
                
                if (user) {
                    // Buscar perfil do usuário
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('full_name, created_at')
                        .eq('id', user.id)
                        .single();
                    
                    if (profileData) {
                        setUserName(profileData.full_name || '');
                        
                        // Calcular dias desde o registro
                        if (profileData.created_at) {
                            const createdAt = new Date(profileData.created_at);
                            const today = new Date();
                            const diffTime = Math.abs(today.getTime() - createdAt.getTime());
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            setDaysSinceRegistration(diffDays);
                            
                            // Mostrar onboarding para usuários novos (menos de 2 dias)
                            if (diffDays < 2) {
                                const onboardingCompleted = localStorage.getItem('onboardingCompleted');
                                if (onboardingCompleted !== 'true') {
                                    setShowOnboarding(true);
                                }
                            }
                        }
                    }
                    
                    // Simular informações de assinatura (substituir com chamada real para API de assinatura)
                    // Em produção, isso seria buscado do banco de dados ou da API de pagamentos
                    const simulateSubscriptionData = () => {
                        const randomStatus = Math.random();
                        if (randomStatus < 0.3) {
                            // Usuário em trial
                            const trialEnd = new Date();
                            trialEnd.setDate(trialEnd.getDate() + 14); // Trial de 14 dias
                            const today = new Date();
                            const diffTime = Math.abs(trialEnd.getTime() - today.getTime());
                            const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            
                            return {
                                status: 'trial' as const,
                                plan: 'Trial',
                                trialEndsAt: trialEnd,
                                daysRemaining
                            };
                        } else if (randomStatus < 0.8) {
                            // Usuário com plano ativo
                            return {
                                status: 'active' as const,
                                plan: Math.random() > 0.5 ? 'Pro' : 'Enterprise',
                                trialEndsAt: null,
                                daysRemaining: 0
                            };
                        } else {
                            // Usuário sem plano
                            return {
                                status: 'none' as const,
                                plan: null,
                                trialEndsAt: null,
                                daysRemaining: 0
                            };
                        }
                    };
                    
                    setUserSubscription(simulateSubscriptionData());
                    
                    // Simular estatísticas de uso (substituir com dados reais)
                    const simulateUsageStats = () => {
                        const meetingsAnalyzed = Math.floor(Math.random() * 10);
                        const hoursProcessed = Math.round((Math.random() * 5) * 10) / 10;
                        
                        return {
                            meetingsAnalyzed,
                            meetingsLimit: 10,
                            hoursProcessed,
                            hoursLimit: 5,
                            themesIdentified: Math.floor(Math.random() * 15) + 1
                        };
                    };
                    
                    setUsageStats(simulateUsageStats());
                    
                    // Simular temas mais discutidos (substituir com análise real)
                    const simulateThemes = () => {
                        const themes = [
                            {name: 'Estratégia de Vendas', count: Math.floor(Math.random() * 10) + 5, trend: 'up' as const},
                            {name: 'Desenvolvimento de Produto', count: Math.floor(Math.random() * 8) + 3, trend: 'stable' as const},
                            {name: 'Marketing Digital', count: Math.floor(Math.random() * 6) + 2, trend: 'down' as const},
                            {name: 'Satisfação do Cliente', count: Math.floor(Math.random() * 5) + 1, trend: 'up' as const},
                            {name: 'Inovação', count: Math.floor(Math.random() * 4) + 1, trend: 'stable' as const}
                        ];
                        
                        return themes.sort((a, b) => b.count - a.count);
                    };
                    
                    setMostDiscussedThemes(simulateThemes());
                }
            } catch (error) {
                console.error('Erro ao buscar informações do usuário:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUserInfo();
    }, []);

    const getDaysSinceRegistration = () => {
        if (!user?.registered_at) return 0;
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - user.registered_at.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const isTrialUser = userSubscription.status === 'trial';

    return (
        <div className="space-y-8">
            {showOnboarding && <OnboardingFlow />}
            
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Bem-vindo, {userName || 'Visitante'}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {userDaysSinceRegistration === 0 
                            ? 'Você acabou de se cadastrar. Vamos começar!' 
                            : `Usuário há ${userDaysSinceRegistration} ${userDaysSinceRegistration === 1 ? 'dia' : 'dias'}`}
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    {userSubscription.status === 'trial' && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
                            Trial • {userSubscription.daysRemaining} dias restantes
                        </Badge>
                    )}
                    
                    {userSubscription.status === 'active' && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                            {userSubscription.plan}
                        </Badge>
                    )}
                    
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/app/settings/account">
                            <Settings2 className="h-4 w-4 mr-2" />
                            Configurações
                        </Link>
                    </Button>
                </div>
            </div>
            
            {/* Alerts baseados no status do usuário */}
            {userSubscription.status === 'trial' && userSubscription.daysRemaining <= 3 && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Seu período de teste está acabando!</AlertTitle>
                    <AlertDescription>
                        Você tem apenas {userSubscription.daysRemaining} dias restantes no seu período de avaliação. 
                        <Link href="/app/pricing" className="font-medium underline ml-1">
                            Faça upgrade agora
                        </Link> para continuar analisando suas reuniões.
                    </AlertDescription>
                </Alert>
            )}
            
            {/* Dashboard para usuários novos */}
            {userDaysSinceRegistration < 2 && (
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-xl">Maximize seu potencial com o MeetAnalyzer</CardTitle>
                        <CardDescription>Complete estas etapas para transformar suas reuniões em insights acionáveis</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                                <div className="flex items-center mb-2">
                                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                                        <FileVideo className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="font-medium">Adicione sua primeira reunião</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Carregue um arquivo de reunião para começar a extrair insights
                                </p>
                                <Button size="sm" asChild>
                                    <Link href="/app/meetings/new">
                                        Começar
                                    </Link>
                                </Button>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                                <div className="flex items-center mb-2">
                                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="font-medium">Conecte seu calendário</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Sincronize automaticamente suas próximas reuniões
                                </p>
                                <Button size="sm" variant="outline" asChild>
                                    <Link href="/app/settings/integrations">
                                        Conectar
                                    </Link>
                                </Button>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                                <div className="flex items-center mb-2">
                                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                                        <Sparkles className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="font-medium">Explore templates</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Utilize modelos prontos para diferentes tipos de reuniões
                                </p>
                                <Button size="sm" variant="outline" asChild>
                                    <Link href="/app/templates">
                                        Ver templates
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
            
            {/* Dashboard para usuários em trial */}
            {userSubscription.status === 'trial' && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Seu progresso no período de teste</CardTitle>
                        <CardDescription>
                            Aproveite ao máximo seu período de avaliação gratuito de 14 dias
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="font-medium flex items-center">
                                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                        Reuniões analisadas
                                    </div>
                                    <span className="text-sm font-medium">{usageStats.meetingsAnalyzed} de {usageStats.meetingsLimit}</span>
                                </div>
                                <Progress value={(usageStats.meetingsAnalyzed / usageStats.meetingsLimit) * 100} className="h-2" />
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="font-medium flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                        Horas processadas
                                    </div>
                                    <span className="text-sm font-medium">{usageStats.hoursProcessed} de {usageStats.hoursLimit}h</span>
                                </div>
                                <Progress value={(usageStats.hoursProcessed / usageStats.hoursLimit) * 100} className="h-2" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/20 flex justify-between">
                        <p className="text-sm text-muted-foreground">
                            Restam {userSubscription.daysRemaining} dias no seu teste
                        </p>
                        <Button size="sm" asChild>
                            <Link href="/app/pricing">
                                Fazer upgrade
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            )}
            
            {/* Seção de ações rápidas */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle>Ações rápidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Button variant="outline" className="h-auto py-4 px-4 justify-start" asChild>
                                <Link href="/app/meetings/new">
                                    <div className="flex flex-col items-start text-left">
                                        <div className="bg-primary/10 p-2 rounded-full mb-2">
                                            <Plus className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="font-medium">Nova reunião</span>
                                        <span className="text-xs text-muted-foreground mt-1">Adicionar reunião para análise</span>
                                    </div>
                                </Link>
                            </Button>
                            
                            <Button variant="outline" className="h-auto py-4 px-4 justify-start" asChild>
                                <Link href="/app/settings/integrations">
                                    <div className="flex flex-col items-start text-left">
                                        <div className="bg-primary/10 p-2 rounded-full mb-2">
                                            <Calendar className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="font-medium">Conectar calendário</span>
                                        <span className="text-xs text-muted-foreground mt-1">Sincronizar reuniões agendadas</span>
                                    </div>
                                </Link>
                            </Button>
                            
                            <Button variant="outline" className="h-auto py-4 px-4 justify-start" asChild>
                                <Link href="/app/templates">
                                    <div className="flex flex-col items-start text-left">
                                        <div className="bg-primary/10 p-2 rounded-full mb-2">
                                            <FileText className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="font-medium">Templates</span>
                                        <span className="text-xs text-muted-foreground mt-1">Modelos para tipos de reuniões</span>
                                    </div>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>Insights rápidos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <BarChart className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm">Reuniões analisadas</span>
                            </div>
                            <span className="font-medium">{usageStats.meetingsAnalyzed}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Zap className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm">Temas identificados</span>
                            </div>
                            <span className="font-medium">{usageStats.themesIdentified}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <PieChart className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm">Tema mais discutido</span>
                            </div>
                            <span className="font-medium">{mostDiscussedThemes[0]?.name || '-'}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Análise de Temas e Insights */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Card de Temas Mais Discutidos */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <BarChart2 className="h-5 w-5 mr-2" />
                            Temas mais discutidos
                        </CardTitle>
                        <CardDescription>
                            Análise temporal dos assuntos mais relevantes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {mostDiscussedThemes.length > 0 ? (
                            <div className="space-y-4">
                                {mostDiscussedThemes.map((theme, index) => (
                                    <div key={index} className="flex items-center justify-between group hover:bg-muted/50 p-2 rounded-lg transition-all">
                                        <div className="flex items-center flex-1">
                                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium">{index + 1}</div>
                                            <div className="ml-3 flex-1">
                                                <div className="font-medium flex items-center">
                                                    {theme.name}
                                                    {index === 0 && (
                                                        <Badge className="ml-2 bg-amber-100 text-amber-700 hover:bg-amber-200">Top Tema</Badge>
                                                    )}
                                                </div>
                                                <div className="text-sm text-muted-foreground flex items-center">
                                                    <span>{theme.count} {theme.count === 1 ? 'reunião' : 'reuniões'}</span>
                                                    <Badge variant={theme.trend === 'up' ? 'default' : theme.trend === 'down' ? 'destructive' : 'secondary'} 
                                                           className="ml-2 text-xs">
                                                        {theme.trend === 'up' ? '↑ +20%' : theme.trend === 'down' ? '↓ -10%' : '→ estável'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100" asChild>
                                            <Link href={`/app/themes/${theme.name.toLowerCase().replace(/ /g, '-')}`}>
                                                Analisar
                                                <ArrowRight className="ml-1 h-3 w-3" />
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyThemesState />
                        )}
                    </CardContent>
                    {mostDiscussedThemes.length > 0 && (
                        <CardFooter className="bg-muted/10 border-t">
                            <div className="w-full flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 inline mr-1" />
                                    Atualizado há 2 horas
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/app/themes">
                                        Ver análise completa
                                        <ExternalLink className="ml-1 h-3 w-3" />
                                    </Link>
                                </Button>
                            </div>
                        </CardFooter>
                    )}
                </Card>

                {/* Card de Insights e Oportunidades */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Sparkles className="h-5 w-5 mr-2" />
                            Insights e Oportunidades
                        </CardTitle>
                        <CardDescription>
                            Visualização interativa e recomendações
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {mostDiscussedThemes.length > 0 ? (
                            <div className="space-y-6">
                                <div className="h-[200px] w-full">
                                    <WordCloud
                                        words={mostDiscussedThemes.map(theme => ({
                                            text: theme.name,
                                            value: theme.count * 10
                                        }))}
                                    />
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <h4 className="font-medium flex items-center text-blue-700">
                                            <Zap className="h-4 w-4 mr-2" />
                                            Oportunidade Identificada
                                        </h4>
                                        <p className="text-sm text-blue-600 mt-1">
                                            Suas reuniões de {mostDiscussedThemes[0]?.name} estão consumindo 40% mais tempo que a média.
                                            Otimize com nossos templates especializados.
                                        </p>
                                        <Button size="sm" className="mt-2" variant="outline" asChild>
                                            <Link href="/app/templates/efficiency">
                                                Ver templates de otimização
                                            </Link>
                                        </Button>
                                    </div>

                                    {!userSubscription.plan?.includes('Enterprise') && (
                                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                            <h4 className="font-medium flex items-center text-purple-700">
                                                <ListChecks className="h-4 w-4 mr-2" />
                                                Desbloqueie Mais Insights
                                            </h4>
                                            <p className="text-sm text-purple-600 mt-1">
                                                Upgrade para Enterprise e tenha acesso a análises avançadas de tendências,
                                                benchmarks do setor e IA generativa para otimização.
                                            </p>
                                            <Button size="sm" className="mt-2" variant="outline" asChild>
                                                <Link href="/app/pricing">
                                                    Conhecer plano Enterprise
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <EmptyThemesState />
                        )}
                    </CardContent>
                </Card>
            </div>
            
            {/* Lista de reuniões recentes */}
            <Card>
                <CardHeader>
                    <CardTitle>Reuniões recentes</CardTitle>
                    <CardDescription>Veja suas reuniões recentes e continue de onde parou</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<Skeleton className="h-32 w-full" />}>
                        <MeetingsList />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}