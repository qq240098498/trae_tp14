import { useState, useMemo } from 'react';
import { Package, Clock, CreditCard, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Card from '../components/common/Card';
import OrderCard from '../components/order/OrderCard';
import type { OrderStatus } from '../types';
import { cn } from '../lib/utils';

const tabs: { status: OrderStatus | 'all'; label: string; icon: any }[] = [
  { status: 'all', label: '全部', icon: Package },
  { status: 'pending_payment', label: '待支付', icon: CreditCard },
  { status: 'paid', label: '已支付', icon: Clock },
  { status: 'in_progress', label: '进行中', icon: Clock },
  { status: 'completed', label: '已完成', icon: CheckCircle },
  { status: 'refunding', label: '退款中', icon: RefreshCcw },
  { status: 'refunded', label: '已退款', icon: XCircle },
  { status: 'cancelled', label: '已取消', icon: XCircle },
];

export default function OrderListPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const users = useAppStore(s => s.users);
  const currentUserId = useAppStore(s => s.currentUserId);
  const orders = useAppStore(s => s.orders);
  const currentUser = useMemo(
    () => currentUserId ? users.find(u => u.id === currentUserId) || null : null,
    [users, currentUserId]
  );

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-cyber-text-secondary">请先登录查看订单</p>
      </div>
    );
  }

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(o => o.status === activeTab);

  const userOrders = currentUser.role === 'player'
    ? filteredOrders.filter(o => o.playerId === currentUser.id)
    : filteredOrders.filter(o => o.coachId === currentUser.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-3xl mb-2">我的订单</h1>
        <p className="text-cyber-text-secondary">查看和管理你的订单记录</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 mb-6">
        {tabs.map(tab => {
          const count = tab.status === 'all'
            ? (currentUser.role === 'player'
                ? orders.filter(o => o.playerId === currentUser.id).length
                : orders.filter(o => o.coachId === currentUser.id).length)
            : orders.filter(o => {
                const userMatch = currentUser.role === 'player'
                  ? o.playerId === currentUser.id
                  : o.coachId === currentUser.id;
                return userMatch && o.status === tab.status;
              }).length;

          return (
            <button
              key={tab.status}
              onClick={() => setActiveTab(tab.status)}
              className={cn(
                'flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all text-sm font-medium',
                activeTab === tab.status
                  ? 'bg-cyan-neon/15 border border-cyan-neon/50 text-cyan-neon shadow-neon-cyan'
                  : 'bg-cyber-bg-card/60 border border-white/5 text-cyber-text-secondary hover:border-white/20'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs',
                activeTab === tab.status ? 'bg-cyan-neon/30' : 'bg-white/5'
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {userOrders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package size={48} className="mx-auto mb-4 text-cyber-text-muted" />
          <h3 className="font-display font-bold text-lg mb-2">暂无订单</h3>
          <p className="text-cyber-text-secondary">
            {activeTab === 'all' ? '去发布你的第一个陪玩需求吧' : '此分类下暂无订单'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {userOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
