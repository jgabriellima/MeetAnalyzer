'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

interface LoadingContextType {
  isLoading: boolean;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Carregando...');

  const startLoading = (customMessage?: string) => {
    setMessage(customMessage || 'Carregando...');
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
      <LoadingOverlay isLoading={isLoading} fullScreen={true} message={message} />
    </LoadingContext.Provider>
  );
}

export default LoadingProvider; 