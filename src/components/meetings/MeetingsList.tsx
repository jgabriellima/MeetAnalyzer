'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  PlusCircle,
  FileText,
  MessageSquare
} from 'lucide-react';
import { createSPASassClient } from '@/lib/supabase/client';
import { createSPAClient } from '@/lib/supabase/client';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { UsageProvider } from '@/providers/usage/UsageProvider';

interface Meeting {
  id: string;
  title: string | null;
  description: string | null;
  meeting_date: string | null;
  duration: number | null;
  participants_count: number | null;
  created_at: string | null;
  account_id?: string | null;
  opportunity_id?: string | null;
  recording_url?: string | null;
  transcript?: string | null;
  updated_at?: string | null;
  user_id?: string;
}

/**
 * Componente para listar as reuniões do usuário
 */
export function MeetingsList() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLimited, setIsLimited] = useState(false);
  const [usageInfo, setUsageInfo] = useState<{current: number, limit: number}>({
    current: 0,
    limit: 5
  });
  
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        
        const sassClient = createSPASassClient();
        const supabase = createSPAClient();
        const user = await sassClient.getUser();
        
        if (!user) {
          throw new Error("Usuário não autenticado");
        }
        
        // Buscar reuniões do usuário
        const { data: meetingsData, error } = await supabase
          .from('meetings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setMeetings(meetingsData || []);
        
        // Verificar limite de uso
        const usageProvider = UsageProvider.getProvider();
        const usageResult = await usageProvider.checkUsageLimit(user.id, 'meetings');
        
        setUsageInfo({
          current: usageResult.current,
          limit: usageResult.limit
        });
        
        setIsLimited(usageResult.isLimited);
      } catch (error) {
        console.error('Erro ao buscar reuniões:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeetings();
  }, []);
  
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Data não disponível';
    
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'Duração desconhecida';
    
    if (minutes < 60) {
      return `${minutes} minutos`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins > 0 ? `${mins}min` : ''}`;
    }
  };
  
  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch (e) {
      return '';
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
            <CardFooter>
              <div className="h-9 bg-gray-200 rounded w-24"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (meetings.length === 0) {
    return (
      <Card className="text-center p-8">
        <div className="flex flex-col items-center space-y-4">
          <Video className="h-12 w-12 text-gray-400" />
          <CardTitle>Nenhuma reunião encontrada</CardTitle>
          <CardDescription>
            Comece carregando sua primeira reunião para análise.
          </CardDescription>
          <Button asChild>
            <Link href="/app/meetings/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Reunião
            </Link>
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Utilização: {usageInfo.current}/{usageInfo.limit} reuniões
          </p>
          {isLimited && (
            <p className="text-sm text-amber-600">
              Você atingiu o limite de reuniões do seu plano. Faça upgrade para continuar.
            </p>
          )}
        </div>
        <Button asChild disabled={isLimited}>
          <Link href="/app/meetings/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Reunião
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {meetings.map((meeting) => (
          <Link key={meeting.id} href={`/app/meetings/${meeting.id}`}>
            <Card className="h-full cursor-pointer hover:border-primary transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="truncate">{meeting.title || 'Reunião sem título'}</CardTitle>
                <CardDescription>
                  {formatTimeAgo(meeting.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDateTime(meeting.meeting_date)}
                  </div>
                  {meeting.duration && (
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      {formatDuration(meeting.duration)}
                    </div>
                  )}
                  {meeting.participants_count && (
                    <div className="flex items-center text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      {meeting.participants_count} participantes
                    </div>
                  )}
                </div>
                {meeting.description && (
                  <p className="mt-4 text-sm line-clamp-2">{meeting.description}</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <FileText className="mr-1 h-3 w-3" />
                    Transcrição
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MessageSquare className="mr-1 h-3 w-3" />
                    Comentários
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  Ver detalhes
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 