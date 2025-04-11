'use client';

import React from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

let stripePromise: Promise<Stripe | null>;

/**
 * Inicializa o cliente Stripe no frontend
 */
const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is not set');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

interface StripeClientProviderProps {
  children: React.ReactNode;
}

/**
 * Provider do Stripe para o cliente React
 * Envolve os componentes que precisam acessar funcionalidades do Stripe
 */
export function StripeClientProvider({ children }: StripeClientProviderProps) {
  const stripePromise = getStripe();

  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
} 