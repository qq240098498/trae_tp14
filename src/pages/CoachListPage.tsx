import { useState, useMemo } from 'react';
import { Search, Filter, Users } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Card from '../components/common/Card';
import CoachCard from '../components/coach/CoachCard';
import type { Game } from '../types';

export default function CoachListPage() {
  const users = useAppStore(s => s.users);
  const games = useAppStore(s => s.games);
  const coaches = useMemo(() => users.filter(u => u.role === 'coach'), [users]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const filteredCoaches = useMemo(() => {
    let result = [...coaches];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => c.username.toLowerCase().includes(q) || c.bio.toLowerCase().includes(q));
    }
    if (selectedGame) {
      const getCoachSkills = useAppStore.getState().getCoachSkills;
      result = result.filter(c => getCoachSkills(c.id).some(s => s.gameId === selectedGame));
    }
    if (showOnlineOnly) {
      result = result.filter(c => c.isOnline);
    }
    return result.sort((a, b) => b.rating - a.rating);
  }, [coaches, searchQuery, selectedGame, showOnlineOnly]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-3xl mb-2 flex items-center gap-3">
          <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center">
            <Users size={22} />
          </span>
          陪玩师大厅
        </h1>
        <p className="text-cyber-text-secondary">共 {coaches.length} 位认证陪玩师等你开黑</p>
      </div>

      <Card className="p-5 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyber-text-muted" />
            <input
              type="text"
              placeholder="搜索陪玩师昵称..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-lg input-dark"
            />
          </div>
          <div className="flex items-center gap-2 lg:gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-cyber-text-muted" />
              <span className="text-sm text-cyber-text-secondary">游戏筛选:</span>
            </div>
            <button
              onClick={() => setSelectedGame(null)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                selectedGame === null
                  ? 'bg-cyan-neon/15 border border-cyan-neon/50 text-cyan-neon'
                  : 'bg-cyber-bg-primary/40 border border-white/10 text-cyber-text-secondary hover:border-white/30'
              }`}
            >
              全部
            </button>
            {games.slice(0, 6).map((game: Game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all inline-flex items-center gap-1 ${
                  selectedGame === game.id
                    ? 'bg-cyan-neon/15 border border-cyan-neon/50 text-cyan-neon'
                    : 'bg-cyber-bg-primary/40 border border-white/10 text-cyber-text-secondary hover:border-white/30'
                }`}
              >
                <span>{game.icon}</span> {game.name}
              </button>
            ))}
            <button
              onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all inline-flex items-center gap-1.5 ${
                showOnlineOnly
                  ? 'bg-green-500/15 border border-green-400/50 text-green-400'
                  : 'bg-cyber-bg-primary/40 border border-white/10 text-cyber-text-secondary hover:border-white/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-green-400" />
              仅显示在线
            </button>
          </div>
        </div>
      </Card>

      {filteredCoaches.length === 0 ? (
        <Card className="p-12 text-center">
          <Users size={48} className="mx-auto mb-4 text-cyber-text-muted" />
          <h3 className="font-display font-bold text-lg mb-2">暂无匹配的陪玩师</h3>
          <p className="text-cyber-text-secondary">试试调整筛选条件</p>
        </Card>
      ) : (
        <>
          <p className="text-sm text-cyber-text-muted mb-4">找到 {filteredCoaches.length} 位陪玩师</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCoaches.map(coach => (
              <CoachCard key={coach.id} coach={coach} showDetails onClick={() => {}} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
