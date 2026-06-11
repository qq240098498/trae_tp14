import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Clock, Mic, DollarSign, FileText, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import { useAppStore } from '../../store/useAppStore';

const durationOptions = [1, 2, 3, 4, 5];

export default function CreateOrderForm() {
  const games = useAppStore(s => s.games);
  const setPendingOrder = useAppStore(s => s.setPendingOrder);
  const navigate = useNavigate();

  const [gameId, setGameId] = useState(games[0]?.id || '');
  const [duration, setDuration] = useState(2);
  const [customDuration, setCustomDuration] = useState(false);
  const [customHours, setCustomHours] = useState(2);
  const [startTime, setStartTime] = useState('');
  const [requirements, setRequirements] = useState('');
  const [budget, setBudget] = useState(50);
  const [voiceRequired, setVoiceRequired] = useState(true);

  const actualDuration = customDuration ? customHours : duration;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameId || !startTime) return;
    setPendingOrder({
      gameId,
      duration: actualDuration,
      startTime,
      requirements,
      budget,
      voiceRequired,
    });
    navigate('/order/match');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Gamepad2 size={20} className="text-cyan-neon" />
          <h3 className="font-display font-bold text-lg">选择游戏</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {games.map(game => (
            <button
              key={game.id}
              type="button"
              onClick={() => setGameId(game.id)}
              className={`p-3 rounded-lg transition-all text-left ${
                gameId === game.id
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
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={20} className="text-cyan-neon" />
          <h3 className="font-display font-bold text-lg">游戏时长</h3>
        </div>
        {!customDuration ? (
          <div className="grid grid-cols-5 gap-3 mb-3">
            {durationOptions.map(h => (
              <button
                key={h}
                type="button"
                onClick={() => setDuration(h)}
                className={`py-3 rounded-lg font-medium transition-all ${
                  duration === h
                    ? 'bg-cyan-neon text-black shadow-neon-cyan'
                    : 'bg-cyber-bg-primary/40 border border-white/10 hover:border-white/30 text-cyber-text-secondary'
                }`}
              >
                {h}小时
              </button>
            ))}
          </div>
        ) : (
          <div className="mb-3">
            <input
              type="number"
              min="1"
              max="24"
              value={customHours}
              onChange={e => setCustomHours(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 rounded-lg input-dark"
              placeholder="输入自定义时长（小时）"
            />
          </div>
        )}
        <button
          type="button"
          onClick={() => setCustomDuration(!customDuration)}
          className="text-sm text-cyan-neon hover:underline"
        >
          {customDuration ? '← 使用预设时长' : '自定义时长 →'}
        </button>

        <div className="mt-5">
          <label className="block text-sm font-medium mb-2 text-cyber-text-secondary">
            开始时间
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="w-full px-4 py-3 rounded-lg input-dark"
            required
          />
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={20} className="text-cyan-neon" />
          <h3 className="font-display font-bold text-lg">预算范围</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-cyber-text-secondary">每小时预算</span>
            <span className="font-display font-bold text-xl neon-text-magenta">¥{budget}</span>
          </div>
          <input
            type="range"
            min="10"
            max="200"
            step="5"
            value={budget}
            onChange={e => setBudget(parseInt(e.target.value))}
            className="w-full accent-fuchsia-500"
          />
          <div className="flex justify-between text-xs text-cyber-text-muted">
            <span>¥10</span>
            <span>¥200</span>
          </div>
          <p className="text-sm text-cyber-text-secondary">
            预计总费用：<span className="neon-text-cyan font-bold">¥{budget * actualDuration}</span>
          </p>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Mic size={20} className="text-cyan-neon" />
          <h3 className="font-display font-bold text-lg">语音需求</h3>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-cyber-bg-primary/40 border border-white/5">
          <div>
            <div className="font-medium">要求语音陪聊</div>
            <div className="text-sm text-cyber-text-muted">开启语音可以获得更好的陪玩体验</div>
          </div>
          <button
            type="button"
            onClick={() => setVoiceRequired(!voiceRequired)}
            className={`relative w-14 h-7 rounded-full transition-all ${
              voiceRequired ? 'bg-cyan-neon' : 'bg-gray-600'
            }`}
          >
            <span
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all ${
                voiceRequired ? 'left-7' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={20} className="text-cyan-neon" />
          <h3 className="font-display font-bold text-lg">需求描述</h3>
        </div>
        <textarea
          value={requirements}
          onChange={e => setRequirements(e.target.value)}
          className="w-full px-4 py-3 rounded-lg input-dark resize-none h-28"
          placeholder="比如：打野位带飞、需要教我对线技巧、只要陪聊娱乐就行..."
          maxLength={300}
        />
        <div className="text-right text-xs text-cyber-text-muted mt-1">
          {requirements.length}/300
        </div>
      </Card>

      <Button type="submit" variant="primary" size="lg" className="w-full">
        智能匹配陪玩师 <ArrowRight size={20} />
      </Button>
    </form>
  );
}
