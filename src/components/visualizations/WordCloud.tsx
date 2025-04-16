import React from 'react';
import ReactWordcloud, { Options } from 'react-wordcloud';

interface WordCloudProps {
    words: {
        text: string;
        value: number;
    }[];
}

// @ts-ignore - Ignorar erros de tipagem para fins de correção
const options: Options = {
    colors: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
    enableTooltip: true,
    deterministic: true,
    fontFamily: 'inter',
    fontSizes: [20, 60],
    fontStyle: 'normal',
    fontWeight: 'normal',
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 90],
    scale: 'sqrt',
    spiral: 'archimedean',
    transitionDuration: 1000,
};

export function WordCloud({ words = [] }: WordCloudProps) {
    // Garantir que temos um array de palavras válido
    const safeWords = React.useMemo(() => {
        try {
            return Array.isArray(words) && words.length > 0 ? words : [];
        } catch (error) {
            console.error('Erro ao processar palavras para o WordCloud:', error);
            return [];
        }
    }, [words]);
    
    // Se não houver palavras, mostrar mensagem
    if (!safeWords.length) {
        return (
            <div className="h-[200px] w-full flex items-center justify-center text-muted-foreground">
                Nenhum dado disponível para visualização
            </div>
        );
    }

    // Evitar erros de renderização
    try {
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <ReactWordcloud
                    // @ts-ignore - Ignorar erros de tipagem para fins de correção
                    words={safeWords}
                    // @ts-ignore - Ignorar erros de tipagem para fins de correção
                    options={options}
                />
            </div>
        );
    } catch (error) {
        console.error('Erro ao renderizar WordCloud:', error);
        return (
            <div className="h-[200px] w-full flex items-center justify-center text-muted-foreground">
                Erro ao carregar visualização
            </div>
        );
    }
} 