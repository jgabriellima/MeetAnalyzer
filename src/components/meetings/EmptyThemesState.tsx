import React from 'react';
import { BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function EmptyThemesState() {
    return (
        <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <BarChart2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">Nenhum tema identificado ainda</h3>
            <p className="text-sm text-muted-foreground mb-4">
                Adicione sua primeira reunião para começar a identificar temas
            </p>
            <Button asChild>
                <Link href="/app/meetings/new">Adicionar reunião</Link>
            </Button>
        </div>
    );
} 