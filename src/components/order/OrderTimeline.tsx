import { CheckCircle, Circle, Clock } from 'lucide-react';
import type { OrderStatus } from '../../types';
import { cn } from '../../lib/utils';

const steps: { status: OrderStatus; label: string }[] = [
  { status: 'pending_payment', label: '待支付' },
  { status: 'paid', label: '已支付' },
  { status: 'in_progress', label: '进行中' },
  { status: 'completed', label: '已完成' },
];

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

export default function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const currentIndex = steps.findIndex(s => s.status === currentStatus);
  if (currentStatus === 'cancelled') {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
        <span className="text-red-400 font-medium">订单已取消</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-start justify-between">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex || step.status === currentStatus;
          const isCurrent = step.status === currentStatus;
          return (
            <div key={step.status} className="flex flex-col items-center flex-1 relative">
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute top-4 left-1/2 w-full h-0.5',
                    idx < currentIndex ? 'bg-cyan-neon' : 'bg-white/10'
                  )}
                />
              )}
              <div
                className={cn(
                  'relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
                  isCurrent
                    ? 'border-cyan-neon bg-cyan-neon/20 shadow-neon-cyan'
                    : isCompleted
                    ? 'border-cyan-neon bg-cyan-neon text-black'
                    : 'border-white/20 bg-cyber-bg-primary text-cyber-text-muted'
                )}
              >
                {isCompleted && !isCurrent ? (
                  <CheckCircle size={16} />
                ) : isCurrent ? (
                  <Clock size={16} className="text-cyan-neon animate-pulse" />
                ) : (
                  <Circle size={16} />
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium text-center',
                  isCurrent ? 'text-cyan-neon' : isCompleted ? 'text-white' : 'text-cyber-text-muted'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
