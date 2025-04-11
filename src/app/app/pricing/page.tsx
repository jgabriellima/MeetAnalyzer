import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, ArrowRight, Clock, AlertCircle, Users, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdaptiveButton } from '@/components/billing/AdaptiveButton';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Planos e Preços | MeetAnalyzer',
  description: 'Escolha o plano perfeito para suas necessidades de análise de reuniões.',
};

interface FeatureItem {
  name: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  price: string;
  interval?: string;
  description: string;
  features: FeatureItem[];
  popularPlan?: boolean;
  priceId: string;
}

export default function PricingPage() {
  const pricingTiers: PricingTier[] = [
    {
      name: 'Básico',
      price: 'Grátis',
      description: 'Essencial para começar com análise de reuniões',
      priceId: '',
      features: [
        { name: 'Até 5 análises de reuniões por mês', included: true },
        { name: 'Transcrição básica', included: true },
        { name: 'Visualização de relações simples', included: true },
        { name: 'Armazenamento de 30 dias', included: true },
        { name: 'Acesso a relatórios de resumo', included: false },
        { name: 'Análise de sentimento', included: false },
        { name: 'Integrações com CRM', included: false },
        { name: 'Suporte prioritário', included: false },
      ],
    },
    {
      name: 'Pro',
      price: 'R$99',
      interval: '/mês',
      description: 'Ideal para profissionais e equipes pequenas',
      priceId: 'price_pro_monthly',
      popularPlan: true,
      features: [
        { name: 'Reuniões ilimitadas', included: true },
        { name: 'Transcrição avançada multi-idioma', included: true },
        { name: 'Visualização de relações avançada', included: true },
        { name: 'Armazenamento de 1 ano', included: true },
        { name: 'Acesso a relatórios de resumo', included: true },
        { name: 'Análise de sentimento', included: true },
        { name: 'Integrações com CRM', included: true },
        { name: 'Suporte prioritário', included: false },
      ],
    },
    {
      name: 'Enterprise',
      price: 'Personalizado',
      description: 'Soluções escaláveis para grandes organizações',
      priceId: 'contact_sales',
      features: [
        { name: 'Tudo do plano Pro', included: true },
        { name: 'Armazenamento ilimitado', included: true },
        { name: 'API dedicada', included: true },
        { name: 'Integrações personalizadas', included: true },
        { name: 'SLA garantido', included: true },
        { name: 'Gerente de conta dedicado', included: true },
        { name: 'Treinamento da equipe', included: true },
        { name: 'Suporte 24/7', included: true },
      ],
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Transforme Suas Reuniões em Resultados Concretos</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Equipes que usam o MeetAnalyzer economizam em média 5 horas por semana e aumentam sua produtividade em 30%.
        </p>
      </div>
      
      {/* Prova Social */}
      <div className="bg-muted/50 rounded-lg p-6 mb-12 text-center">
        <p className="text-sm uppercase font-semibold text-muted-foreground mb-4">Usado e aprovado por mais de 500 equipes</p>
        <div className="flex flex-wrap justify-center gap-8 items-center">
          <div className="opacity-70 hover:opacity-100 transition-opacity">
            <img src="/logos/acme.svg" alt="Acme Inc" className="h-8" />
          </div>
          <div className="opacity-70 hover:opacity-100 transition-opacity">
            <img src="/logos/globex.svg" alt="Globex" className="h-8" />
          </div>
          <div className="opacity-70 hover:opacity-100 transition-opacity">
            <img src="/logos/tech.svg" alt="TechCorp" className="h-8" />
          </div>
        </div>
      </div>
      
      {/* Alertas de escassez e urgência */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="flex-1 bg-blue-50 rounded-lg p-4 flex items-center">
          <Clock className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
          <p className="text-sm">
            <span className="font-semibold">Economize tempo:</span> Em média, nossos usuários reduzem o tempo de documentação de reuniões em 80%.
          </p>
        </div>
        <div className="flex-1 bg-amber-50 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0" />
          <p className="text-sm">
            <span className="font-semibold">Oferta por tempo limitado:</span> Assine agora e ganhe 30 dias extras de análise avançada.
          </p>
        </div>
        <div className="flex-1 bg-green-50 rounded-lg p-4 flex items-center">
          <ShieldCheck className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
          <p className="text-sm">
            <span className="font-semibold">Garantia de satisfação:</span> Cancele facilmente a qualquer momento nos primeiros 30 dias.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {pricingTiers.map((tier) => (
          <Card key={tier.name} className={`flex flex-col ${tier.popularPlan ? 'border-primary shadow-lg relative' : ''}`}>
            {tier.popularPlan && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                Mais Popular
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{tier.name}</CardTitle>
                {tier.popularPlan && (
                  <Badge variant="default" className="bg-primary">Recomendado</Badge>
                )}
              </div>
              <div className="mt-2">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.interval && <span className="text-muted-foreground ml-1">{tier.interval}</span>}
              </div>
              <CardDescription className="mt-2">{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className={`mr-2 mt-1 ${feature.included ? 'text-primary' : 'text-muted-foreground'}`}>
                      {feature.included ? <CheckIcon className="h-4 w-4" /> : '–'}
                    </span>
                    <span className={feature.included ? '' : 'text-muted-foreground'}>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {tier.name === 'Básico' ? (
                <AdaptiveButton 
                  priceId={tier.priceId} 
                  planName={tier.name} 
                  isBasic={true} 
                  variant="outline" 
                />
              ) : tier.name === 'Enterprise' ? (
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/app/contato">
                    Fale Conosco <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <AdaptiveButton 
                  priceId={tier.priceId} 
                  planName={tier.name} 
                  variant="default" 
                />
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Testemunhos */}
      <div className="mt-16 bg-muted/30 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8">O Que Nossos Clientes Dizem</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold mr-3">MG</div>
              <div>
                <p className="font-medium">Maria Gomes</p>
                <p className="text-sm text-muted-foreground">CEO, TechStart</p>
              </div>
            </div>
            <p className="text-sm">"O MeetAnalyzer transformou nossa forma de conduzir reuniões. Agora temos documentação perfeita e insights que antes perdíamos completamente."</p>
          </div>
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold mr-3">PL</div>
              <div>
                <p className="font-medium">Paulo Lima</p>
                <p className="text-sm text-muted-foreground">CTO, Empresa S.A.</p>
              </div>
            </div>
            <p className="text-sm">"Economizamos cerca de 6 horas por semana em documentação e nossa taxa de conversão aumentou em 25% graças aos insights capturados."</p>
          </div>
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold mr-3">CS</div>
              <div>
                <p className="font-medium">Carla Santos</p>
                <p className="text-sm text-muted-foreground">Gerente de Vendas, GlobalTech</p>
              </div>
            </div>
            <p className="text-sm">"As integrações com CRM e a análise de sentimento nos permitiram entender melhor nossos clientes e aumentar as vendas em 35%."</p>
          </div>
        </div>
      </div>

      <div className="mt-20 border-t pt-12">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Perguntas Frequentes</h2>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-2">Como funciona o período de teste?</h3>
            <p className="text-muted-foreground">
              Todos os usuários começam com o plano Básico gratuito. Não é necessário cartão de crédito para experimentar os recursos essenciais do MeetAnalyzer.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Posso mudar de plano depois?</h3>
            <p className="text-muted-foreground">
              Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor imediatamente.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Como funciona o faturamento?</h3>
            <p className="text-muted-foreground">
              O faturamento é mensal ou anual, dependendo do plano escolhido. Aceitamos todos os principais cartões de crédito e boleto bancário.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Quais integrações estão disponíveis?</h3>
            <p className="text-muted-foreground">
              Os planos pagos incluem integrações com plataformas populares como Google Meet, Zoom, Microsoft Teams, Salesforce, HubSpot e outras.
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA Final */}
      <div className="mt-16 bg-primary/10 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Pronto para transformar suas reuniões?</h2>
        <p className="mb-6 max-w-2xl mx-auto">Comece agora e veja a diferença que o MeetAnalyzer pode fazer para sua equipe. Cancele a qualquer momento.</p>
        <Button size="lg" asChild>
          <Link href="#pricing">
            Comece Agora <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">Mais de 10.000 reuniões já foram analisadas pelo MeetAnalyzer</p>
      </div>
    </div>
  );
} 