import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Sparkles, Users, Star, Zap, ArrowRight, TrendingUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Card from '../components/common/Card';
import CoachCard from '../components/coach/CoachCard';
import Button from '../components/common/Button';

export default function HomePage() {
  const games = useAppStore(s => s.games);
  const users = useAppStore(s => s.users);
  const currentUserId = useAppStore(s => s.currentUserId);

  const coaches = useMemo(
    () => users.filter(u => u.role === 'coach').sort((a, b) => b.rating - a.rating).slice(0, 6),
    [users]
  );
  const currentUser = useMemo(
    () => currentUserId ? users.find(u => u.id === currentUserId) || null : null,
    [users, currentUserId]
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-neon/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-neon/10 border border-cyan-neon/30 text-cyan-neon text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>专业游戏陪玩平台 · 10000+ 优质陪玩师</span>
            </div>
            <h1 className="font-display font-black text-4xl md:text-6xl lg:text-7xl leading-tight mb-6">
              <span className="neon-text-cyan">GAME</span>
              <span className="neon-text-magenta">MATE</span>
              <br />
              <span className="text-white">找陪玩 · 一起开黑</span>
            </h1>
            <p className="text-lg md:text-xl text-cyber-text-secondary mb-10 max-w-2xl mx-auto">
              智能匹配最适合你的陪玩师，高效上分、快乐开黑、专业教学，
              让每一局游戏都成为难忘的体验。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/order/create" className="flex-1 max-w-xs">
                <Button variant="primary" size="lg" className="w-full">
                  <Zap size={20} /> 立即发布需求
                </Button>
              </Link>
              <Link to="/coaches" className="flex-1 max-w-xs">
                <Button variant="outline" size="lg" className="w-full">
                  <Users size={20} /> 浏览陪玩师
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {[
              { icon: Users, label: '认证陪玩', value: '10,000+' },
              { icon: Gamepad2, label: '热门游戏', value: '50+' },
              { icon: Star, label: '平均评分', value: '4.9' },
              { icon: TrendingUp, label: '完成订单', value: '500K+' },
            ].map((stat, i) => (
              <Card key={i} className="p-5 text-center">
                <stat.icon size={24} className="mx-auto mb-2 text-cyan-neon" />
                <div className="font-display font-bold text-2xl neon-text-cyan">{stat.value}</div>
                <div className="text-sm text-cyber-text-muted">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Game Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-2">🎮 热门游戏</h2>
              <p className="text-cyber-text-secondary">选择你的战场，找到专属陪玩</p>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {games.map((game, i) => (
              <Link
                to={`/order/create?game=${game.id}`}
                key={game.id}
                className="flex-shrink-0 group"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <Card hover className="p-5 w-40 text-center transition-transform group-hover:-translate-y-2">
                  <div className="text-5xl mb-3 transition-transform group-hover:scale-110">
                    {game.icon}
                  </div>
                  <div className="font-medium mb-1">{game.name}</div>
                  <div className="text-xs text-cyber-text-muted">{game.category}</div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Coaches */}
      <section className="py-16 bg-gradient-to-b from-transparent via-cyber-bg-secondary/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-2">⭐ 金牌陪玩师</h2>
              <p className="text-cyber-text-secondary">高评分、高口碑、值得信赖</p>
            </div>
            <Link to="/coaches" className="hidden md:flex items-center gap-1 text-cyan-neon hover:underline">
              查看全部 <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coaches.map((coach, i) => (
              <div key={coach.id} style={{ animationDelay: `${i * 100}ms` }}>
                <CoachCard coach={coach} showDetails onClick={() => {}} />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/coaches">
              <Button variant="outline">查看全部陪玩师</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-neon/5 via-fuchsia-500/5 to-cyan-neon/5" />
            <div className="relative z-10">
              <h2 className="font-display font-bold text-2xl md:text-4xl mb-4">
                想成为陪玩师？
              </h2>
              <p className="text-cyber-text-secondary mb-8 max-w-xl mx-auto">
                加入我们，用你的游戏技术赚取收入。灵活接单，自由定价，展示实力！
              </p>
              {currentUser?.role === 'coach' ? (
                <Link to="/orders">
                  <Button variant="secondary" size="lg">
                    查看我的订单
                  </Button>
                </Link>
              ) : (
                <Link to="/register/coach">
                  <Button variant="secondary" size="lg">
                    <Sparkles size={20} /> 立即注册陪玩师
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
