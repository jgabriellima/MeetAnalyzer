'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChartBar, ArrowRight, AlertTriangle } from 'lucide-react';

// Mapeamento de recursos para rótulos amigáveis
const featureLabels: Record<string, string> = {
  meetings: 'análises de reuniões',
  storage_days: 'dias de armazenamento',
};

export interface LimitReachedProps {
  feature: string;
  limit: number;
  current: number;
  onClose: () => void;
  onUpgrade?: () => void;
}

/**
 * Modal exibido quando o usuário atinge o limite de um recurso no seu plano atual
 */
export function LimitReachedModal({ 
  feature, 
  limit,
  current,
  onClose,
  onUpgrade
}: LimitReachedProps) {
  const [open, setOpen] = useState(true);
  
  const handleClose = () => {
    setOpen(false);
    onClose();
  };
  
  const handleUpgrade = () => {
    setOpen(false);
    if (onUpgrade) {
      onUpgrade();
    }
  };
  
  // Obter rótulo amigável para o recurso
  const featureLabel = featureLabels[feature] || feature;
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center text-xl">Limite Atingido</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Você atingiu o limite de {limit} {featureLabel} no seu plano atual.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <ChartBar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Uso atual: <span className="font-medium">{current}/{limit}</span>
            </span>
          </div>
          
          <div className="bg-muted p-4 rounded-lg w-full text-sm">
            <p className="font-medium mb-2">Faça upgrade para acessar:</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Reuniões ilimitadas</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Transcrição avançada multi-idioma</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Armazenamento de longo prazo</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Depois
          </Button>
          <Button onClick={handleUpgrade} asChild>
            <Link href="/app/pricing">
              Ver Planos <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 