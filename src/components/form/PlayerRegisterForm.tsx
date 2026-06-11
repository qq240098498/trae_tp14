import { useState } from 'react';
import { User, Mail, Calendar } from 'lucide-react';
import Button from '../common/Button';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';

export default function PlayerRegisterForm() {
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [age, setAge] = useState(20);
  const [bio, setBio] = useState('');
  const registerPlayer = useAppStore(s => s.registerPlayer);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    registerPlayer({ username, gender, age, bio });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-2 text-cyber-text-secondary">
          <User size={14} className="inline mr-1" /> 昵称
        </label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full px-4 py-3 rounded-lg input-dark"
          placeholder="请输入昵称"
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
          <Calendar size={14} className="inline mr-1" /> 年龄
        </label>
        <input
          type="number"
          min="12"
          max="80"
          value={age}
          onChange={e => setAge(parseInt(e.target.value) || 20)}
          className="w-full px-4 py-3 rounded-lg input-dark"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-cyber-text-secondary">
          <Mail size={14} className="inline mr-1" /> 个人简介
        </label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          className="w-full px-4 py-3 rounded-lg input-dark resize-none h-24"
          placeholder="简单介绍一下自己..."
        />
      </div>

      <Button type="submit" variant="primary" className="w-full" size="lg">
        注册玩家账号
      </Button>
    </form>
  );
}
