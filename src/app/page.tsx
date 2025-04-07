"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageSquare, LineChart, Users, CalendarClock, BrainCircuit, Globe, Play, ChevronRight } from 'lucide-react';
import AuthAwareButtons from '@/components/AuthAwareButtons';
import HomePricing from "@/components/HomePricing";

export default function Home() {
  const productName = process.env.NEXT_PUBLIC_PRODUCTNAME || "Meeting Analyzer";
  const mosaicRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 });
  const [currentRotation, setCurrentRotation] = useState({ x: 0, y: 0 });

  // Efeito para rastrear movimento do mouse
  useEffect(() => {
    const handleMouseMove = (e: React.MouseEvent<Element, MouseEvent> | MouseEvent) => {
      const { clientX, clientY } = e;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate position relative to center of screen (-1 to 1 range)
      const xPos = (clientX / windowWidth) * 2 - 1;
      const yPos = (clientY / windowHeight) * 2 - 1;
      
      setMousePosition({ x: xPos, y: yPos });
      
      // Definir rotação alvo baseada na posição do mouse (com intensidade reduzida)
      setTargetRotation({ 
        x: yPos * 4, // 4 graus max no eixo X
        y: xPos * -4 // 4 graus max no eixo Y (invertido para parecer natural)
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Efeito de animação suave para a rotação
  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      // Aplicar amortecimento à rotação atual
      const dampeningFactor = 0.08; // Fator que controla a suavidade da animação
      
      // Calcular nova rotação com efeito de interpolação suave
      const newX = currentRotation.x + (targetRotation.x - currentRotation.x) * dampeningFactor;
      const newY = currentRotation.y + (targetRotation.y - currentRotation.y) * dampeningFactor;
      
      // Verificar se o movimento é insignificante para evitar atualizações desnecessárias
      const isMovementSignificant = 
        Math.abs(newX - currentRotation.x) > 0.0001 || 
        Math.abs(newY - currentRotation.y) > 0.0001;
      
      // Atualizar posição apenas se houver movimento significativo
      if (isMovementSignificant) {
        setCurrentRotation({ x: newX, y: newY });
      }
      
      // Continuar a animação independentemente do movimento ser significativo ou não
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Iniciar animação
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [currentRotation, targetRotation]);

  const features = [
    {
      icon: MessageSquare,
      title: 'Smart Transcription',
      description: 'Automatic meeting transcription with speaker identification and emotional indicators',
      color: 'text-blue-600'
    },
    {
      icon: LineChart,
      title: 'Dynamic Topic Mapping',
      description: 'Visualize topic relationships with NLP-based weighting and cross-meeting theme exploration',
      color: 'text-purple-600'
    },
    {
      icon: Users,
      title: 'Communication Coaching',
      description: 'Receive insights on team dynamics and communication patterns with actionable feedback',
      color: 'text-teal-600'
    },
    {
      icon: CalendarClock,
      title: 'Pre-Meeting Context',
      description: 'Get historical context and insights before your meetings for better outcomes',
      color: 'text-orange-600'
    },
    {
      icon: BrainCircuit,
      title: 'Meeting Intelligence',
      description: 'AI assistant for extracting insights, action items, and exploring meeting themes',
      color: 'text-green-600'
    },
    {
      icon: Globe,
      title: 'Business Integration',
      description: 'Connect meeting insights to CRM and calendar systems for actionable business intelligence',
      color: 'text-red-600'
    }
  ];

  const stats = [
    { label: 'Transcription Accuracy', value: '98%' },
    { label: 'Time Saved', value: '5h/week' },
    { label: 'Insights Discovered', value: '3x more' },
    { label: 'Meeting Effectiveness', value: '+40%' }
  ];

  const serviceCategories = [
    { id: '01', name: 'TRANSCRIPTION', description: 'Automatic diarized transcription' },
    { id: '02', name: 'ANALYTICS', description: 'Meeting intelligence platform' },
    { id: '03', name: 'INTEGRATION', description: 'Business system connectors' },
    { id: '04', name: 'COACHING', description: 'Communication improvement' },
  ];

  return (
      <div className="min-h-screen">
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                {productName}
              </span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="#features" className="text-gray-600 hover:text-gray-900">
                  Features
                </Link>

                <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
                  Pricing
                </Link>
                <Link
                    href="#"
                    className="text-gray-600 hover:text-gray-900"
                >
                  Documentation
                </Link>

                <AuthAwareButtons variant="nav" />
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section with 3D Visual */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white z-0"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                  We generate
                  <span className="block text-primary-600">business outcomes</span>
                  with meeting intelligence
                </h1>
                <p className="mt-6 text-xl text-gray-600">
                  Record, transcribe, and analyze business conversations. Extract key insights, improve collaboration, and make data-driven decisions with theme-based organization.
                </p>
                <div className="mt-10 flex gap-4">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="#demo"
                    className="inline-flex items-center px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch Demo
                  </Link>
                </div>
                
                {/* Case Examples */}
                <div className="mt-12">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-500">Case Examples</h3>
                    <button className="flex items-center text-primary-600 text-sm font-medium">
                      View all <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  <div className="flex space-x-3">
                    <div className="w-20 h-20 rounded bg-gray-200 hover:opacity-80 transition-opacity cursor-pointer"></div>
                    <div className="w-20 h-20 rounded bg-gray-300 hover:opacity-80 transition-opacity cursor-pointer"></div>
                    <div className="w-20 h-20 rounded bg-gray-400 hover:opacity-80 transition-opacity cursor-pointer"></div>
                    <div className="w-20 h-20 rounded bg-gray-500 hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center text-white">+</div>
                  </div>
                </div>
              </div>
              
              {/* 3D Visual */}
              <div className="hidden lg:block">
                <div className="relative">
                  {/* 3D Visualization - Isolada em seu próprio contexto de transformação */}
                  <div 
                    className="w-full h-[500px] relative perspective-1000"
                    ref={mosaicRef}
                  >
                    <div 
                      className="w-full h-full transform-style-3d transition-transform duration-700 ease-out"
                      style={{ 
                        transform: `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`,
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <svg width="100%" height="100%" viewBox="0 0 500 500" className="transition-transform duration-700">
                        {/* 3D Cube-like Structure */}
                        <g className="transform rotate-12">
                          {/* Base layer cubes */}
                          {Array.from({ length: 7 }).map((_, i) => (
                            Array.from({ length: 7 }).map((_, j) => (
                              <g key={`${i}-${j}`} className="opacity-70">
                                <rect 
                                  x={100 + i * 40} 
                                  y={100 + j * 40} 
                                  width="35" 
                                  height="35" 
                                  fill={Math.random() > 0.7 ? "var(--color-primary-500)" : "white"}
                                  stroke="rgba(229, 231, 235, 0.5)"
                                  strokeWidth="1"
                                  className="transform transition-all duration-700 hover:translate-y-[-5px]"
                                  style={{ 
                                    transitionDelay: `${(i + j) * 50}ms`,
                                    transform: `translateZ(${(i + j) % 3 * 5}px) translateX(${currentRotation.y * ((i + j) % 3 + 1) * 0.5}px) translateY(${currentRotation.x * ((i + j) % 3 + 1) * -0.5}px)`
                                  }}
                                />
                                {Math.random() > 0.8 && (
                                  <rect 
                                    x={100 + i * 40} 
                                    y={100 + j * 40} 
                                    width="35" 
                                    height="35" 
                                    fill="var(--color-primary-200)"
                                    className="transform transition-all duration-500"
                                    style={{ 
                                      transform: `translateZ(${Math.random() * 30}px) translateX(${currentRotation.y * 2}px) translateY(${currentRotation.x * -2}px)`,
                                      transitionDelay: `${(i + j) * 30}ms`
                                    }}
                                  />
                                )}
                              </g>
                            ))
                          ))}
                          
                          {/* Accent blocks at various heights */}
                          {Array.from({ length: 15 }).map((_, i) => (
                            <g key={`accent-${i}`} className="transition-all duration-700">
                              <rect 
                                x={120 + Math.random() * 200} 
                                y={120 + Math.random() * 200} 
                                width="35" 
                                height="35" 
                                fill={Math.random() > 0.5 ? "var(--color-primary-400)" : "var(--color-primary-600)"}
                                className="transform transition-all duration-1000"
                                style={{ 
                                  transform: `translateZ(${20 + Math.random() * 40}px) translateX(${currentRotation.y * 3}px) translateY(${currentRotation.x * -3}px)`,
                                  transitionDelay: `${i * 100}ms`,
                                  opacity: 0.9
                                }}
                              />
                            </g>
                          ))}
                        </g>
                      </svg>
                    </div>
                    
                    {/* Animation overlay */}
                    <div className="absolute inset-0 bg-gradient-radial from-transparent to-white opacity-20 pointer-events-none"></div>
                  </div>
                </div>
                
                {/* Performance Metrics Card - Completamente separado do mosaico 3D */}
                <div className="relative mt-[-100px] float-right mr-4 z-10" style={{ transform: 'none' }}>
                  <div className="bg-white shadow-xl rounded-lg p-5 w-64">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-semibold text-gray-500">PERFORMANCE</h4>
                      <h4 className="text-xs font-semibold text-gray-500">SALES</h4>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-lg font-bold">92%</div>
                      <div className="text-lg font-bold">88% ↑</div>
                    </div>
                    <div className="h-20">
                      <div className="flex h-full items-end space-x-1">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div 
                            key={i} 
                            className="w-1 bg-primary-500" 
                            style={{ 
                              height: `${20 + Math.random() * 70}%`,
                              opacity: i > 10 ? 1 : 0.3
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-4xl font-bold text-primary-600 group-hover:scale-110 transition-transform">{stat.value}</div>
                    <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">Meeting Intelligence Platform</h2>
              <p className="mt-4 text-xl text-gray-600">
                Discover patterns across meetings, not just within them
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                  <div
                      key={index}
                      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] group"
                  >
                    <feature.icon className={`h-8 w-8 ${feature.color} group-hover:scale-110 transition-transform`} />
                    <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-gray-600">{feature.description}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold">Theme-First, Not Meeting-First</h2>
                <p className="mt-4 text-lg text-gray-600">
                  Traditional meeting tools focus on individual meetings. Meeting Analyzer organizes by evolving themes across your meetings, helping you track important topics over time.
                </p>
                <ul className="mt-6 space-y-2">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary-600 mr-2 mt-1" />
                    <span>Discover how themes evolve across multiple conversations</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary-600 mr-2 mt-1" />
                    <span>Connect meeting insights to business metrics and opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary-600 mr-2 mt-1" />
                    <span>Get historical context before joining meetings</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                <div className="relative">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-gray-100 flex items-center px-3">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <svg className="w-full h-[300px] pt-8" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
                    {/* Main central node */}
                    <circle cx="250" cy="150" r="30" fill="var(--color-primary-500)" opacity="0.9" />
                    <text x="250" y="155" textAnchor="middle" fill="white" fontWeight="bold">Product Roadmap</text>
                    
                    {/* Connected nodes */}
                    <circle cx="150" cy="100" r="25" fill="var(--color-primary-300)" opacity="0.8" />
                    <text x="150" y="105" textAnchor="middle" fill="white" fontWeight="bold">Q3 Goals</text>
                    
                    <circle cx="350" cy="80" r="25" fill="var(--color-secondary-500)" opacity="0.8" />
                    <text x="350" y="85" textAnchor="middle" fill="white" fontWeight="bold">Feature Requests</text>
                    
                    <circle cx="380" cy="180" r="25" fill="var(--color-primary-700)" opacity="0.8" />
                    <text x="380" y="185" textAnchor="middle" fill="white" fontWeight="bold">User Feedback</text>
                    
                    <circle cx="120" cy="200" r="25" fill="var(--color-secondary-700)" opacity="0.8" />
                    <text x="120" y="205" textAnchor="middle" fill="white" fontWeight="bold">Resources</text>
                    
                    <circle cx="250" cy="250" r="25" fill="var(--color-primary-400)" opacity="0.8" />
                    <text x="250" y="255" textAnchor="middle" fill="white" fontWeight="bold">Timeline</text>
                    
                    {/* Connection lines with varying thickness indicating relationship strength */}
                    <line x1="250" y1="150" x2="150" y2="100" stroke="var(--color-primary-300)" strokeWidth="4" opacity="0.6" />
                    <line x1="250" y1="150" x2="350" y2="80" stroke="var(--color-primary-300)" strokeWidth="3" opacity="0.6" />
                    <line x1="250" y1="150" x2="380" y2="180" stroke="var(--color-primary-300)" strokeWidth="5" opacity="0.6" />
                    <line x1="250" y1="150" x2="120" y2="200" stroke="var(--color-primary-300)" strokeWidth="2" opacity="0.6" />
                    <line x1="250" y1="150" x2="250" y2="250" stroke="var(--color-primary-300)" strokeWidth="4" opacity="0.6" />
                    
                    {/* Secondary connections */}
                    <line x1="150" y1="100" x2="120" y2="200" stroke="var(--color-primary-100)" strokeWidth="2" opacity="0.4" />
                    <line x1="350" y1="80" x2="380" y2="180" stroke="var(--color-primary-100)" strokeWidth="2" opacity="0.4" />
                    <line x1="380" y1="180" x2="250" y2="250" stroke="var(--color-primary-100)" strokeWidth="2" opacity="0.4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">Comprehensive Meeting Analysis</h2>
              <p className="mt-4 text-xl text-gray-600">
                A powerful four-tab interface for complete meeting intelligence
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] group">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <LineChart className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Overview Tab</h3>
                <p className="text-gray-600">
                  Dynamic relationship mapping with NLP-based weighting, enabling theme exploration across meetings.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] group">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Transcript Tab</h3>
                <p className="text-gray-600">
                  Diarized transcription with speaker separation, emotional indicators, and synchronized playback.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] group">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Comments Tab</h3>
                <p className="text-gray-600">
                  Comments organized by transcript sections with threading and business context for team collaboration.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] group">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Assistant Tab</h3>
                <p className="text-gray-600">
                  AI chat interface for meeting intelligence, theme exploration, and communication coaching.
                </p>
              </div>
            </div>
          </div>
        </section>

        <HomePricing />

        {/* Services Categories, inspired by Globoix reference */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center mb-12">
              <div className="text-2xl font-bold">Our</div>
              <div className="flex items-center mx-2">
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-white"></div>
                </div>
              </div>
              <div className="text-2xl font-bold">services</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {serviceCategories.map((service) => (
                <div key={service.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-sm font-semibold text-gray-500">{service.id}</div>
                  <h3 className="text-lg font-bold mt-2">{service.name}</h3>
                  <p className="text-gray-600 mt-1">{service.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 flex items-center justify-center">
              <div className="text-2xl font-bold">+1.2K</div>
              <div className="flex ml-4">
                <div className="w-8 h-8 rounded-full bg-primary-100 -ml-1 border border-white"></div>
                <div className="w-8 h-8 rounded-full bg-primary-200 -ml-1 border border-white"></div>
                <div className="w-8 h-8 rounded-full bg-primary-300 -ml-1 border border-white"></div>
              </div>
              <div className="ml-4 text-sm text-gray-600">
                Users are satisfied with<br />our services
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-primary-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to Transform Your Meetings?
            </h2>
            <p className="mt-4 text-xl text-primary-100">
              Start extracting actionable intelligence from your conversations today
            </p>
            <Link
                href="/auth/register"
                className="mt-8 inline-flex items-center px-6 py-3 rounded-lg bg-white text-primary-600 font-medium hover:bg-primary-50 transition-colors"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>

        <footer className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Product</h4>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="#features" className="text-gray-600 hover:text-gray-900">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Resources</h4>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="#" className="text-gray-600 hover:text-gray-900">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-600 hover:text-gray-900">
                      API
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="/legal/privacy" className="text-gray-600 hover:text-gray-900">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal/terms" className="text-gray-600 hover:text-gray-900">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Company</h4>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="#" className="text-gray-600 hover:text-gray-900">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-600 hover:text-gray-900">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-center text-gray-600">
                © {new Date().getFullYear()} {productName}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
  );
}