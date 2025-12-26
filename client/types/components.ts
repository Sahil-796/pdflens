import { type ReactNode, type ElementType, type CSSProperties, type JSX } from 'react';
import { type Transition, type Variants } from 'motion/react';

// TextShimmerWave Types
export type TextShimmerWaveProps = {
    children: string;
    as?: ElementType;
    className?: string;
    duration?: number;
    zDistance?: number;
    xDistance?: number;
    yDistance?: number;
    spread?: number;
    scaleDistance?: number;
    rotateYDistance?: number;
    transition?: Transition;
};

// AnimatedGroup Types
export type AnimatedGroupPreset =
    | 'fade'
    | 'slide'
    | 'scale'
    | 'blur'
    | 'blur-slide'
    | 'zoom'
    | 'flip'
    | 'bounce'
    | 'rotate'
    | 'swing';

export type AnimatedGroupProps = {
    children: ReactNode;
    className?: string;
    variants?: {
        container?: Variants;
        item?: Variants;
    };
    preset?: AnimatedGroupPreset;
    as?: ElementType;
    asChild?: ElementType;
};

// TextEffect Types
export type TextEffectPreset = 'blur' | 'fade-in-blur' | 'scale' | 'fade' | 'slide';
export type TextEffectPer = 'word' | 'char' | 'line';

export type TextEffectProps = {
    children: string;
    per?: TextEffectPer;
    as?: keyof JSX.IntrinsicElements;
    variants?: {
        container?: Variants;
        item?: Variants;
    };
    className?: string;
    preset?: TextEffectPreset;
    delay?: number;
    speedReveal?: number;
    speedSegment?: number;
    trigger?: boolean;
    onAnimationComplete?: () => void;
    onAnimationStart?: () => void;
    segmentWrapperClassName?: string;
    containerTransition?: Transition;
    segmentTransition?: Transition;
    style?: CSSProperties;
};
