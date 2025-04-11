'use client';

import { PricingCard, Feature } from '@/components/billing/PricingCard';

// Mock de dados para os planos
const PLANS = [
  {
    title: 'Básico',
    description: 'Para times pequenos que estão começando com análise de reuniões.',
    price: 'R$49',
    // priceId: 'price_1RBf8pGpNrSUPEUnn6ug6y7g',
    priceId: 'price_1RBmOlGpNrSUPEUnCMZYA5mp',
    features: [
      { label: '10 horas de gravações/mês', included: true },
      { label: 'Transcrição automática', included: true },
      { label: 'Organização por temas', included: true },
      { label: 'Compartilhamento básico', included: true },
      { label: 'Visualizações de relacionamento', included: false },
      { label: 'Integração com CRM', included: false },
      { label: 'Análise emocional', included: false },
      { label: 'Suporte prioritário', included: false },
    ],
  },
  {
    title: 'Pro',
    description: 'Para equipes que precisam de recursos avançados e mais capacidade.',
    price: 'R$99',
    // priceId: 'price_1RBfD5GpNrSUPEUnss2om7Ei',
    priceId: 'price_1RBmPsGpNrSUPEUnFFwTnrmh',
    features: [
      { label: '50 horas de gravações/mês', included: true },
      { label: 'Transcrição automática', included: true },
      { label: 'Organização por temas', included: true },
      { label: 'Compartilhamento avançado', included: true },
      { label: 'Visualizações de relacionamento', included: true },
      { label: 'Integração com CRM', included: true },
      { label: 'Análise emocional', included: false },
      { label: 'Suporte prioritário', included: false },
    ],
    popular: true,
    recommended: true,
  },
  {
    title: 'Enterprise',
    description: 'Para organizações com necessidades específicas e alto volume.',
    price: 'R$249',
    // priceId: 'price_1RBfD5GpNrSUPEUnNJOTcUSZ',
    priceId: 'price_1RBmPsGpNrSUPEUn2mVPzdXF',
    features: [
      { label: 'Horas ilimitadas de gravações', included: true },
      { label: 'Transcrição automática', included: true },
      { label: 'Organização por temas', included: true },
      { label: 'Compartilhamento personalizado', included: true },
      { label: 'Visualizações de relacionamento', included: true },
      { label: 'Integração com CRM', included: true },
      { label: 'Análise emocional', included: true },
      { label: 'Suporte dedicado 24/7', included: true },
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="container py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Escolha o Plano Ideal para sua Equipe</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Transforme suas reuniões em insights valiosos com nossa plataforma de análise
          de conversas construída para o mercado brasileiro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {PLANS.map((plan, index) => (
          <PricingCard key={index} {...plan} />
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
        <div className="text-left max-w-3xl mx-auto space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Posso mudar de plano depois?</h3>
            <p className="text-muted-foreground">
              Sim, é possível fazer upgrade ou downgrade do seu plano a qualquer momento.
              O valor será ajustado proporcionalmente ao tempo restante de assinatura.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Como funciona o limite de horas?</h3>
            <p className="text-muted-foreground">
              O limite de horas refere-se ao total de tempo de gravação que pode ser processado
              mensalmente. Horas não utilizadas não acumulam para o mês seguinte.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">É possível testar antes de assinar?</h3>
            <p className="text-muted-foreground">
              Oferecemos um período de teste gratuito de 14 dias com todas as funcionalidades
              do plano Pro. Não é necessário cartão de crédito para iniciar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 