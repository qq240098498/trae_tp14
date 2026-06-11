import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-cyan-neon to-cyan-400 text-black font-semibold hover:shadow-neon-cyan border border-cyan-neon/50',
  secondary:
    'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-semibold hover:shadow-neon-magenta border border-fuchsia-400/50',
  outline:
    'bg-transparent border border-cyan-neon/50 text-cyan-neon hover:bg-cyan-neon/10 hover:shadow-neon-cyan',
  ghost:
    'bg-transparent text-cyber-text-secondary hover:text-white hover:bg-white/5',
  danger:
    'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded',
  md: 'px-5 py-2.5 text-base rounded-lg',
  lg: 'px-8 py-3.5 text-lg rounded-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-neon/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
