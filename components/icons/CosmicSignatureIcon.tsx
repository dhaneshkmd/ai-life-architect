
import React from 'react';

export const CosmicSignatureIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: 'currentColor', stopOpacity: 0.5}} />
                <stop offset="100%" style={{stopColor: 'currentColor', stopOpacity: 0}} />
            </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.7" />
        <path d="M50,5 A45,45 0 0,1 95,50" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M50,95 A45,45 0 0,1 5,50" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="50" cy="5" r="3" fill="currentColor" />
        <circle cx="50" cy="95" r="3" fill="currentColor" />
        <circle cx="5" cy="50" r="3" fill="currentColor" />
        <circle cx="95" cy="50" r="3" fill="currentColor" />
        <circle cx="50" cy="50" r="50" fill="url(#grad1)" />
    </svg>
);