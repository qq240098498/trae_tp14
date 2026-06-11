import { Link } from 'react-router-dom';
import { Zap, Check, ChevronRight } from 'lucide-react';
import type { MatchResult } from '../../types';
import Card from '../common/Card';
import StarRating from '../common/StarRating';
import Button from '../common/Button';
import { useAppStore } from '../../store/useAppStore';

interface MatchCardProps {
  match: MatchResult;
  index: number;
  onSelect: () => void;
}

export default function MatchCard({ match, index, onSelect }: MatchCardProps) {
  const getGameById = useAppStore(s => s.getGameById);
  const game = getGameById(match.skill.gameId);

  return (
    <Card className="overflow-hidden animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={match.coach.avatar}
                alt={match.coach.username}
                className="w-16 h-16 rounded-xl border-2 border-cyan-neon/40"
                style={{ boxShadow: match.coach.isOnline ? '0 0 15px rgba(0,255,245,0.3)' : undefined }}
              />
              {index === 0 && (
                <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xs font-bold text-black shadow-lg">
                  1
                </div>
              )}
              {index === 1 && (
                <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-xs font-bold text-black shadow-lg">
                  2
                </div>
              )}
              {index === 2 && (
                <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-gradient-to-br from-orange-700 to-orange-900 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                  3
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-bold text-lg">{match.coach.username}</h4>
                  {match.coach.isOnline && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-400/40 text-xs text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      在线
                    </span>
                  )}
                </div>
                <StarRating rating={match.coach.rating} showValue size={14} />
                <p className="text-xs text-cyber-text-muted mt-1">{match.coach.reviewCount} 条评价</p>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1 justify-end">
                  <Zap size={14} className="text-yellow-400" />
                  <span className="font-display font-bold text-2xl neon-text-cyan">{match.matchScore}</span>
                  <span className="text-xs text-cyber-text-muted">分</span>
                </div>
                <p className="text-xs text-cyber-text-muted">匹配度</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {match.matchReasons.map((reason, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-cyan-neon/10 border border-cyan-neon/20 text-cyan-300"
                >
                  <Check size={10} /> {reason}
                </span>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-bg-primary/60 border border-white/5">
                <span className="text-lg">{game?.icon}</span>
                <span className="text-sm">{game?.name}</span>
                <span className="text-cyber-text-muted">·</span>
                <span className="text-sm text-cyber-text-secondary">{match.skill.rankLevel}</span>
              </div>
              <div className="text-lg font-bold neon-text-magenta">
                ¥{match.skill.pricePerHour}
                <span className="text-xs text-cyber-text-muted font-normal">/小时</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex gap-3">
          <Link
            to={`/coaches/${match.coach.id}`}
            className="flex-1"
          >
            <Button variant="outline" size="sm" className="w-full">
              查看详情 <ChevronRight size={16} />
            </Button>
          </Link>
          <Button variant="primary" size="sm" className="flex-1" onClick={onSelect}>
            选择 TA
          </Button>
        </div>
      </div>
    </Card>
  );
}
