import { useMemo } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Gamepad2, User, ShoppingBag, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';
import Button from './Button';

const navItems = [
  { to: '/', label: '大厅', icon: Gamepad2 },
  { to: '/coaches', label: '陪玩师', icon: User },
  { to: '/orders', label: '我的订单', icon: ShoppingBag },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const users = useAppStore(s => s.users);
  const currentUserId = useAppStore(s => s.currentUserId);
  const logout = useAppStore(s => s.logout);
  const navigate = useNavigate();
  const currentUser = useMemo(
    () => currentUserId ? users.find(u => u.id === currentUserId) || null : null,
    [users, currentUserId]
  );

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-cyber-bg-primary/80 border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-neon to-fuchsia-500 flex items-center justify-center shadow-neon-cyan">
            <Gamepad2 size={22} className="text-black" />
          </div>
          <span className="font-display font-bold text-xl tracking-wider">
            <span className="neon-text-cyan">GAME</span>
            <span className="neon-text-magenta">MATE</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-cyan-neon bg-cyan-neon/10 shadow-neon-cyan'
                    : 'text-cyber-text-secondary hover:text-white hover:bg-white/5'
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link
                to={currentUser.role === 'coach' ? `/coaches/${currentUser.id}` : '/orders'}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card hover:border-cyan-neon/30 transition-all"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="w-7 h-7 rounded-full border border-cyan-neon/30"
                />
                <span className="text-sm font-medium">{currentUser.username}</span>
                {currentUser.isOnline && (
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                )}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut size={16} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/register/player">
                <Button variant="ghost" size="sm">玩家注册</Button>
              </Link>
              <Link to="/register/coach">
                <Button variant="outline" size="sm">成为陪玩</Button>
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-cyber-bg-secondary/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-3 rounded-lg flex items-center gap-3',
                    isActive
                      ? 'text-cyan-neon bg-cyan-neon/10'
                      : 'text-cyber-text-secondary hover:text-white'
                  )
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
            {currentUser ? (
              <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                <div className="flex items-center gap-3 px-2 py-2">
                  <img
                    src={currentUser.avatar}
                    className="w-10 h-10 rounded-full border border-cyan-neon/30"
                  />
                  <div>
                    <div className="font-medium">{currentUser.username}</div>
                    <div className="text-xs text-cyber-text-muted">
                      {currentUser.role === 'coach' ? '陪玩师' : '玩家'}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" onClick={handleLogout} className="justify-start">
                  <LogOut size={18} /> 退出登录
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                <Link to="/register/player" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">玩家注册</Button>
                </Link>
                <Link to="/register/coach" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">成为陪玩</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
