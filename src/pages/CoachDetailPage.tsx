import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Star, User, Calendar, Award, MessageSquare, TrendingUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Card from '../components/common/Card';
import StarRating from '../components/common/StarRating';
import Button from '../components/common/Button';

export default function CoachDetailPage() {
  const { id } = useParams<{ id: string }>();
  const users = useAppStore(s => s.users);
  const coachSkills = useAppStore(s => s.coachSkills);
  const games = useAppStore(s => s.games);
  const reviews = useAppStore(s => s.reviews);

  const coach = useMemo(
    () => id ? users.find(u => u.id === id && u.role === 'coach') : undefined,
    [users, id]
  );
  const skills = useMemo(
    () => (coach ? coachSkills.filter(s => s.userId === coach.id) : []),
    [coachSkills, coach]
  );
  const coachReviews = useMemo(
    () => (coach ? reviews.filter(r => r.toUserId === coach.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : []),
    [reviews, coach]
  );
  const goodRate = coachReviews.length
    ? Math.round((coachReviews.filter(r => r.overallRating >= 4).length / coachReviews.length) * 100)
    : 100;

  if (!coach) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-cyber-text-secondary mb-4">陪玩师不存在</p>
        <Link to="/coaches">
          <Button variant="outline">返回列表</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link to="/coaches" className="inline-flex items-center gap-1 text-sm text-cyber-text-secondary hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> 返回陪玩师列表
      </Link>

      {/* Profile Header */}
      <Card className="p-6 md:p-8 mb-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-neon/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col md:flex-row gap-6 items-start">
          <div className="relative flex-shrink-0">
            <img
              src={coach.avatar}
              alt={coach.username}
              className="w-28 h-28 rounded-2xl border-2 border-cyan-neon/40"
              style={{ boxShadow: coach.isOnline ? '0 0 30px rgba(0,255,245,0.3)' : undefined }}
            />
            {coach.isOnline && (
              <span className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/90 text-xs font-bold text-black">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                在线
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-display font-bold text-2xl md:text-3xl">{coach.username}</h1>
                  {coach.rating >= 4.9 && <span className="text-2xl">🏆</span>}
                </div>
                <p className="text-sm text-cyber-text-muted flex items-center gap-2 mt-1">
                  <User size={14} /> {coach.gender === 'male' ? '男' : coach.gender === 'female' ? '女' : '其他'} · {coach.age}岁
                  <span className="mx-1">·</span>
                  <Calendar size={14} /> 加入于 {coach.createdAt}
                </p>
              </div>
              <div className="flex gap-4">
                <Link to="/order/create">
                  <Button variant="primary">
                    <TrendingUp size={18} /> 预约TA
                  </Button>
                </Link>
              </div>
            </div>
            <p className="text-cyber-text-secondary mb-4 leading-relaxed">{coach.bio}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <StarRating rating={coach.rating} size={18} showValue />
                <span className="text-sm text-cyber-text-muted">({coach.reviewCount}条评价)</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-green-400 font-bold">{goodRate}%</span>
                <span className="text-cyber-text-muted">好评率</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Skills */}
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
          <Award size={20} className="text-cyan-neon" /> 游戏技能
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map(skill => {
            const game = games.find(g => g.id === skill.gameId);
            return (
              <Card key={skill.id} className="p-5">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{game?.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{game?.name}</div>
                    <div className="text-sm text-cyan-neon font-semibold">{skill.rankLevel}</div>
                    <div className="text-xs text-cyber-text-muted mt-0.5">{skill.description}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-display font-bold text-2xl neon-text-magenta">¥{skill.pricePerHour}</div>
                    <div className="text-xs text-cyber-text-muted">每小时</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Reviews */}
      <div>
        <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-cyan-neon" /> 玩家评价 ({coachReviews.length})
        </h2>
        {coachReviews.length === 0 ? (
          <Card className="p-8 text-center">
            <Star size={40} className="mx-auto mb-3 text-cyber-text-muted" />
            <p className="text-cyber-text-secondary">暂无评价</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {coachReviews.map(review => {
              const reviewer = users.find(u => u.id === review.fromUserId);
              return (
                <Card key={review.id} className="p-5">
                  <div className="flex items-start gap-4">
                    <img
                      src={reviewer?.avatar}
                      className="w-10 h-10 rounded-lg border border-white/10 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="font-medium">{reviewer?.username || '匿名用户'}</div>
                        <div className="text-xs text-cyber-text-muted">{review.createdAt}</div>
                      </div>
                      <StarRating rating={review.overallRating} size={14} showValue />
                      {review.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
                          {review.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-full text-xs bg-cyan-neon/10 border border-cyan-neon/20 text-cyan-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {review.content && (
                        <p className="text-sm text-cyber-text-secondary mt-2">{review.content}</p>
                      )}
                      <div className="flex gap-4 mt-3 pt-3 border-t border-white/5 text-xs text-cyber-text-muted">
                        <span>技术: {review.skillRating}★</span>
                        <span>服务: {review.serviceRating}★</span>
                        <span>态度: {review.attitudeRating}★</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
