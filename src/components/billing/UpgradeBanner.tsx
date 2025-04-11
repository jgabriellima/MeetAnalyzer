'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FeatureItem {
  name: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: FeatureItem[];
  popularPlan?: boolean;
  priceId: string;
}

export function UpgradeBanner() {
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
      price: 'R$99/mês',
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
    <div className="w-full py-8">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Upgrade seu plano para desbloquear recursos premium</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Aprimore sua experiência de análise de reuniões com recursos avançados, transcrição ilimitada e integrações poderosas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col ${tier.popularPlan ? 'border-primary shadow-lg' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{tier.name}</CardTitle>
                  {tier.popularPlan && (
                    <Badge variant="default" className="bg-primary">Popular</Badge>
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{tier.price}</span>
                </div>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
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
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/app/dashboard">
                      Seu plano atual
                    </Link>
                  </Button>
                ) : tier.name === 'Enterprise' ? (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/app/contato">
                      Fale conosco <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full" asChild>
                    <Link href="/app/pricing">
                      Upgrade para {tier.name}
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 