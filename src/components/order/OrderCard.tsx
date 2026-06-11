import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import type { Order } from '../../types';
import Card from '../common/Card';
import { statusText, statusColor } from '../../utils/helpers';
import { useAppStore } from '../../store/useAppStore';
import Button from '../common/Button';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const getCoachById = useAppStore(s => s.getCoachById);
  const getGameById = useAppStore(s => s.getGameById);
  const coach = getCoachById(order.coachId);
  const game = getGameById(order.gameId);

  const showPay = order.status === 'pending_payment';
  const showStart = order.status === 'paid';
  const showComplete = order.status === 'in_progress';
  const showReview = order.status === 'completed';

  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-cyber-text-muted">订单号</span>
            <code className="text-xs px-2 py-0.5 rounded bg-cyber-bg-primary/60 font-mono">
              #{order.id.slice(0, 8)}
            </code>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor[order.status]}`}>
            {statusText[order.status]}
          </span>
        </div>

        <div className="flex gap-4">
          {coach && (
            <img
              src={coach.avatar}
              alt={coach.username}
              className="w-14 h-14 rounded-lg border border-cyan-neon/20 flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">{game?.icon}</span>
              <span className="font-medium">{game?.name}</span>
              <span className="text-cyber-text-muted">·</span>
              <span className="text-cyber-text-secondary text-sm">{order.duration} 小时</span>
            </div>
            {coach && (
              <p className="text-sm text-cyber-text-secondary mt-1 flex items-center gap-1">
                <User size={14} /> {coach.username}
              </p>
            )}
            <p className="text-xs text-cyber-text-muted mt-1 flex items-center gap-1">
              <Clock size={12} /> {order.startTime}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xl font-bold neon-text-magenta">¥{order.totalPrice}</div>
            <p className="text-xs text-cyber-text-muted">总价</p>
          </div>
        </div>

        {order.requirements && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-sm text-cyber-text-secondary line-clamp-2">
              <span className="text-cyber-text-muted">需求：</span>{order.requirements}
            </p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2 justify-end">
          <Link to={`/orders/${order.id}`}>
            <Button variant="ghost" size="sm">订单详情</Button>
          </Link>
          {showPay && (
            <Link to={`/orders/${order.id}`}>
              <Button variant="primary" size="sm">立即支付</Button>
            </Link>
          )}
          {showReview && (
            <Link to={`/orders/${order.id}/review`}>
              <Button variant="secondary" size="sm">去评价</Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
