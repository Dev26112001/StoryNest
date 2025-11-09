import React from 'react';

const iconProps = {
    className: "w-6 h-6",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as "round",
    strokeLinejoin: "round" as "round",
};

export const PlayIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
);

export const PauseIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
);

export const RecordIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <circle cx="12" cy="12" r="10"></circle>
    </svg>
);

export const StopIcon: React.FC<{className?: string}> = ({className}) => (
     <svg {...iconProps} className={className || iconProps.className}>
        <rect x="6" y="6" width="12" height="12"></rect>
    </svg>
);

export const ChevronLeftIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

export const MagicWandIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <path d="M15 4l-8 8 5 5 8-8-5-5z"></path>
        <path d="M15 4l6 6"></path>
        <path d="M3 21l3-3"></path>
    </svg>
);

export const BookOpenIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);

export const MicrophoneIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
);

export const SpeakerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>
);

export const RefreshCwIcon: React.FC<{className?: string, isSpinning?: boolean}> = ({className, isSpinning}) => (
    <svg {...iconProps} className={`${className || iconProps.className} ${isSpinning ? 'animate-spin' : ''}`}>
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
);

export const PlusIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);