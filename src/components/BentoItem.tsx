"use client";

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { GridItem, Theme } from '@/types';

interface BentoItemProps {
  item: GridItem;
  isOpen: boolean;
  isGrayedOut?: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
  index: number;
  theme: Theme;
  onInitialAnimationComplete?: () => void;
  layoutIdPrefix?: string;
}

const variants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1, 
    opacity: 1, 
    filter: 'blur(0px)',
    transition: { 
      delay: i * 0.1, 
      type: "spring", 
      stiffness: 175, 
      damping: 18 
    }
  }),
  visibleNoDelay: {
    scale: 1, 
    opacity: 1, 
    filter: 'blur(0px)',
    transition: { 
      delay: 0, 
      type: "spring", 
      stiffness: 175, 
      damping: 18 
    }
  },
  grayedOut: { 
    scale: 0.7, 
    opacity: 0.5, 
    filter: 'blur(2px)',
    transition: { duration: 0.3 }
  }
};

const BentoItem: React.FC<BentoItemProps> = ({
  item,
  isOpen,
  isGrayedOut,
  onOpen,
  onClose,
  index,
  theme,
  onInitialAnimationComplete,
  layoutIdPrefix = 'card'
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const isLight = theme === 'light';

  // Dynamic Styles
  const bgClass = isLight 
    ? 'bg-white/80 backdrop-blur-md text-slate-900 border border-white/10 shadow-lg shadow-sky-900/5' 
    : 'bg-neutral-900 text-white shadow-xl border border-neutral-800';

  const hoverScale = !isGrayedOut ? { scale: 0.98 } : {};
  const tapScale = !isGrayedOut ? { scale: 0.95 } : {};

  return (
    <motion.div
      layoutId={`${layoutIdPrefix}-${item.id}`}
      custom={index}
      initial="hidden"
      animate={isGrayedOut ? "grayedOut" : (hasLoaded ? "visibleNoDelay" : "visible")}
      variants={variants}
      onAnimationComplete={() => {
        if (!hasLoaded) {
          setHasLoaded(true);
          onInitialAnimationComplete?.();
        }
      }}
      onClick={() => onOpen(item.id)}
      className={`
        relative group cursor-pointer overflow-hidden rounded-3xl transition-colors duration-500
        ${bgClass}
        ${item.colSpan || 'col-span-1'} 
        ${item.rowSpan || 'row-span-1'}
        ${item.className || ''}
        ${isGrayedOut ? 'pointer-events-none' : ''}
      `}
      whileHover={hoverScale}
      whileTap={tapScale}
    >
      <div className="h-full w-full p-6 flex flex-col justify-between">
         {/* Render content, passing theme if it's a render prop */}
         {typeof item.content === 'function' ? item.content(theme) : item.content}
      </div>
    </motion.div>
  );
};

export default BentoItem;
