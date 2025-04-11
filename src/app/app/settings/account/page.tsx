"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createSPASassClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Settings2, User, Mail, Key, Shield, Bell, Trash } from 'lucide-react';

export default function AccountSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    avatarUrl: '',
    company: '',
    role: '',
    subscription: {
      plan: '',
      status: '',
      trialEndsAt: null as Date | null,
    }
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const sassClient = createSPASassClient();
        const user = await sassClient.getUser();
        
        if (user) {
          // Aqui você buscaria os dados do usuário do seu backend
          // Por enquanto vamos usar dados simulados
          setUserData({
            fullName: user.user_metadata?.full_name || '',
            email: user.email || '',
            avatarUrl: user.user_metadata?.avatar_url || '',
            company: user.user_metadata?.company || '',
            role: user.user_metadata?.role || '',
            subscription: {
              plan: 'Trial',
              status: 'active',
              trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            }
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus dados.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Aqui você implementaria a lógica para salvar as alterações
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulando uma chamada API
      
      toast({
        title: "Sucesso",
        description: "Suas alterações foram salvas.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas alterações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Perfil</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie suas informações pessoais e profissionais
        </p>
      </div>
      <Separator />
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Foto do Perfil</CardTitle>
            <CardDescription>
              Esta foto será exibida em seu perfil e em suas atividades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userData.avatarUrl} />
                <AvatarFallback>{userData.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline">Alterar foto</Button>
                <p className="text-xs text-muted-foreground">
                  JPG, GIF ou PNG. Tamanho máximo de 2MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={userData.fullName}
                onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Para alterar seu email, entre em contato com o suporte.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Profissionais</CardTitle>
            <CardDescription>
              Atualize suas informações de trabalho
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={userData.company}
                onChange={(e) => setUserData({ ...userData, company: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Cargo</Label>
              <Input
                id="role"
                value={userData.role}
                onChange={(e) => setUserData({ ...userData, role: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
            <CardDescription>
              Ações irreversíveis para sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertDescription>
                A exclusão da conta é permanente e irá remover todos os seus dados.
                Esta ação não pode ser desfeita.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" className="w-full">
              <Trash className="w-4 h-4 mr-2" />
              Excluir minha conta
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 