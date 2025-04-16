'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
import { UsageProvider } from '@/providers/usage/UsageProvider';
import { createClientSassClient } from '@/lib/supabase/server';

interface Meeting {
  id: string;
  name: string;
  audio_url: string | null;
  created_at: string;
  transcription_id: string | null;
  transcription_status: string | null;
  transcription_language: string | null;
  transcription_error: string | null;
  transcription_config: any;
  user_id: string;
  title?: string | null;
  description?: string | null;
  meeting_date?: string | null;
  duration?: number | null;
  participants_count?: number | null;
  account_id?: string | null;
  opportunity_id?: string | null;
  recording_url?: string | null;
  transcript?: string | null;
  updated_at?: string | null;
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
        
        const sassClient = createClientSassClient();
        const user = await sassClient.getUser();
        
        if (!user) {
          throw new Error("Usuário não autenticado");
        }
        
        // Buscar reuniões do usuário
        const { data: meetingsData, error } = await sassClient.getSupabaseClient()
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
            <Card className="h-full hover:border-primary/50 transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold truncate">
                  {meeting.name || 'Reunião sem título'}
                </CardTitle>
                <CardDescription>
                  {meeting.created_at ? formatTimeAgo(meeting.created_at) : 'Data desconhecida'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {meeting.transcription_status === 'completed' ? (
                    <p className="text-xs text-emerald-600 font-medium flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      Transcrição completa
                    </p>
                  ) : meeting.transcription_status === 'processing' ? (
                    <p className="text-xs text-amber-600 font-medium flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Processando transcrição...
                    </p>
                  ) : meeting.transcription_error ? (
                    <p className="text-xs text-red-500 font-medium flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Erro na transcrição
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 font-medium flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Sem transcrição
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="w-full flex justify-between text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {meeting.meeting_date ? formatDateTime(meeting.meeting_date) : 'Sem data'}
                  </span>
                  {meeting.duration && (
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDuration(meeting.duration)}
                    </span>
                  )}
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}