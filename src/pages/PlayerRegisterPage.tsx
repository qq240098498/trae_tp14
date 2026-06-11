import { Link } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
import Card from '../components/common/Card';
import PlayerRegisterForm from '../components/form/PlayerRegisterForm';

export default function PlayerRegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-cyber-text-secondary hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} /> 返回首页
        </Link>

        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-neon to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-neon-cyan">
              <UserPlus size={28} className="text-black" />
            </div>
            <h1 className="font-display font-bold text-2xl mb-2">玩家注册</h1>
            <p className="text-cyber-text-secondary text-sm">创建账号，开启你的游戏陪玩之旅</p>
          </div>
          <PlayerRegisterForm />
          <div className="mt-6 pt-6 border-t border-white/5 text-center text-sm text-cyber-text-muted">
            想成为陪玩师？
            <Link to="/register/coach" className="text-cyan-neon hover:underline ml-1">
              注册陪玩师
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
