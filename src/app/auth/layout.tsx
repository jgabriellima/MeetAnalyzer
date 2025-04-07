import Link from 'next/link';
import { ArrowLeft, MessageSquare, LineChart, Lightbulb, Clock, Zap } from 'lucide-react';

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const productName = process.env.NEXT_PUBLIC_PRODUCTNAME || "Meeting Analyzer";
    const testimonials = [
        {
            quote: "Nosso time descobriu insights que estavam se perdendo em nossas reuniões há meses. Identificamos tendências nos feedbacks de clientes que mudaram nossa estratégia de produto.",
            author: "Renata Silva",
            role: "VP de Produto, TechSoft",
            avatar: "RS"
        },
        {
            quote: "A capacidade de ver como os temas evoluem entre reuniões transformou nosso processo de vendas. Economizamos 6 horas por semana em análise manual e aumentamos conversões em 28%.",
            author: "Marcelo Oliveira",
            role: "Diretor Comercial, DataSales",
            avatar: "MO"
        },
        {
            quote: "O mapeamento de temas identificou conexões que nunca teríamos visto. Nossa eficiência em reuniões aumentou drasticamente e nossos clientes percebem como estamos mais preparados.",
            author: "Juliana Costa",
            role: "Gerente de Sucesso do Cliente, CloudService",
            avatar: "JC"
        }
    ];

    const benefits = [
        {
            icon: Clock,
            title: "Economize 5 horas por semana",
            description: "Elimine a necessidade de tomar notas extensas e revisar gravações manualmente"
        },
        {
            icon: Lightbulb,
            title: "Descubra 3x mais insights",
            description: "Identifique padrões e tendências que passariam despercebidos em análises convencionais"
        },
        {
            icon: LineChart,
            title: "Aumente resultados em 40%",
            description: "Tome decisões baseadas em dados reais de conversas conectados a métricas de negócio"
        },
        {
            icon: Zap,
            title: "Prepare-se em minutos, não horas",
            description: "Receba contexto histórico e pontos-chave antes de cada reunião"
        }
    ];

    return (
        <div className="flex min-h-screen">
            <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white relative">
                <Link
                    href="/"
                    className="absolute left-8 top-8 flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar à página inicial
                </Link>

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                        {productName}
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    {children}
                </div>
            </div>

            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800">
                <div className="w-full flex items-center justify-center p-12">
                    <div className="space-y-6 max-w-lg">
                        <div className="text-white space-y-4">
                            <h3 className="text-3xl font-bold">
                                Transforme suas reuniões em inteligência acionável
                            </h3>
                            <p className="text-primary-100 text-lg">
                                Junte-se às centenas de equipes que estão extraindo o valor máximo de cada conversa com o Meeting Analyzer.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 my-8">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 mt-1">
                                        <benefit.icon className="w-5 h-5 text-primary-200" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold">{benefit.title}</h4>
                                        <p className="text-primary-100 text-sm">{benefit.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="my-8 border-t border-primary-500/30 pt-8">
                            <h4 className="text-white text-lg font-semibold mb-4">
                                O que nossos usuários dizem:
                            </h4>
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="relative bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-xl mb-4"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-primary-400/30 flex items-center justify-center text-white font-semibold">
                                                {testimonial.avatar}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white/90 mb-2 font-light leading-relaxed">
                                                "{testimonial.quote}"
                                            </p>
                                            <div className="mt-2">
                                                <p className="text-sm font-medium text-white">
                                                    {testimonial.author}
                                                </p>
                                                <p className="text-sm text-primary-200">
                                                    {testimonial.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center bg-white/10 rounded-lg p-4 border border-white/10">
                            <p className="text-white font-semibold">
                                Acesse agora e conquiste insights valiosos já na sua próxima reunião
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}