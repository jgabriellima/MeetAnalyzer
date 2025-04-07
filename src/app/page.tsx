import React from 'react';
import Link from 'next/link';
import { ArrowRight, MessageSquare, LineChart, Users, CalendarClock, BrainCircuit, Globe } from 'lucide-react';
import AuthAwareButtons from '@/components/AuthAwareButtons';
import HomePricing from "@/components/HomePricing";

export default function Home() {
  const productName = process.env.NEXT_PUBLIC_PRODUCTNAME || "Meeting Analyzer";

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

        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Transform Your Meetings Into
                <span className="block text-primary-600">Actionable Intelligence</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
                Record, transcribe, and analyze business conversations. Extract key insights, improve collaboration, and make data-driven decisions with theme-based organization across all your meetings.
              </p>
              <div className="mt-10 flex gap-4 justify-center">
                <AuthAwareButtons />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-bold text-primary-600">{stat.value}</div>
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
                      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                    <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-gray-600">{feature.description}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-gray-50">
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
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm h-80 flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
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
                  
                  {/* Theme labels */}
                  <text x="200" y="30" textAnchor="middle" fill="var(--color-primary-700)" fontWeight="bold" fontSize="14">Meeting Themes Relationship Map</text>
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">Comprehensive Meeting Analysis</h2>
              <p className="mt-4 text-xl text-gray-600">
                A powerful four-tab interface for complete meeting intelligence
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Overview Tab</h3>
                <p className="text-gray-600">
                  Dynamic relationship mapping with NLP-based weighting, enabling theme exploration across meetings.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Transcript Tab</h3>
                <p className="text-gray-600">
                  Diarized transcription with speaker separation, emotional indicators, and synchronized playback.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Comments Tab</h3>
                <p className="text-gray-600">
                  Comments organized by transcript sections with threading and business context for team collaboration.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
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