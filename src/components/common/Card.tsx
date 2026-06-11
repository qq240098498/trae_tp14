import { ReactNode, CSSProperties } from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  style?: CSSProperties;
}

export default function Card({ children, className, onClick, hover = false, style }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        'glass-card rounded-xl transition-all duration-300',
        hover && 'hover:-translate-y-1 hover:shadow-neon-glow hover:border-cyan-neon/30 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
