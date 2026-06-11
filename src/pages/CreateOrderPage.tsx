import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import CreateOrderForm from '../components/form/CreateOrderForm';
import { useAppStore } from '../store/useAppStore';

export default function CreateOrderPage() {
  const users = useAppStore(s => s.users);
  const currentUserId = useAppStore(s => s.currentUserId);
  const navigate = useNavigate();
  const currentUser = useMemo(
    () => currentUserId ? users.find(u => u.id === currentUserId) || null : null,
    [users, currentUserId]
  );

  if (!currentUser) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-cyan-neon/10 flex items-center justify-center mx-auto mb-6 border border-cyan-neon/30">
            <Gamepad2 size={36} className="text-cyan-neon" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-3">请先登录</h2>
          <p className="text-cyber-text-secondary mb-8">登录后即可发布陪玩需求</p>
          <div className="flex gap-4 justify-center">
            <Link to="/register/player">
              <button className="px-6 py-3 rounded-lg bg-cyan-neon/15 border border-cyan-neon/50 text-cyan-neon hover:shadow-neon-cyan transition-all">
                玩家注册
              </button>
            </Link>
            <Link to="/">
              <button className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                返回首页
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (currentUser.role === 'coach') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="font-display font-bold text-2xl mb-3">陪玩师不能下单</h2>
          <p className="text-cyber-text-secondary mb-6">您当前是陪玩师身份，请切换为玩家账号</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-lg bg-cyan-neon/15 border border-cyan-neon/50 text-cyan-neon"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-cyber-text-secondary hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> 返回首页
      </Link>
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-3xl mb-2 flex items-center gap-3">
          <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-neon to-cyan-600 flex items-center justify-center">
            <Gamepad2 size={22} className="text-black" />
          </span>
          发布陪玩需求
        </h1>
        <p className="text-cyber-text-secondary">填写需求，我们将为你智能匹配最合适的陪玩师</p>
      </div>
      <CreateOrderForm />
    </div>
  );
}
