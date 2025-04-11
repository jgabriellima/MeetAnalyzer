'use client';

import { CheckIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckoutButton } from './CheckoutButton';

export interface Feature {
  label: string;
  included: boolean;
}

export interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  priceId: string;
  features: Feature[];
  popular?: boolean;
  recommended?: boolean;
  current?: boolean;
}

/**
 * Componente para exibir um plano de preços
 */
export function PricingCard({
  title,
  description,
  price,
  priceId,
  features,
  popular = false,
  recommended = false,
  current = false,
}: PricingCardProps) {
  return (
    <Card className={`w-full max-w-sm border ${recommended ? 'border-primary shadow-lg' : 'border-border'}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          {popular && (
            <Badge variant="secondary">Popular</Badge>
          )}
          {current && (
            <Badge>Atual</Badge>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground ml-1">/mês</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mt-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className={`mr-2 mt-1 ${feature.included ? 'text-primary' : 'text-muted-foreground'}`}>
                <CheckIcon size={16} />
              </div>
              <span className={feature.included ? '' : 'text-muted-foreground'}>
                {feature.label}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {current ? (
          <p className="text-sm text-center w-full text-muted-foreground">
            Você já está neste plano
          </p>
        ) : (
          <CheckoutButton
            priceId={priceId}
            planName={title}
            variant={recommended ? 'default' : 'outline'}
          />
        )}
      </CardFooter>
    </Card>
  );
} 