// src/app/auth/login/page.tsx
'use client';

import { createSPASassClient } from '@/lib/supabase/client';
import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SSOButtons from '@/components/SSOButtons';
import { useLoading } from '@/providers/loading/LoadingProvider';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showMFAPrompt, setShowMFAPrompt] = useState(false);
    const router = useRouter();
    const { startLoading, stopLoading } = useLoading();

    // Detectar tokens na URL após login OAuth
    useEffect(() => {
        const checkForAuthSession = async () => {
            // Verifica se há uma hash na URL (indicação de login OAuth)
            if (typeof window !== 'undefined' && window.location.hash) {
                const hashParams = new URLSearchParams(
                    window.location.hash.substring(1) // Remove o # no início
                );
                
                // Se tiver um access_token na URL, significa que o login OAuth foi bem-sucedido
                if (hashParams.has('access_token')) {
                    try {
                        console.log('Detectado login OAuth bem-sucedido, redirecionando...');
                        startLoading('Finalizando autenticação...');
                        const client = createSPASassClient();
                        
                        // Aguardar um momento para o Supabase processar a sessão
                        setTimeout(() => {
                            // Verificar se o usuário está autenticado
                            client.getUser().then(user => {
                                if (user) {
                                    // Limpar a URL e redirecionar
                                    window.history.replaceState(null, '', '/auth/login');
                                    router.push('/app');
                                } else {
                                    stopLoading();
                                }
                            }).catch(() => {
                                stopLoading();
                            });
                        }, 500);
                    } catch (error) {
                        console.error('Erro ao processar autenticação OAuth:', error);
                        stopLoading();
                    }
                }
            }
        };
        
        checkForAuthSession();
    }, [router, startLoading, stopLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        startLoading('Autenticando...');

        try {
            const client = await createSPASassClient();
            const { error: signInError } = await client.loginEmail(email, password);

            if (signInError) throw signInError;

            // Check if MFA is required
            const supabase = client.getSupabaseClient();
            const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

            if (mfaError) throw mfaError;

            if (mfaData.nextLevel === 'aal2' && mfaData.nextLevel !== mfaData.currentLevel) {
                setShowMFAPrompt(true);
            } else {
                startLoading('Redirecionando para o dashboard...');
                router.push('/app');
                return;
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
            stopLoading();
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if(showMFAPrompt) {
            startLoading('Redirecionando para verificação em duas etapas...');
            router.push('/auth/2fa');
        }
    }, [showMFAPrompt, router, startLoading]);


    return (
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Acesse sua conta</h1>
                <p className="text-gray-600 mt-2">Desbloqueie insights valiosos de suas reuniões</p>
            </div>
            
            {error && (
                <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Senha
                    </label>
                    <div className="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        <Link href="/auth/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                            Esqueceu sua senha?
                        </Link>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </div>
            </form>

            <SSOButtons onError={setError} />

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Ainda não tem uma conta?</span>
                {' '}
                <Link href="/auth/register" className="font-medium text-primary-600 hover:text-primary-500">
                    Criar conta
                </Link>
            </div>
        </div>
    );
}