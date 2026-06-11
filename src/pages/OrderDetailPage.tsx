import { useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, FileText, CreditCard, PlayCircle, CheckCircle } from 'lucide-react';
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

  const order = useMemo(() => id ? orders.find(o => o.id === id) : undefined, [orders, id]);
  const coach = useMemo(() => order ? users.find(u => u.id === order.coachId) : undefined, [users, order]);
  const game = useMemo(() => order ? games.find(g => g.id === order.gameId) : undefined, [games, order]);
  const currentUser = useMemo(
    () => currentUserId ? users.find(u => u.id === currentUserId) || null : null,
    [users, currentUserId]
  );

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
          {order.status === 'pending_payment' && currentUser?.role === 'player' && (
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
          {order.status === 'completed' && currentUser?.role === 'player' && (
            <Button variant="secondary" onClick={() => navigate(`/orders/${order.id}/review`)}>
              去评价
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
