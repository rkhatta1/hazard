import { ReactNode } from 'react';

export type ExpansionDirection = 'left' | 'right';
export type Theme = 'light' | 'dark';

export interface ExpandedContentProps {
  setFullScreen: (isFull: boolean) => void;
  isFullScreen: boolean;
  theme: Theme;
}

export interface GridItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  originSide: ExpansionDirection; 
  colSpan?: string; 
  rowSpan?: string;
  content: ReactNode | ((theme: Theme) => ReactNode); 
  expandedContent: ReactNode | ((props: ExpandedContentProps) => ReactNode); 
  className?: string; 
}