"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { GridItem, Theme } from '@/types';

interface ExpandedViewProps {
  item: GridItem;
  onClose: () => void;
  theme: Theme;
  layoutIdPrefix?: string;
  isMobile: boolean;
}

const ExpandedView: React.FC<ExpandedViewProps> = ({
  item,
  onClose,
  theme,
  layoutIdPrefix = 'card',
  isMobile
}) => {
  const [isFullScreen, setFullScreen] = useState(false);
  const isLeftOrigin = item.originSide === 'left';
  const isLight = theme === 'light';

  // Dynamic Styles
  const containerBg = isLight 
    ? "bg-white/95 backdrop-blur-xl text-slate-900 border border-white/50" 
    : "bg-neutral-900 text-white border border-neutral-800";
    
  const backStripBg = isLight
    ? "bg-slate-100 border-l border-slate-200 hover:bg-slate-200"
    : "bg-black border-l border-neutral-800/50 hover:bg-neutral-800";
    
  const backIconBg = isLight
    ? "bg-slate-300 text-slate-700"
    : "bg-white/10 text-white";

  // Determine styles based on full screen state
  const screenState = isFullScreen
    ? `fixed inset-2 md:inset-8 z-[60] flex overflow-hidden rounded-3xl shadow-2xl ${containerBg}`
    : `absolute inset-0 z-50 flex overflow-hidden rounded-3xl shadow-2xl ${containerBg}`;

  const renderContent = () => {
    if (typeof item.expandedContent === 'function') {
      return item.expandedContent({ isFullScreen, setFullScreen, theme });
    }
    return item.expandedContent;
  };

  const containerClasses = isMobile
    ? `fixed bottom-0 left-0 right-0 z-[60] h-[90vh] rounded-t-3xl shadow-2xl overflow-hidden border-t border-white/10 ${containerBg}`
    : `flex overflow-hidden shadow-2xl z-[60] ${containerBg} 
       absolute inset-0 md:rounded-3xl
       ${isFullScreen ? 'md:fixed md:inset-8' : ''}`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[59]"
          onClick={onClose}
        />
      )}

      {/* Desktop Backdrop for Full Screen Mode */}
      {!isMobile && isFullScreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="hidden md:block fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
          onClick={() => setFullScreen(false)}
        />
      )}

      <motion.div
        layoutId={isMobile ? undefined : `${layoutIdPrefix}-${item.id}`}
        layout={!isMobile}
        initial={isMobile ? { y: "100%" } : { opacity: 0 }}
        animate={isMobile ? { y: 0 } : { opacity: 1 }}
        exit={isMobile ? { y: "100%" } : { opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={containerClasses}
        style={{ flexDirection: isLeftOrigin || isMobile ? 'row' : 'row-reverse' }}
      >
        {/* Content Area */}
        <motion.div 
          className="flex-1 overflow-y-auto no-scrollbar relative p-6 md:p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {/* Mobile Close Button */}
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              if (isFullScreen) {
                setFullScreen(false);
              } else {
                onClose(); 
              }
            }}
            className={`md:hidden absolute top-4 right-4 p-2 rounded-full z-50 transition-colors ${isLight ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}
          >
             <X size={20} />
          </button>

          {renderContent()}
        </motion.div>

        {/* Back Button Strip (Desktop) */}
        {!isMobile && !isFullScreen && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className={`hidden md:flex w-20 lg:w-24 flex-col items-center justify-center cursor-pointer transition-colors ${backStripBg}`}
          >
            <div className="flex flex-col items-center gap-6">
              <div className={`${backIconBg} p-3 rounded-full backdrop-blur-sm transition-colors`}>
                <ArrowLeft size={20} />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default ExpandedView;
