import { Link } from 'react-router-dom';
import { Crown, ArrowLeft } from 'lucide-react';
import Card from '../components/common/Card';
import CoachRegisterForm from '../components/form/CoachRegisterForm';

export default function CoachRegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-cyber-text-secondary hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} /> 返回首页
        </Link>

        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-neon-magenta">
              <Crown size={28} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl mb-2">陪玩师注册</h1>
            <p className="text-cyber-text-secondary text-sm">
              展示你的游戏实力，接单赚钱
            </p>
          </div>
          <CoachRegisterForm />
          <div className="mt-6 pt-6 border-t border-white/5 text-center text-sm text-cyber-text-muted">
            只是想找陪玩？
            <Link to="/register/player" className="text-cyan-neon hover:underline ml-1">
              注册玩家账号
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
