import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { User, Clock, Award } from 'lucide-react';
import type { User as UserType, CoachSkill, Game } from '../../types';
import Card from '../common/Card';
import StarRating from '../common/StarRating';
import { useAppStore } from '../../store/useAppStore';

interface CoachCardProps {
  coach: UserType;
  selectedSkill?: CoachSkill;
  showDetails?: boolean;
  onClick?: () => void;
}

export default function CoachCard({ coach, selectedSkill, showDetails = false, onClick }: CoachCardProps) {
  const games = useAppStore(s => s.games);
  const coachSkills = useAppStore(s => s.coachSkills);
  const skills = useMemo(
    () => selectedSkill ? [selectedSkill] : coachSkills.filter(s => s.userId === coach.id),
    [selectedSkill, coachSkills, coach.id]
  );

  return (
    <Card hover className="overflow-hidden" onClick={onClick}>
      <div className="p-5">
        <div className="flex gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={coach.avatar}
              alt={coach.username}
              className="w-20 h-20 rounded-xl border-2 border-cyan-neon/30 object-cover"
              style={{ boxShadow: coach.isOnline ? '0 0 20px rgba(0,255,245,0.4)' : undefined }}
            />
            {coach.isOnline && (
              <span className="absolute -bottom-1 -right-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-400/40 text-xs text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                在线
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display font-bold text-lg flex items-center gap-2">
                  {coach.username}
                  {coach.rating >= 4.9 && <span className="text-yellow-400">🏆</span>}
                </h3>
                <p className="text-sm text-cyber-text-muted flex items-center gap-1 mt-0.5">
                  <User size={14} /> {coach.gender === 'male' ? '男' : '女'} · {coach.age}岁
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <StarRating rating={coach.rating} showValue size={14} />
                <p className="text-xs text-cyber-text-muted mt-1">{coach.reviewCount} 条评价</p>
              </div>
            </div>
            {showDetails && (
              <p className="text-sm text-cyber-text-secondary mt-2 line-clamp-2">{coach.bio}</p>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 mb-2 text-xs text-cyber-text-muted">
            <Award size={14} className="text-cyan-neon" /> 擅长游戏
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => {
              const game = games.find(g => g.id === skill.gameId);
              return (
                <div
                  key={skill.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyber-bg-primary/60 border border-white/5"
                >
                  <span className="text-lg">{game?.icon}</span>
                  <div>
                    <div className="text-xs font-medium">{game?.name}</div>
                    <div className="text-xs text-cyber-text-muted">{skill.rankLevel}</div>
                  </div>
                  <div className="h-6 w-px bg-white/10 mx-1" />
                  <div className="text-right">
                    <div className="text-sm font-bold neon-text-cyan">¥{skill.pricePerHour}</div>
                    <div className="text-xs text-cyber-text-muted">/小时</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {onClick && (
          <Link
            to={`/coaches/${coach.id}`}
            onClick={(e) => e.stopPropagation()}
            className="mt-4 block text-center text-sm text-cyan-neon hover:underline"
          >
            查看详情 →
          </Link>
        )}
      </div>
    </Card>
  );
}
