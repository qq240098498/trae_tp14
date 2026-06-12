import { Link } from 'react-router-dom';
import { Clock, User, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
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
  const currentUserId = useAppStore(s => s.currentUserId);
  const users = useAppStore(s => s.users);
  const requestRefund = useAppStore(s => s.requestRefund);
  const approveRefund = useAppStore(s => s.approveRefund);
  const rejectRefund = useAppStore(s => s.rejectRefund);

  const coach = getCoachById(order.coachId);
  const game = getGameById(order.gameId);
  const currentUser = currentUserId ? users.find(u => u.id === currentUserId) || null : null;

  const showPay = order.status === 'pending_payment' && currentUser?.role === 'player';
  const showStart = order.status === 'paid';
  const showComplete = order.status === 'in_progress' && currentUser?.role === 'coach';
  const showReview = order.status === 'completed' && currentUser?.role === 'player';
  const showRefund = (order.status === 'paid' || order.status === 'in_progress') && currentUser?.role === 'player';
  const showRefundApprove = order.status === 'refunding' && currentUser?.role === 'coach' && order.coachId === currentUser.id;

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  const handleRequestRefund = () => {
    if (!refundReason.trim()) {
      alert('请填写退款原因');
      return;
    }
    const success = requestRefund(order.id, refundReason.trim());
    if (success) {
      setShowRefundModal(false);
      setRefundReason('');
      if (order.status === 'paid') {
        alert('退款成功！款项将原路返回');
      } else {
        alert('退款申请已提交，等待陪玩师确认');
      }
    }
  };

  const handleApproveRefund = () => {
    if (confirm('确定同意该退款申请？款项将退回给玩家。')) {
      approveRefund(order.id);
    }
  };

  const handleRejectRefund = () => {
    if (confirm('确定拒绝该退款申请？订单将恢复进行中状态。')) {
      rejectRefund(order.id);
    }
  };

  return (
    <>
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

          {order.refundReason && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-sm text-orange-400">
                <span className="text-cyber-text-muted">退款原因：</span>{order.refundReason}
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
            {showRefund && (
              <Button variant="danger" size="sm" onClick={() => setShowRefundModal(true)}>
                <RefreshCcw size={14} /> 申请退款
              </Button>
            )}
            {showRefundApprove && (
              <>
                <Button variant="danger" size="sm" onClick={handleRejectRefund}>
                  拒绝退款
                </Button>
                <Button variant="primary" size="sm" onClick={handleApproveRefund}>
                  同意退款
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {showRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-cyber-bg-card border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-display font-bold text-xl mb-2">
              {order.status === 'paid' ? '申请退款' : '申请退款（需陪玩师确认）'}
            </h3>
            <p className="text-sm text-cyber-text-secondary mb-4">
              {order.status === 'paid'
                ? '服务尚未开始，退款将立即生效，款项原路返回。'
                : '服务已开始，需要陪玩师同意后才能完成退款。'}
            </p>
            <div className="mb-4">
              <label className="block text-sm text-cyber-text-secondary mb-2">退款原因</label>
              <textarea
                value={refundReason}
                onChange={e => setRefundReason(e.target.value)}
                placeholder="请填写退款原因..."
                className="w-full px-4 py-3 rounded-xl bg-cyber-bg-primary border border-white/10 text-white placeholder-cyber-text-muted focus:border-cyan-neon/50 focus:outline-none focus:ring-2 focus:ring-cyan-neon/20 resize-none h-28"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => { setShowRefundModal(false); setRefundReason(''); }}>
                取消
              </Button>
              <Button variant="primary" onClick={handleRequestRefund}>
                确认申请
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
