"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {
    Home,
    User,
    Menu,
    X,
    ChevronDown,
    LogOut,
    Key, Files, LucideListTodo, VideoIcon, 
    CreditCard, 
    Zap,
    ArrowUpRight
} from 'lucide-react';
import { useGlobal } from "@/lib/context/GlobalContext";
import { createSPASassClient } from "@/lib/supabase/client";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
    const [subscriptionStatus, setSubscriptionStatus] = useState<{ isActive: boolean, plan: string | null }>({ isActive: false, plan: null });
    const [showProBanner, setShowProBanner] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    const { user } = useGlobal();

    // Fetch subscription status when component mounts
    useEffect(() => {
        let isMounted = true;
        
        async function fetchSubscriptionStatus() {
            try {
                const response = await fetch('/api/subscription/status');
                if (!isMounted) return;
                
                if (response.ok) {
                    const data = await response.json();
                    setSubscriptionStatus({
                        isActive: data.isActive || false,
                        plan: data.plan || null
                    });
                } else {
                    console.error('Error response from subscription API:', response.statusText);
                    // Use defaults para evitar erros de UI
                    setSubscriptionStatus({ isActive: false, plan: null });
                }
            } catch (error) {
                if (!isMounted) return;
                console.error('Error fetching subscription status:', error);
                // Use defaults para evitar erros de UI
                setSubscriptionStatus({ isActive: false, plan: null });
            }
        }

        if (user) {
            fetchSubscriptionStatus();
        }
        
        return () => {
            isMounted = false;
        };
    }, [user]);

    const handleLogout = async () => {
        try {
            const client = await createSPASassClient();
            await client.logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    const handleChangePassword = async () => {
        router.push('/app/user-settings')
    };

    const getInitials = (email: string | undefined) => {
        if (!email) return '??';
        
        try {
            const parts = email.split('@')[0].split(/[._-]/);
            if (parts.length > 1 && parts[0] && parts[1]) {
                // Verificar se existe pelo menos um caractere em cada parte
                if (parts[0].length > 0 && parts[1].length > 0) {
                    return (parts[0][0] + parts[1][0]).toUpperCase();
                }
            }
            
            // Fallback para as duas primeiras letras do email
            return (parts[0] && parts[0].length > 0) 
                ? parts[0].slice(0, 2).toUpperCase() 
                : '??';
        } catch (error) {
            console.error('Error generating initials:', error);
            return '??';
        }
    };

    const productName = process.env.NEXT_PUBLIC_PRODUCTNAME;

    const navigation = [
        { name: 'Homepage', href: '/app', icon: Home },
        { name: 'Meetings', href: '/app/meetings', icon: VideoIcon },
        { name: 'Example Storage', href: '/app/storage', icon: Files },
        { name: 'Example Table', href: '/app/table', icon: LucideListTodo },
        { name: 'Premium Features', href: '/app/premium-features', icon: Zap },
        { name: 'User Settings', href: '/app/user-settings', icon: User },
        { name: 'Assinatura', href: '/app/billing', icon: CreditCard },
        { name: 'Planos & Preços', href: '/precos', icon: Zap },
    ];

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-gray-100">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-30 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

                <div className="h-16 flex items-center justify-between px-4 border-b">
                    <span className="text-xl font-semibold text-primary-600">{productName}</span>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-4 px-2 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        // Highlight the pricing link for users without active subscription
                        const isHighlighted = item.href === '/precos' && !subscriptionStatus.isActive;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                    isActive
                                        ? 'bg-primary-50 text-primary-600'
                                        : isHighlighted
                                        ? 'text-primary-600 bg-primary-50/50 hover:bg-primary-50'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 ${
                                        isActive ? 'text-primary-500' 
                                        : isHighlighted ? 'text-primary-500'
                                        : 'text-gray-400 group-hover:text-gray-500'
                                    }`}
                                />
                                {item.name}
                                {isHighlighted && (
                                    <span className="ml-auto text-xs bg-primary-100 text-primary-800 px-1.5 py-0.5 rounded-full">
                                        Upgrade
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

            </div>

            <div className="lg:pl-64">
                <div className="sticky top-0 z-10 flex items-center justify-between h-16 bg-white shadow-sm px-4">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <Menu className="h-6 w-6"/>
                    </button>

                    <div className="relative ml-auto">
                        <button
                            onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
                            className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
                        >
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-primary-700 font-medium">
                                    {user ? getInitials(user.email) : '??'}
                                </span>
                            </div>
                            <span>{user?.email || 'Loading...'}</span>
                            <ChevronDown className="h-4 w-4"/>
                        </button>

                        {isUserDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border">
                                <div className="p-2 border-b border-gray-100">
                                    <p className="text-xs text-gray-500">Signed in as</p>
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {user?.email}
                                    </p>
                                    {subscriptionStatus.isActive ? (
                                        <div className="mt-1 flex items-center">
                                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                                            <span className="text-xs font-medium text-green-700">
                                                Plano {subscriptionStatus.plan || 'Pro'}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="mt-1 flex items-center">
                                            <span className="inline-block w-2 h-2 rounded-full bg-gray-300 mr-1.5"></span>
                                            <span className="text-xs font-medium text-gray-500">
                                                Plano Free
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="py-1">
                                    <Link
                                        href="/app/billing"
                                        onClick={() => setUserDropdownOpen(false)}
                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <CreditCard className="mr-3 h-4 w-4 text-gray-400"/>
                                        Gerenciar Assinatura
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setUserDropdownOpen(false);
                                            handleChangePassword()
                                        }}
                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <Key className="mr-3 h-4 w-4 text-gray-400"/>
                                        Change Password
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setUserDropdownOpen(false);
                                        }}
                                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="mr-3 h-4 w-4 text-red-400"/>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upgrade banner for non-subscribers - only show on main pages */}
                {!subscriptionStatus.isActive && showProBanner && pathname !== '/precos' && (
                    <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-3 shadow-md">
                        <div className="container mx-auto flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Zap className="h-5 w-5" />
                                <span>Desbloqueie recursos premium e aumente sua produtividade!</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Link 
                                    href="/precos" 
                                    className="flex items-center text-sm bg-white text-primary-700 px-3 py-1 rounded-md font-medium hover:bg-primary-50"
                                >
                                    Ver Planos
                                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                                </Link>
                                <button 
                                    onClick={() => setShowProBanner(false)}
                                    className="text-white/80 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <main className="p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}