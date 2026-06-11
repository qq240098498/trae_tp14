import { useState } from 'react';
import { User, Trophy, DollarSign, Clock, FileText } from 'lucide-react';
import Button from '../common/Button';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import type { CoachSkill } from '../../types';

export default function CoachRegisterForm() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [age, setAge] = useState(22);
  const [bio, setBio] = useState('');
  const [selectedGames, setSelectedGames] = useState<{ gameId: string; rankLevel: string; pricePerHour: number; description: string }[]>([]);
  const games = useAppStore(s => s.games);
  const registerCoach = useAppStore(s => s.registerCoach);
  const navigate = useNavigate();

  const toggleGame = (gameId: string) => {
    if (selectedGames.find(g => g.gameId === gameId)) {
      setSelectedGames(prev => prev.filter(g => g.gameId !== gameId));
    } else {
      setSelectedGames(prev => [...prev, { gameId, rankLevel: '', pricePerHour: 30, description: '' }]);
    }
  };

  const updateGame = (gameId: string, field: string, value: string | number) => {
    setSelectedGames(prev =>
      prev.map(g => (g.gameId === gameId ? { ...g, [field]: value } : g))
    );
  };

  const canProceed = step === 1
    ? username.trim() !== ''
    : selectedGames.length > 0 && selectedGames.every(g => g.rankLevel.trim() !== '' && g.pricePerHour > 0);

  const handleSubmit = () => {
    const skills: Omit<CoachSkill, 'id' | 'userId'>[] = selectedGames.map(g => ({
      gameId: g.gameId,
      rankLevel: g.rankLevel,
      pricePerHour: g.pricePerHour,
      description: g.description,
    }));
    registerCoach({ username, gender, age, bio }, skills);
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s
                  ? 'bg-cyan-neon text-black shadow-neon-cyan'
                  : 'bg-cyber-bg-primary border border-white/10 text-cyber-text-muted'
              }`}
            >
              {s}
            </div>
            {s < 2 && (
              <div
                className={`w-16 h-0.5 ${step > s ? 'bg-cyan-neon' : 'bg-white/10'}`}
              />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <h3 className="font-display font-bold text-lg flex items-center gap-2">
            <User size={20} className="text-cyan-neon" /> 基本信息
          </h3>
          <div>
            <label className="block text-sm font-medium mb-2 text-cyber-text-secondary">昵称</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg input-dark"
              placeholder="请输入陪玩昵称"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-cyber-text-secondary">性别</label>
            <div className="grid grid-cols-3 gap-3">
              {(['male', 'female', 'other'] as const).map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-3 rounded-lg transition-all text-sm font-medium ${
                    gender === g
                      ? 'bg-cyan-neon/20 border border-cyan-neon/50 text-cyan-neon'
                      : 'bg-cyber-bg-primary/40 border border-white/10 text-cyber-text-secondary hover:border-white/30'
                  }`}
                >
                  {g === 'male' ? '男' : g === 'female' ? '女' : '其他'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-cyber-text-secondary">
              <Clock size={14} className="inline mr-1" /> 年龄
            </label>
            <input
              type="number"
              min="16"
              max="60"
              value={age}
              onChange={e => setAge(parseInt(e.target.value) || 22)}
              className="w-full px-4 py-3 rounded-lg input-dark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-cyber-text-secondary">
              <FileText size={14} className="inline mr-1" /> 个人简介
            </label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full px-4 py-3 rounded-lg input-dark resize-none h-28"
              placeholder="介绍一下你的陪玩风格、擅长领域等..."
            />
          </div>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => setStep(2)}
            disabled={!canProceed}
          >
            下一步
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <h3 className="font-display font-bold text-lg flex items-center gap-2">
            <Trophy size={20} className="text-cyan-neon" /> 游戏技能认证
          </h3>

          <p className="text-sm text-cyber-text-muted">选择你擅长的游戏（可多选）</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {games.map(game => {
              const selected = selectedGames.find(g => g.gameId === game.id);
              return (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => toggleGame(game.id)}
                  className={`p-3 rounded-lg transition-all text-left ${
                    selected
                      ? 'bg-cyan-neon/15 border border-cyan-neon/50 shadow-neon-cyan'
                      : 'bg-cyber-bg-primary/40 border border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{game.icon}</span>
                    <div>
                      <div className="text-sm font-medium">{game.name}</div>
                      <div className="text-xs text-cyber-text-muted">{game.category}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedGames.map(sg => {
            const game = games.find(g => g.id === sg.gameId);
            return (
              <div key={sg.gameId} className="p-4 rounded-lg bg-cyber-bg-primary/40 border border-cyan-neon/20">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{game?.icon}</span>
                  <span className="font-medium">{game?.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-cyber-text-muted mb-1">段位/等级</label>
                    <input
                      type="text"
                      value={sg.rankLevel}
                      onChange={e => updateGame(sg.gameId, 'rankLevel', e.target.value)}
                      className="w-full px-3 py-2 rounded input-dark text-sm"
                      placeholder="如：最强王者"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-cyber-text-muted mb-1">
                      <DollarSign size={12} className="inline" /> 每小时价格
                    </label>
                    <input
                      type="number"
                      min="5"
                      value={sg.pricePerHour}
                      onChange={e => updateGame(sg.gameId, 'pricePerHour', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded input-dark text-sm"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs text-cyber-text-muted mb-1">技能描述</label>
                  <input
                    type="text"
                    value={sg.description}
                    onChange={e => updateGame(sg.gameId, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded input-dark text-sm"
                    placeholder="如：打野位专精，节奏带动"
                  />
                </div>
              </div>
            );
          })}

          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setStep(1)}>
              上一步
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleSubmit} disabled={!canProceed}>
              提交注册
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
