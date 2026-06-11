import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, RefreshCw, Search } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import MatchCard from '../components/order/MatchCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

export default function MatchPage() {
  const pendingOrder = useAppStore(s => s.pendingOrderData);
  const getGameById = useAppStore(s => s.getGameById);
  const generateMatches = useAppStore(s => s.generateMatches);
  const createOrder = useAppStore(s => s.createOrder);
  const matchResults = useAppStore(s => s.matchResults);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState(matchResults);

  useEffect(() => {
    if (!pendingOrder) {
      navigate('/order/create');
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      const result = generateMatches();
      setMatches(result);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [pendingOrder, navigate, generateMatches]);

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
          <h2 className="font-display font-bold text-2xl mb-2">智能匹配中...</h2>
          <p className="text-cyber-text-secondary">正在为你寻找最合适的陪玩师</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
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
              <RefreshCw size={16} /> 换一批
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} className="text-yellow-400" />
        <h2 className="font-display font-bold text-xl">为你匹配了 {matches.length} 位陪玩师</h2>
      </div>

      <div className="space-y-4">
        {matches.map((match, index) => (
          <MatchCard
            key={match.coach.id}
            match={match}
            index={index}
            onSelect={() => handleSelect(match.coach.id, match.skill.id)}
          />
        ))}
      </div>

      {matches.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-cyber-text-secondary mb-4">暂无符合条件的陪玩师</p>
          <Link to="/order/create">
            <Button variant="outline">修改搜索条件</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
