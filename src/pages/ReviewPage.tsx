import { useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import ReviewForm from '../components/order/ReviewForm';
import Card from '../components/common/Card';

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const users = useAppStore(s => s.users);
  const orders = useAppStore(s => s.orders);
  const currentUserId = useAppStore(s => s.currentUserId);
  const addReview = useAppStore(s => s.addReview);

  const order = useMemo(() => id ? orders.find(o => o.id === id) : undefined, [orders, id]);
  const coach = useMemo(() => order ? users.find(u => u.id === order.coachId) : undefined, [users, order]);
  const currentUser = useMemo(
    () => currentUserId ? users.find(u => u.id === currentUserId) || null : null,
    [users, currentUserId]
  );

  if (!order || !coach || !currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-cyber-text-secondary">订单信息无效</p>
      </div>
    );
  }

  if (order.status !== 'completed') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-cyber-text-secondary mb-4">订单未完成，暂不能评价</p>
        <Link to={`/orders/${order.id}`}>
          <button className="px-6 py-2.5 rounded-lg bg-cyan-neon/15 border border-cyan-neon/50 text-cyan-neon">
            返回订单
          </button>
        </Link>
      </div>
    );
  }

  const handleSubmit = (data: any) => {
    addReview({
      orderId: order.id,
      fromUserId: currentUser.id,
      toUserId: coach.id,
      overallRating: data.overall,
      skillRating: data.skill,
      serviceRating: data.service,
      attitudeRating: data.attitude,
      content: data.content,
      tags: data.tags,
    });
    navigate(`/coaches/${coach.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link to={`/orders/${order.id}`} className="inline-flex items-center gap-1 text-sm text-cyber-text-secondary hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> 返回订单
      </Link>

      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={coach.avatar}
            alt={coach.username}
            className="w-16 h-16 rounded-xl border-2 border-cyan-neon/30"
          />
          <div>
            <h2 className="font-display font-bold text-xl">评价 {coach.username}</h2>
            <p className="text-cyber-text-secondary text-sm">
              为本次陪玩服务打分，帮助其他玩家做出选择
            </p>
          </div>
        </div>
      </Card>

      <ReviewForm onSubmit={handleSubmit} />
    </div>
  );
}
