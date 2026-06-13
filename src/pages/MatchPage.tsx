import { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, RefreshCw, Search, Filter, TrendingUp, Star, DollarSign, Wifi, Users, Clock, Heart, ChevronRight, Check, Zap, X, AlertTriangle, Calendar, Ban, Clock as ClockIcon, Gamepad2, Wallet, UserX, BarChart3 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import MatchCard from '../components/order/MatchCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StarRating from '../components/common/StarRating';
import StatsDashboard from '../components/stats/StatsDashboard';
import { cn } from '../lib/utils';
import type { RepeatCustomer, BookingValidationResult, BookingFailureReason, PlatformStats } from '../types';

type SortKey = 'match' | 'rating' | 'price_asc' | 'price_desc';
type TabKey = 'all' | 'repeat';

export default function MatchPage() {
  const pendingOrder = useAppStore(s => s.pendingOrderData);
  const getGameById = useAppStore(s => s.getGameById);
  const generateMatches = useAppStore(s => s.generateMatches);
  const createOrder = useAppStore(s => s.createOrder);
  const createOrderFromRepeat = useAppStore(s => s.createOrderFromRepeat);
  const validateRepeatBooking = useAppStore(s => s.validateRepeatBooking);
  const matchResults = useAppStore(s => s.matchResults);
  const getRepeatCustomers = useAppStore(s => s.getRepeatCustomers);
  const getPlatformStats = useAppStore(s => s.getPlatformStats);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState(matchResults);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [sortBy, setSortBy] = useState<SortKey>('match');
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [selectedRepeatCoach, setSelectedRepeatCoach] = useState<RepeatCustomer | null>(null);
  const [repeatLoading, setRepeatLoading] = useState(false);
  const [bookingError, setBookingError] = useState<{ coachId: string; result: BookingValidationResult } | null>(null);
  const [showStats, setShowStats] = useState(false);
  const isSelectingRef = useRef(false);

  const platformStats = useMemo<PlatformStats>(() => {
    return getPlatformStats();
  }, [getPlatformStats]);

  useEffect(() => {
    if (!pendingOrder && !isSelectingRef.current) {
      navigate('/order/create');
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      const result = generateMatches();
      setMatches(result);
      setMaxPrice(pendingOrder.budget * 2);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [pendingOrder, navigate, generateMatches]);

  const repeatCustomers = useMemo(() => {
    return getRepeatCustomers();
  }, [getRepeatCustomers]);

  const filteredRepeatCustomers = useMemo(() => {
    let result = [...repeatCustomers];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(rc =>
        rc.coach.username.toLowerCase().includes(q) ||
        rc.coach.bio.toLowerCase().includes(q)
      );
    }

    if (showOnlineOnly) {
      result = result.filter(rc => rc.coach.isOnline);
    }

    if (pendingOrder) {
      result = result.filter(rc =>
        rc.skills.some(s => s.gameId === pendingOrder.gameId && s.pricePerHour <= maxPrice)
      );
    }

    return result;
  }, [repeatCustomers, searchQuery, showOnlineOnly, maxPrice, pendingOrder]);

  const filteredAndSortedMatches = useMemo(() => {
    let result = [...matches];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.coach.username.toLowerCase().includes(q) ||
        m.coach.bio.toLowerCase().includes(q)
      );
    }

    if (showOnlineOnly) {
      result = result.filter(m => m.coach.isOnline);
    }

    result = result.filter(m => m.skill.pricePerHour <= maxPrice);

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.coach.rating - a.coach.rating);
        break;
      case 'price_asc':
        result.sort((a, b) => a.skill.pricePerHour - b.skill.pricePerHour);
        break;
      case 'price_desc':
        result.sort((a, b) => b.skill.pricePerHour - a.skill.pricePerHour);
        break;
      case 'match':
      default:
        result.sort((a, b) => b.matchScore - a.matchScore);
        break;
    }

    return result;
  }, [matches, searchQuery, showOnlineOnly, maxPrice, sortBy]);

  const handleSelect = (coachId: string, skillId: string) => {
    isSelectingRef.current = true;
    const order = createOrder(coachId, skillId);
    navigate(`/orders/${order.id}`);
  };

  const getFailureIcon = (reason: BookingFailureReason) => {
    switch (reason) {
      case 'coach_not_found':
        return UserX;
      case 'game_not_matched':
        return Gamepad2;
      case 'coach_not_available_today':
        return Ban;
      case 'start_time_passed':
        return ClockIcon;
      case 'time_conflict':
        return Calendar;
      case 'price_exceeds_budget':
        return Wallet;
      case 'duration_invalid':
        return Clock;
      default:
        return AlertTriangle;
    }
  };

  const closeBookingError = () => {
    setBookingError(null);
  };

  const handleRepeatSelect = (repeatCustomer: RepeatCustomer) => {
    if (!pendingOrder) {
      setBookingError({
        coachId: repeatCustomer.coach.id,
        result: {
          valid: false,
          reason: 'unknown',
          message: '预约数据不存在',
          detail: '请返回重新填写预约信息',
        },
      });
      return;
    }

    const gameSkill = repeatCustomer.skills.find(s => s.gameId === pendingOrder.gameId);
    if (!gameSkill) {
      const game = getGameById(pendingOrder.gameId);
      setBookingError({
        coachId: repeatCustomer.coach.id,
        result: {
          valid: false,
          reason: 'game_not_matched',
          message: '该陪玩师不提供此游戏服务',
          detail: `${repeatCustomer.coach.username} 暂时不接「${game?.name || '此游戏'}」的订单，请选择其他游戏或其他陪玩师`,
        },
      });
      return;
    }

    const validation = validateRepeatBooking(repeatCustomer.coach.id, pendingOrder);
    if (!validation.valid) {
      setBookingError({
        coachId: repeatCustomer.coach.id,
        result: validation,
      });
      return;
    }

    setSelectedRepeatCoach(repeatCustomer);
    setRepeatLoading(true);
    setBookingError(null);
    setTimeout(() => {
      isSelectingRef.current = true;
      const order = createOrderFromRepeat(repeatCustomer.coach.id, gameSkill.id, pendingOrder);
      setRepeatLoading(false);
      navigate(`/orders/${order.id}`);
    }, 500);
  };

  if (!pendingOrder && !isSelectingRef.current) return null;
  const game = pendingOrder ? getGameById(pendingOrder.gameId) : undefined;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-neon/20" />
            <div className="absolute inset-0 rounded-full border-4 border-cyan-neon border-t-transparent animate-spin" />
            <Search size={32} className="absolute inset-0 m-auto text-cyan-neon" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-2">正在加载陪玩师...</h2>
          <p className="text-cyber-text-secondary">正在为你准备可选的陪玩师列表</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/order/create" className="inline-flex items-center gap-1 text-sm text-cyber-text-secondary hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> 修改需求
      </Link>

      <Card className="p-5 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-3xl">{game?.icon}</span>
            <div className="min-w-0">
              <div className="font-medium">{game?.name}</div>
              <div className="text-sm text-cyber-text-muted truncate">
                {pendingOrder.duration}小时 · {pendingOrder.startTime}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs text-cyber-text-muted">预算</div>
              <div className="font-display font-bold neon-text-magenta">¥{pendingOrder.budget}/小时</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStats(true)}
            >
              <BarChart3 size={16} /> 数据统计
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setMatches(generateMatches());
                  setLoading(false);
                }, 800);
              }}
            >
              <RefreshCw size={16} /> 刷新列表
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-yellow-400" />
        <h2 className="font-display font-bold text-xl">自由选择陪玩师</h2>
        <span className="text-sm text-cyber-text-muted">共 {matches.length} 位 · 已按匹配度优先排序</span>
      </div>

      <div className="mb-4">
        <div className="flex gap-2 p-1 rounded-lg bg-cyber-bg-primary/40 border border-white/5">
          <button
            onClick={() => setActiveTab('all')}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all inline-flex items-center justify-center gap-2',
              activeTab === 'all'
                ? 'bg-cyan-neon text-black shadow-neon-cyan'
                : 'text-cyber-text-secondary hover:text-white'
            )}
          >
            <Users size={16} />
            全部陪玩师
          </button>
          <button
            onClick={() => setActiveTab('repeat')}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all inline-flex items-center justify-center gap-2 relative',
              activeTab === 'repeat'
                ? 'bg-fuchsia-500 text-white shadow-neon-magenta'
                : 'text-cyber-text-secondary hover:text-white'
            )}
          >
            <Heart size={16} className={cn(activeTab === 'repeat' && 'animate-pulse')} />
            老顾客
            {repeatCustomers.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-fuchsia-500 text-xs flex items-center justify-center text-white font-bold">
                {repeatCustomers.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyber-text-muted" />
            <input
              type="text"
              placeholder="搜索陪玩师昵称..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-lg input-dark text-sm"
            />
          </div>

          <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Filter size={14} className="text-cyber-text-muted" />
              <span className="text-xs text-cyber-text-secondary">筛选:</span>
            </div>

            <button
              onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs transition-all inline-flex items-center gap-1.5',
                showOnlineOnly
                  ? 'bg-green-500/15 border border-green-400/50 text-green-400'
                  : 'bg-cyber-bg-primary/40 border border-white/10 text-cyber-text-secondary hover:border-white/30'
              )}
            >
              <Wifi size={12} />
              仅在线
            </button>

            <div className="flex items-center gap-2">
              <DollarSign size={12} className="text-cyber-text-muted" />
              <span className="text-xs text-cyber-text-secondary">≤ ¥{maxPrice}</span>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={maxPrice}
                onChange={e => setMaxPrice(parseInt(e.target.value))}
                className="w-20 accent-fuchsia-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 flex-wrap">
          <TrendingUp size={14} className="text-cyber-text-muted" />
          <span className="text-xs text-cyber-text-secondary">排序:</span>
          {[
            { key: 'match', label: '匹配度优先', icon: Sparkles },
            { key: 'rating', label: '评分最高', icon: Star },
            { key: 'price_asc', label: '价格最低', icon: DollarSign },
            { key: 'price_desc', label: '价格最高', icon: DollarSign },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key as SortKey)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs transition-all inline-flex items-center gap-1.5',
                sortBy === opt.key
                  ? 'bg-cyan-neon/15 border border-cyan-neon/50 text-cyan-neon'
                  : 'bg-cyber-bg-primary/40 border border-white/10 text-cyber-text-secondary hover:border-white/30'
              )}
            >
              <opt.icon size={12} />
              {opt.label}
            </button>
          ))}
        </div>
      </Card>

      {activeTab === 'repeat' ? (
        <>
          {filteredRepeatCustomers.length === 0 ? (
            <Card className="p-8 text-center">
              <Heart size={48} className="mx-auto text-fuchsia-500/50 mb-4" />
              <h3 className="font-display font-bold text-lg mb-2">暂无老顾客</h3>
              <p className="text-cyber-text-secondary mb-4">
                {repeatCustomers.length === 0
                  ? '你还没有完成过订单，完成订单后陪玩师会出现在这里'
                  : '当前筛选条件下没有符合的老顾客，试试调整筛选条件'}
              </p>
              {repeatCustomers.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery('');
                    setShowOnlineOnly(false);
                    setMaxPrice(200);
                  }}
                >
                  重置筛选
                </Button>
              )}
              {repeatCustomers.length === 0 && (
                <Button variant="primary" onClick={() => setActiveTab('all')}>
                  去选择新陪玩师
                </Button>
              )}
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-cyber-text-muted">找到 {filteredRepeatCustomers.length} 位老顾客</p>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/30 text-xs text-fuchsia-400">
                  <Heart size={12} />
                  老顾客专属
                </span>
              </div>
              <div className="space-y-4">
                {filteredRepeatCustomers.map((rc, index) => {
                  const gameSkill = rc.skills.find(s => s.gameId === pendingOrder?.gameId);
                  const lastGame = rc.lastOrder ? getGameById(rc.lastOrder.gameId) : null;
                  const showError = bookingError && bookingError.coachId === rc.coach.id;
                  const ErrorIcon = showError && bookingError.result.reason ? getFailureIcon(bookingError.result.reason) : AlertTriangle;
                  return (
                    <Card
                      key={rc.coach.id}
                      className={cn(
                        'overflow-hidden animate-fade-in-up transition-all',
                        showError ? 'border-red-500/50' : 'border-fuchsia-500/30'
                      )}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        boxShadow: showError
                          ? '0 0 25px rgba(239, 68, 68, 0.15)'
                          : '0 0 20px rgba(217, 70, 239, 0.1)'
                      }}
                    >
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <img
                                src={rc.coach.avatar}
                                alt={rc.coach.username}
                                className="w-16 h-16 rounded-xl border-2 border-fuchsia-500/50"
                                style={{ boxShadow: rc.coach.isOnline ? '0 0 15px rgba(217, 70, 239, 0.4)' : undefined }}
                              />
                              <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg">
                                <Heart size={14} className="text-white fill-white" />
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-display font-bold text-lg">{rc.coach.username}</h4>
                                  {rc.coach.isOnline && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-400/40 text-xs text-green-400">
                                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                      在线
                                    </span>
                                  )}
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/30 text-xs text-fuchsia-400">
                                    已下单 {rc.orderCount} 次
                                  </span>
                                </div>
                                <StarRating rating={rc.coach.rating} showValue size={14} />
                                <p className="text-xs text-cyber-text-muted mt-1">{rc.coach.reviewCount} 条评价</p>
                              </div>

                              {gameSkill && (
                                <div className="text-right flex-shrink-0">
                                  <div className="text-lg font-bold neon-text-magenta">
                                    ¥{gameSkill.pricePerHour}
                                    <span className="text-xs text-cyber-text-muted font-normal">/小时</span>
                                  </div>
                                  <p className="text-xs text-cyber-text-muted">{gameSkill.rankLevel}</p>
                                </div>
                              )}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-1.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300">
                                <Check size={10} /> 老顾客信赖
                              </span>
                              {rc.averageRating > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-yellow-500/10 border border-yellow-500/20 text-yellow-300">
                                  <Star size={10} /> 你的评价 {rc.averageRating}分
                                </span>
                              )}
                              {rc.lastOrder && lastGame && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-cyan-neon/10 border border-cyan-neon/20 text-cyan-300">
                                  <Clock size={10} /> 上次: {lastGame.icon} {lastGame.name}
                                </span>
                              )}
                            </div>

                            {rc.lastOrder && (
                              <div className="mt-3 text-xs text-cyber-text-muted">
                                上次一起玩: {rc.lastOrder.createdAt} · {rc.lastOrder.duration}小时 · 共¥{rc.lastOrder.totalPrice}
                              </div>
                            )}
                          </div>
                        </div>

                        {showError && !bookingError.result.valid && (
                          <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 animate-fade-in-up">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                                <ErrorIcon size={20} className="text-red-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <div className="font-medium text-red-400 flex items-center gap-2">
                                      <AlertTriangle size={14} />
                                      {bookingError.result.message || '预约失败'}
                                    </div>
                                    <p className="text-sm text-red-300/80 mt-1.5 leading-relaxed">
                                      {bookingError.result.detail || '请稍后重试或选择其他陪玩师'}
                                    </p>
                                  </div>
                                  <button
                                    onClick={closeBookingError}
                                    className="flex-shrink-0 p-1 rounded hover:bg-red-500/20 text-red-400/70 hover:text-red-400 transition-colors"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {bookingError.result.reason === 'coach_not_available_today' && (
                                    <Link to="/order/create">
                                      <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10 !py-1.5 !px-2.5 text-xs">
                                        <Calendar size={12} className="mr-1" /> 改约明天
                                      </Button>
                                    </Link>
                                  )}
                                  {bookingError.result.reason === 'time_conflict' && (
                                    <Link to="/order/create">
                                      <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10 !py-1.5 !px-2.5 text-xs">
                                        <ClockIcon size={12} className="mr-1" /> 换个时间
                                      </Button>
                                    </Link>
                                  )}
                                  {bookingError.result.reason === 'price_exceeds_budget' && (
                                    <Link to="/order/create">
                                      <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10 !py-1.5 !px-2.5 text-xs">
                                        <Wallet size={12} className="mr-1" /> 调整预算
                                      </Button>
                                    </Link>
                                  )}
                                  {(bookingError.result.reason === 'game_not_matched' || bookingError.result.reason === 'coach_not_found') && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-cyan-neon/30 text-cyan-neon hover:bg-cyan-neon/10 !py-1.5 !px-2.5 text-xs"
                                      onClick={() => setActiveTab('all')}
                                    >
                                      <Users size={12} className="mr-1" /> 选其他陪玩师
                                    </Button>
                                  )}
                                  {bookingError.result.reason === 'start_time_passed' && (
                                    <Link to="/order/create">
                                      <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10 !py-1.5 !px-2.5 text-xs">
                                        <ClockIcon size={12} className="mr-1" /> 重新选时间
                                      </Button>
                                    </Link>
                                  )}
                                  {bookingError.result.reason === 'duration_invalid' && (
                                    <Link to="/order/create">
                                      <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10 !py-1.5 !px-2.5 text-xs">
                                        <Clock size={12} className="mr-1" /> 调整时长
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-white/5 flex gap-3">
                          <Link
                            to={`/coaches/${rc.coach.id}`}
                            className="flex-1"
                          >
                            <Button variant="outline" size="sm" className="w-full">
                              查看详情 <ChevronRight size={16} />
                            </Button>
                          </Link>
                          {gameSkill ? (
                            <Button
                              variant="primary"
                              size="sm"
                              className={cn(
                                'flex-1',
                                showError
                                  ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
                                  : 'bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600'
                              )}
                              onClick={() => handleRepeatSelect(rc)}
                              disabled={repeatLoading && selectedRepeatCoach?.coach.id === rc.coach.id}
                            >
                              {repeatLoading && selectedRepeatCoach?.coach.id === rc.coach.id ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              ) : (
                                showError ? (
                                  <AlertTriangle size={16} className="mr-1" />
                                ) : (
                                  <Heart size={16} className="mr-1" />
                                )
                              )}
                              {repeatLoading && selectedRepeatCoach?.coach.id === rc.coach.id
                                ? '预约中...'
                                : showError
                                ? '重新预约'
                                : '再次预约'
                              }
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-1"
                              disabled
                            >
                              暂无此游戏服务
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {filteredAndSortedMatches.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-cyber-text-secondary mb-4">暂无符合条件的陪玩师</p>
              <div className="flex gap-3 justify-center">
                <Link to="/order/create">
                  <Button variant="outline">修改搜索条件</Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery('');
                    setShowOnlineOnly(false);
                    setMaxPrice(200);
                  }}
                >
                  重置筛选
                </Button>
              </div>
            </Card>
          ) : (
            <>
              <p className="text-sm text-cyber-text-muted mb-4">找到 {filteredAndSortedMatches.length} 位陪玩师</p>
              <div className="space-y-4">
                {filteredAndSortedMatches.map((match, index) => (
                  <MatchCard
                    key={match.coach.id}
                    match={match}
                    index={sortBy === 'match' ? index : -1}
                    onSelect={() => handleSelect(match.coach.id, match.skill.id)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {showStats && (
        <StatsDashboard
          stats={platformStats}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  );
}
