import { Trophy, DollarSign, Star, TrendingUp, Users, Award, ThumbsUp, ShoppingCart, X } from 'lucide-react';
import Card from '../common/Card';
import StarRating from '../common/StarRating';
import { cn } from '../../lib/utils';
import type { PlatformStats, CoachOrderStats } from '../../types';

interface StatsDashboardProps {
  stats: PlatformStats;
  onClose: () => void;
}

export default function StatsDashboard({ stats, onClose }: StatsDashboardProps) {
  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
      case 3:
        return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white';
      default:
        return 'bg-cyber-bg-primary/60 text-cyber-text-secondary border border-white/10';
    }
  };

  const getProgressBarColor = (rate: number) => {
    if (rate >= 90) return 'bg-gradient-to-r from-green-400 to-emerald-500';
    if (rate >= 75) return 'bg-gradient-to-r from-cyan-400 to-blue-500';
    if (rate >= 60) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    return 'bg-gradient-to-r from-red-400 to-pink-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden animate-fade-in-up">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-neon via-fuchsia-500 to-cyan-neon" />
          
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-neon/20 to-fuchsia-500/20 flex items-center justify-center border border-cyan-neon/30">
                  <Trophy size={24} className="text-cyan-neon" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-2xl">数据统计看板</h2>
                  <p className="text-sm text-cyber-text-muted">实时监控平台运营数据</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 text-cyber-text-secondary hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="p-5 bg-gradient-to-br from-cyan-neon/5 to-transparent border-cyan-neon/20">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-cyber-text-muted mb-1">总订单数</p>
                    <p className="font-display font-bold text-3xl neon-text-cyan">{stats.totalOrders}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-cyan-neon/15 flex items-center justify-center">
                    <ShoppingCart size={20} className="text-cyan-neon" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="text-green-400 flex items-center gap-1">
                    <TrendingUp size={12} /> 已完成 {stats.completedOrders}
                  </span>
                  <span className="text-cyber-text-muted">·</span>
                  <span className="text-red-400">已取消 {stats.cancelledOrders}</span>
                </div>
              </Card>

              <Card className="p-5 bg-gradient-to-br from-fuchsia-500/5 to-transparent border-fuchsia-500/20">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-cyber-text-muted mb-1">订单总金额</p>
                    <p className="font-display font-bold text-3xl neon-text-magenta">¥{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-fuchsia-500/15 flex items-center justify-center">
                    <DollarSign size={20} className="text-fuchsia-400" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="text-cyber-text-secondary">
                    平均 ¥{stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0}/单
                  </span>
                </div>
              </Card>

              <Card className="p-5 bg-gradient-to-br from-yellow-500/5 to-transparent border-yellow-500/20">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-cyber-text-muted mb-1">综合好评率</p>
                    <p className="font-display font-bold text-3xl text-yellow-400">{stats.overallPositiveRate}%</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/15 flex items-center justify-center">
                    <ThumbsUp size={20} className="text-yellow-400" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="text-cyber-text-secondary">
                    {stats.totalPositiveReviews} / {stats.totalReviews} 条好评
                  </span>
                </div>
              </Card>

              <Card className="p-5 bg-gradient-to-br from-green-500/5 to-transparent border-green-500/20">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-cyber-text-muted mb-1">陪玩师数量</p>
                    <p className="font-display font-bold text-3xl text-green-400">{stats.coachRankings.length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-green-500/15 flex items-center justify-center">
                    <Users size={20} className="text-green-400" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="text-cyber-text-secondary">
                    平均 {stats.coachRankings.length > 0 ? Math.round(stats.totalOrders / stats.coachRankings.length) : 0} 单/人
                  </span>
                </div>
              </Card>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Award size={20} className="text-cyan-neon" />
                <h3 className="font-display font-bold text-lg">陪玩师订单量排行榜</h3>
              </div>

              <div className="space-y-3">
                {stats.coachRankings.map((stat, index) => (
                  <CoachRankingCard
                    key={stat.coach.id}
                    stat={stat}
                    rank={index + 1}
                    rankBadgeStyle={getRankBadgeStyle(index + 1)}
                    progressBarColor={getProgressBarColor(stat.positiveRate)}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface CoachRankingCardProps {
  stat: CoachOrderStats;
  rank: number;
  rankBadgeStyle: string;
  progressBarColor: string;
}

function CoachRankingCard({ stat, rank, rankBadgeStyle, progressBarColor }: CoachRankingCardProps) {
  return (
    <Card className={cn(
      'p-4 transition-all duration-300',
      rank <= 3 && 'border-cyan-neon/20 hover:border-cyan-neon/40'
    )}>
      <div className="flex items-center gap-4">
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0',
          rankBadgeStyle
        )}>
          {rank}
        </div>

        <div className="flex-shrink-0">
          <img
            src={stat.coach.avatar}
            alt={stat.coach.username}
            className="w-12 h-12 rounded-xl border border-white/10"
            style={{ boxShadow: stat.coach.isOnline ? '0 0 12px rgba(34, 211, 238, 0.3)' : undefined }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-display font-bold">{stat.coach.username}</h4>
            {stat.coach.isOnline && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-500/15 text-xs text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                在线
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={stat.averageRating} size={12} />
            <span className="text-xs text-cyber-text-muted">{stat.averageRating} 分</span>
          </div>
        </div>

        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-center">
            <p className="font-display font-bold text-xl text-cyan-neon">{stat.orderCount}</p>
            <p className="text-xs text-cyber-text-muted">订单数</p>
          </div>
          <div className="text-center">
            <p className="font-display font-bold text-xl text-fuchsia-400">¥{stat.totalRevenue}</p>
            <p className="text-xs text-cyber-text-muted">总收入</p>
          </div>
          <div className="text-center min-w-[80px]">
            <div className="flex items-center justify-center gap-1">
              <ThumbsUp size={12} className="text-yellow-400" />
              <span className="font-display font-bold text-xl text-yellow-400">{stat.positiveRate}%</span>
            </div>
            <p className="text-xs text-cyber-text-muted">{stat.positiveReviewCount}/{stat.reviewCount} 好评</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-cyber-text-secondary">好评率进度</span>
          <span className="text-cyber-text-muted">{stat.positiveRate}%</span>
        </div>
        <div className="h-2 bg-cyber-bg-primary/60 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500', progressBarColor)}
            style={{ width: `${stat.positiveRate}%` }}
          />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-3 text-xs">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-400">
          <ShoppingCart size={10} /> 完成 {stat.completedOrders} 单
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-400">
          <X size={10} /> 取消 {stat.cancelledOrders} 单
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-neon/10 text-cyan-300">
          <Star size={10} /> {stat.reviewCount} 条评价
        </span>
      </div>
    </Card>
  );
}
