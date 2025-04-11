import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Assinatura Confirmada | MeetAnalyzer',
  description: 'Sua assinatura foi confirmada com sucesso.',
};

export default function BillingSuccessPage() {
  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[600px]">
      <Card className="max-w-lg w-full text-center">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Assinatura Confirmada!</CardTitle>
          <CardDescription>
            Obrigado por assinar o MeetAnalyzer. Sua conta foi atualizada com sucesso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Você agora tem acesso a todos os recursos do seu plano. Você receberá um email de confirmação em breve.
          </p>
          <div className="p-4 bg-muted rounded-lg text-sm">
            <p className="font-medium">O que vem agora?</p>
            <ul className="mt-2 text-left space-y-2">
              <li>• Acesse recursos premium de análise de reuniões</li>
              <li>• Configure integrações com suas plataformas favoritas</li>
              <li>• Comece a analisar reuniões com insights avançados</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild variant="default">
            <Link href="/app/dashboard">
              Ir para o Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/app/settings/billing">
              Gerenciar Assinatura
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 