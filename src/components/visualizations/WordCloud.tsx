import React from 'react';
import ReactWordcloud from 'react-wordcloud';

interface WordCloudProps {
    words: {
        text: string;
        value: number;
    }[];
}

const options = {
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

export function WordCloud({ words }: WordCloudProps) {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactWordcloud
                words={words}
                options={options}
            />
        </div>
    );
} 