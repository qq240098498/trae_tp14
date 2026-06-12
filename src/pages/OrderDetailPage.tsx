import { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, FileText, CreditCard, PlayCircle, CheckCircle, RefreshCcw, XCircle, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Card from '../components/common/Card';
import OrderTimeline from '../components/order/OrderTimeline';
import Button from '../components/common/Button';
import StarRating from '../components/common/StarRating';
import { statusText, statusColor } from '../utils/helpers';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const users = useAppStore(s => s.users);
  const orders = useAppStore(s => s.orders);
  const games = useAppStore(s => s.games);
  const currentUserId = useAppStore(s => s.currentUserId);
  const updateOrderStatus = useAppStore(s => s.updateOrderStatus);
  const requestRefund = useAppStore(s => s.requestRefund);
  const approveRefund = useAppStore(s => s.approveRefund);
  const rejectRefund = useAppStore(s => s.rejectRefund);

  const order = useMemo(() => id ? orders.find(o => o.id === id) : undefined, [orders, id]);
  const coach = useMemo(() => order ? users.find(u => u.id === order.coachId) : undefined, [users, order]);
  const game = useMemo(() => order ? games.find(g => g.id === order.gameId) : undefined, [games, order]);
  const currentUser = useMemo(
    () => currentUserId ? users.find(u => u.id === currentUserId) || null : null,
    [users, currentUserId]
  );

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-cyber-text-secondary mb-4">订单不存在</p>
        <Link to="/orders">
          <Button variant="outline">返回订单列表</Button>
        </Link>
      </div>
    );
  }

  const handlePay = () => {
    updateOrderStatus(order.id, 'paid');
  };
  const handleStart = () => {
    updateOrderStatus(order.id, 'in_progress');
  };
  const handleComplete = () => {
    updateOrderStatus(order.id, 'completed');
  };

  const handleRequestRefund = () => {
    if (!refundReason.trim()) {
      alert('请填写退款原因');
      return;
    }
    const wasPaid = order.status === 'paid';
    const success = requestRefund(order.id, refundReason.trim());
    if (success) {
      setShowRefundModal(false);
      setRefundReason('');
      if (wasPaid) {
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

  const isPlayer = currentUser?.role === 'player' && order.playerId === currentUser?.id;
  const isCoach = currentUser?.role === 'coach' && order.coachId === currentUser?.id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-cyber-text-secondary hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> 返回订单列表
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl mb-1">订单详情</h1>
          <p className="text-sm text-cyber-text-muted font-mono">#{order.id}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColor[order.status]}`}>
          {statusText[order.status]}
        </span>
      </div>

      <Card className="p-6 mb-6">
        <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
          <Clock size={20} className="text-cyan-neon" /> 订单状态
        </h3>
        <OrderTimeline currentStatus={order.status} />
      </Card>

      {order.refundReason && (
        <Card className="p-6 mb-6 bg-orange-500/5 border-orange-500/20">
          <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
            <RefreshCcw size={20} className="text-orange-400" /> 退款信息
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-cyber-text-muted flex-shrink-0">退款原因：</span>
              <span className="text-orange-300">{order.refundReason}</span>
            </div>
            {order.refundRequestedAt && (
              <div className="flex items-start gap-2">
                <span className="text-cyber-text-muted flex-shrink-0">申请时间：</span>
                <span className="text-cyber-text-secondary">{order.refundRequestedAt}</span>
              </div>
            )}
            {order.refundDecidedAt && (
              <div className="flex items-start gap-2">
                <span className="text-cyber-text-muted flex-shrink-0">处理时间：</span>
                <span className="text-cyber-text-secondary">{order.refundDecidedAt}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <User size={20} className="text-cyan-neon" /> 陪玩师信息
          </h3>
          {coach && (
            <Link to={`/coaches/${coach.id}`} className="flex items-center gap-4 p-3 rounded-lg bg-cyber-bg-primary/40 hover:bg-cyber-bg-primary/60 transition-all">
              <img
                src={coach.avatar}
                alt={coach.username}
                className="w-14 h-14 rounded-lg border border-cyan-neon/20"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium flex items-center gap-2">
                  {coach.username}
                  {coach.isOnline && <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
                </div>
                <StarRating rating={coach.rating} showValue size={14} />
                <div className="text-xs text-cyber-text-muted mt-0.5">{coach.reviewCount} 条评价</div>
              </div>
            </Link>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <FileText size={20} className="text-cyan-neon" /> 订单信息
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-cyber-text-secondary flex items-center gap-2">
                <span className="text-xl">{game?.icon}</span> 游戏
              </span>
              <span className="font-medium">{game?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-cyber-text-secondary">游戏时长</span>
              <span className="font-medium">{order.duration} 小时</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-cyber-text-secondary">开始时间</span>
              <span className="font-medium">{order.startTime}</span>
            </div>
            <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-cyber-text-secondary">订单总额</span>
              <span className="font-display font-bold text-2xl neon-text-magenta">¥{order.totalPrice}</span>
            </div>
          </div>
        </Card>
      </div>

      {order.requirements && (
        <Card className="p-6 mt-6">
          <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
            <FileText size={20} className="text-cyan-neon" /> 需求描述
          </h3>
          <p className="text-cyber-text-secondary">{order.requirements}</p>
        </Card>
      )}

      <Card className="p-6 mt-6">
        <div className="flex flex-wrap gap-3 justify-end">
          {order.status === 'pending_payment' && isPlayer && (
            <Button variant="primary" onClick={handlePay}>
              <CreditCard size={18} /> 立即支付 ¥{order.totalPrice}
            </Button>
          )}
          {order.status === 'paid' && (
            <Button variant="primary" onClick={handleStart}>
              <PlayCircle size={18} /> 开始服务
            </Button>
          )}
          {order.status === 'in_progress' && (
            <Button variant="primary" onClick={handleComplete}>
              <CheckCircle size={18} /> 完成服务
            </Button>
          )}
          {order.status === 'completed' && isPlayer && (
            <Button variant="secondary" onClick={() => navigate(`/orders/${order.id}/review`)}>
              去评价
            </Button>
          )}
          {(order.status === 'paid' || order.status === 'in_progress') && isPlayer && (
            <Button variant="danger" onClick={() => setShowRefundModal(true)}>
              <RefreshCcw size={18} /> 申请退款
            </Button>
          )}
          {order.status === 'refunding' && isCoach && (
            <>
              <Button variant="danger" onClick={handleRejectRefund}>
                <XCircle size={18} /> 拒绝退款
              </Button>
              <Button variant="primary" onClick={handleApproveRefund}>
                <CheckCircle2 size={18} /> 同意退款
              </Button>
            </>
          )}
        </div>
      </Card>

      {showRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-cyber-bg-card border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-display font-bold text-xl mb-2">
              {order.status === 'paid' ? '申请退款' : '申请退款（需陪玩师确认）'}
            </h3>
            <div className="space-y-3 mb-4">
              <p className="text-sm text-cyber-text-secondary">
                {order.status === 'paid'
                  ? '服务尚未开始，退款将立即生效，款项原路返回。'
                  : '服务已开始，需要陪玩师同意后才能完成退款。'}
              </p>
              <div className="p-3 rounded-lg bg-cyber-bg-primary/60 border border-white/5">
                <div className="text-xs text-cyber-text-muted mb-1">退款金额</div>
                <div className="text-2xl font-bold neon-text-magenta">¥{order.totalPrice}</div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-cyber-text-secondary mb-2">退款原因 <span className="text-red-400">*</span></label>
              <textarea
                value={refundReason}
                onChange={e => setRefundReason(e.target.value)}
                placeholder="请详细说明退款原因..."
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
    </div>
  );
}
