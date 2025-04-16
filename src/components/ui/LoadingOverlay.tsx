'use client';

import React from 'react';
import { Loader2 } from 'lucide-react'; 

interface LoadingOverlayProps {
  isLoading: boolean;
  fullScreen?: boolean;
  message?: string;
}

export default function LoadingOverlay({ 
  isLoading, 
  fullScreen = false, 
  message = 'Carregando...' 
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  const containerClasses = fullScreen 
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm' 
    : 'absolute inset-0 z-20 flex items-center justify-center bg-white/80';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center justify-center space-y-3 rounded-lg bg-white p-6 shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
} 