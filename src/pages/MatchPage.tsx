import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, RefreshCw, Search, Filter, TrendingUp, Star, DollarSign, Wifi } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import MatchCard from '../components/order/MatchCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { cn } from '../lib/utils';

type SortKey = 'match' | 'rating' | 'price_asc' | 'price_desc';

export default function MatchPage() {
  const pendingOrder = useAppStore(s => s.pendingOrderData);
  const getGameById = useAppStore(s => s.getGameById);
  const generateMatches = useAppStore(s => s.generateMatches);
  const createOrder = useAppStore(s => s.createOrder);
  const matchResults = useAppStore(s => s.matchResults);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState(matchResults);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [sortBy, setSortBy] = useState<SortKey>('match');

  useEffect(() => {
    if (!pendingOrder) {
      navigate('/order/create');
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      const result = generateMatches();
      setMatches(result);
      setMaxPrice(pendingOrder.budget * 2);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [pendingOrder, navigate, generateMatches]);

  const filteredAndSortedMatches = useMemo(() => {
    let result = [...matches];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.coach.username.toLowerCase().includes(q) ||
        m.coach.bio.toLowerCase().includes(q)
      );
    }

    if (showOnlineOnly) {
      result = result.filter(m => m.coach.isOnline);
    }

    result = result.filter(m => m.skill.pricePerHour <= maxPrice);

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.coach.rating - a.coach.rating);
        break;
      case 'price_asc':
        result.sort((a, b) => a.skill.pricePerHour - b.skill.pricePerHour);
        break;
      case 'price_desc':
        result.sort((a, b) => b.skill.pricePerHour - a.skill.pricePerHour);
        break;
      case 'match':
      default:
        result.sort((a, b) => b.matchScore - a.matchScore);
        break;
    }

    return result;
  }, [matches, searchQuery, showOnlineOnly, maxPrice, sortBy]);

  const handleSelect = (coachId: string, skillId: string) => {
    const order = createOrder(coachId, skillId);
    navigate(`/orders/${order.id}`);
  };

  if (!pendingOrder) return null;
  const game = getGameById(pendingOrder.gameId);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-neon/20" />
            <div className="absolute inset-0 rounded-full border-4 border-cyan-neon border-t-transparent animate-spin" />
            <Search size={32} className="absolute inset-0 m-auto text-cyan-neon" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-2">正在加载陪玩师...</h2>
          <p className="text-cyber-text-secondary">正在为你准备可选的陪玩师列表</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/order/create" className="inline-flex items-center gap-1 text-sm text-cyber-text-secondary hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> 修改需求
      </Link>

      <Card className="p-5 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-3xl">{game?.icon}</span>
            <div className="min-w-0">
              <div className="font-medium">{game?.name}</div>
              <div className="text-sm text-cyber-text-muted truncate">
                {pendingOrder.duration}小时 · {pendingOrder.startTime}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs text-cyber-text-muted">预算</div>
              <div className="font-display font-bold neon-text-magenta">¥{pendingOrder.budget}/小时</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setMatches(generateMatches());
                  setLoading(false);
                }, 800);
              }}
            >
              <RefreshCw size={16} /> 刷新列表
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-yellow-400" />
        <h2 className="font-display font-bold text-xl">自由选择陪玩师</h2>
        <span className="text-sm text-cyber-text-muted">共 {matches.length} 位 · 已按匹配度优先排序</span>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyber-text-muted" />
            <input
              type="text"
              placeholder="搜索陪玩师昵称..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-lg input-dark text-sm"
            />
          </div>

          <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Filter size={14} className="text-cyber-text-muted" />
              <span className="text-xs text-cyber-text-secondary">筛选:</span>
            </div>

            <button
              onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs transition-all inline-flex items-center gap-1.5',
                showOnlineOnly
                  ? 'bg-green-500/15 border border-green-400/50 text-green-400'
                  : 'bg-cyber-bg-primary/40 border border-white/10 text-cyber-text-secondary hover:border-white/30'
              )}
            >
              <Wifi size={12} />
              仅在线
            </button>

            <div className="flex items-center gap-2">
              <DollarSign size={12} className="text-cyber-text-muted" />
              <span className="text-xs text-cyber-text-secondary">≤ ¥{maxPrice}</span>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={maxPrice}
                onChange={e => setMaxPrice(parseInt(e.target.value))}
                className="w-20 accent-fuchsia-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 flex-wrap">
          <TrendingUp size={14} className="text-cyber-text-muted" />
          <span className="text-xs text-cyber-text-secondary">排序:</span>
          {[
            { key: 'match', label: '匹配度优先', icon: Sparkles },
            { key: 'rating', label: '评分最高', icon: Star },
            { key: 'price_asc', label: '价格最低', icon: DollarSign },
            { key: 'price_desc', label: '价格最高', icon: DollarSign },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key as SortKey)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs transition-all inline-flex items-center gap-1.5',
                sortBy === opt.key
                  ? 'bg-cyan-neon/15 border border-cyan-neon/50 text-cyan-neon'
                  : 'bg-cyber-bg-primary/40 border border-white/10 text-cyber-text-secondary hover:border-white/30'
              )}
            >
              <opt.icon size={12} />
              {opt.label}
            </button>
          ))}
        </div>
      </Card>

      {filteredAndSortedMatches.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-cyber-text-secondary mb-4">暂无符合条件的陪玩师</p>
          <div className="flex gap-3 justify-center">
            <Link to="/order/create">
              <Button variant="outline">修改搜索条件</Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => {
                setSearchQuery('');
                setShowOnlineOnly(false);
                setMaxPrice(200);
              }}
            >
              重置筛选
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <p className="text-sm text-cyber-text-muted mb-4">找到 {filteredAndSortedMatches.length} 位陪玩师</p>
          <div className="space-y-4">
            {filteredAndSortedMatches.map((match, index) => (
              <MatchCard
                key={match.coach.id}
                match={match}
                index={sortBy === 'match' ? index : -1}
                onSelect={() => handleSelect(match.coach.id, match.skill.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
