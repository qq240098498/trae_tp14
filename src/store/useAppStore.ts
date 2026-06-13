import { create } from 'zustand';
import type { User, CoachSkill, Game, Order, Review, CreateOrderData, MatchResult, OrderStatus, RepeatCustomer } from '../types';
import { games, initialUsers, initialCoachSkills, initialOrders, initialReviews } from '../data/mockData';
import { generateId, calculateMatchScore } from '../utils/helpers';

interface AppState {
  users: User[];
  coachSkills: CoachSkill[];
  games: Game[];
  orders: Order[];
  reviews: Review[];
  currentUserId: string | null;
  pendingOrderData: CreateOrderData | null;
  matchResults: MatchResult[];

  getCurrentUser: () => User | null;
  getCoaches: () => User[];
  getCoachById: (id: string) => User | undefined;
  getCoachSkills: (coachId: string) => CoachSkill[];
  getGameById: (id: string) => Game | undefined;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByPlayer: (playerId: string) => Order[];
  getReviewsForCoach: (coachId: string) => Review[];
  getRepeatCustomers: () => RepeatCustomer[];
  createOrderFromRepeat: (coachId: string, skillId: string, orderData: CreateOrderData) => Order;

  registerPlayer: (data: Partial<User>) => void;
  registerCoach: (data: Partial<User>, skills: Omit<CoachSkill, 'id' | 'userId'>[]) => void;
  login: (userId: string) => void;
  logout: () => void;

  setPendingOrder: (data: CreateOrderData) => void;
  generateMatches: () => MatchResult[];
  createOrder: (coachId: string, skillId: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  requestRefund: (orderId: string, reason: string) => boolean;
  approveRefund: (orderId: string) => void;
  rejectRefund: (orderId: string) => void;

  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  users: initialUsers,
  coachSkills: initialCoachSkills,
  games,
  orders: initialOrders,
  reviews: initialReviews,
  currentUserId: 'p1',
  pendingOrderData: null,
  matchResults: [],

  getCurrentUser: () => {
    const { currentUserId, users } = get();
    return currentUserId ? users.find(u => u.id === currentUserId) || null : null;
  },
  getCoaches: () => get().users.filter(u => u.role === 'coach'),
  getCoachById: (id) => get().users.find(u => u.id === id && u.role === 'coach'),
  getCoachSkills: (coachId) => get().coachSkills.filter(s => s.userId === coachId),
  getGameById: (id) => get().games.find(g => g.id === id),
  getOrderById: (id) => get().orders.find(o => o.id === id),
  getOrdersByPlayer: (playerId) => get().orders.filter(o => o.playerId === playerId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  getReviewsForCoach: (coachId) => get().reviews.filter(r => r.toUserId === coachId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

  getRepeatCustomers: () => {
    const { currentUserId, orders, users, coachSkills, reviews } = get();
    if (!currentUserId) return [];

    const playerOrders = orders.filter(o => o.playerId === currentUserId && o.status === 'completed');
    const coachIdMap = new Map<string, Order[]>();

    playerOrders.forEach(order => {
      if (!coachIdMap.has(order.coachId)) {
        coachIdMap.set(order.coachId, []);
      }
      coachIdMap.get(order.coachId)!.push(order);
    });

    const repeatCustomers: RepeatCustomer[] = [];
    coachIdMap.forEach((coachOrders, coachId) => {
      const coach = users.find(u => u.id === coachId && u.role === 'coach');
      if (!coach) return;

      const skills = coachSkills.filter(s => s.userId === coachId);
      const coachReviews = reviews.filter(r => r.toUserId === coachId && r.fromUserId === currentUserId);
      const avgRating = coachReviews.length > 0
        ? coachReviews.reduce((sum, r) => sum + r.overallRating, 0) / coachReviews.length
        : 0;

      const sortedOrders = [...coachOrders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

      repeatCustomers.push({
        coach,
        skills,
        orderCount: coachOrders.length,
        lastOrder: sortedOrders[0] || null,
        averageRating: Math.round(avgRating * 100) / 100,
      });
    });

    repeatCustomers.sort((a, b) => b.orderCount - a.orderCount);
    return repeatCustomers;
  },

  createOrderFromRepeat: (coachId, skillId, orderData) => {
    const { currentUserId, coachSkills } = get();
    const skill = coachSkills.find(s => s.id === skillId);
    if (!skill) throw new Error('Skill not found');

    const newOrder: Order = {
      id: generateId(),
      playerId: currentUserId!,
      coachId,
      gameId: orderData.gameId,
      duration: orderData.duration,
      startTime: orderData.startTime,
      requirements: orderData.requirements,
      totalPrice: skill.pricePerHour * orderData.duration,
      status: 'pending_payment',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    set(state => ({
      orders: [...state.orders, newOrder],
      pendingOrderData: null,
      matchResults: [],
    }));

    return newOrder;
  },

  registerPlayer: (data) => {
    const newUser: User = {
      id: generateId(),
      role: 'player',
      username: data.username || '新玩家',
      avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${generateId()}`,
      gender: data.gender || 'male',
      age: data.age || 20,
      bio: data.bio || '',
      rating: 5,
      reviewCount: 0,
      isOnline: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    set(state => ({ users: [...state.users, newUser], currentUserId: newUser.id }));
  },
  registerCoach: (data, skills) => {
    const newCoach: User = {
      id: generateId(),
      role: 'coach',
      username: data.username || '新陪玩',
      avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${generateId()}`,
      gender: data.gender || 'male',
      age: data.age || 22,
      bio: data.bio || '',
      rating: 5,
      reviewCount: 0,
      isOnline: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const newSkills: CoachSkill[] = skills.map(s => ({
      ...s,
      id: generateId(),
      userId: newCoach.id,
    }));
    set(state => ({
      users: [...state.users, newCoach],
      coachSkills: [...state.coachSkills, ...newSkills],
      currentUserId: newCoach.id,
    }));
  },
  login: (userId) => set({ currentUserId: userId }),
  logout: () => set({ currentUserId: null }),

  setPendingOrder: (data) => set({ pendingOrderData: data }),
  generateMatches: () => {
    const { pendingOrderData, coachSkills, users } = get();
    if (!pendingOrderData) return [];

    const relevantSkills = coachSkills.filter(s => s.gameId === pendingOrderData.gameId);
    const results: MatchResult[] = relevantSkills.map(skill => {
      const coach = users.find(u => u.id === skill.userId)!;
      const { score, reasons } = calculateMatchScore(
        coach.rating,
        coach.isOnline,
        skill.pricePerHour,
        pendingOrderData.budget
      );
      return { coach, skill, matchScore: score, matchReasons: reasons };
    });

    results.sort((a, b) => b.matchScore - a.matchScore);
    set({ matchResults: results });
    return results;
  },
  createOrder: (coachId, skillId) => {
    const { pendingOrderData, currentUserId, coachSkills } = get();
    const skill = coachSkills.find(s => s.id === skillId)!;
    const newOrder: Order = {
      id: generateId(),
      playerId: currentUserId!,
      coachId,
      gameId: pendingOrderData!.gameId,
      duration: pendingOrderData!.duration,
      startTime: pendingOrderData!.startTime,
      requirements: pendingOrderData!.requirements,
      totalPrice: skill.pricePerHour * pendingOrderData!.duration,
      status: 'pending_payment',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    set(state => ({
      orders: [...state.orders, newOrder],
      pendingOrderData: null,
      matchResults: [],
    }));
    return newOrder;
  },
  updateOrderStatus: (orderId, status) => {
    set(state => ({
      orders: state.orders.map(o => (o.id === orderId ? { ...o, status } : o)),
    }));
  },
  requestRefund: (orderId, reason) => {
    const { orders } = get();
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;
    if (order.status !== 'paid' && order.status !== 'in_progress') return false;

    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');

    if (order.status === 'paid') {
      set(state => ({
        orders: state.orders.map(o => (o.id === orderId ? {
          ...o,
          status: 'refunded',
          refundReason: reason,
          refundRequestedAt: now,
          refundDecidedAt: now,
          previousStatus: order.status,
        } : o)),
      }));
      return true;
    } else {
      set(state => ({
        orders: state.orders.map(o => (o.id === orderId ? {
          ...o,
          status: 'refunding',
          refundReason: reason,
          refundRequestedAt: now,
          previousStatus: order.status,
        } : o)),
      }));
      return true;
    }
  },
  approveRefund: (orderId) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    set(state => ({
      orders: state.orders.map(o => (o.id === orderId ? {
        ...o,
        status: 'refunded',
        refundDecidedAt: now,
      } : o)),
    }));
  },
  rejectRefund: (orderId) => {
    set(state => ({
      orders: state.orders.map(o => (o.id === orderId && o.status === 'refunding' ? {
        ...o,
        status: o.previousStatus || 'in_progress',
        refundReason: undefined,
        refundRequestedAt: undefined,
        previousStatus: undefined,
      } : o)),
    }));
  },
  addReview: (review) => {
    const newReview: Review = {
      ...review,
      id: generateId(),
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    set(state => {
      const targetUser = state.users.find(u => u.id === review.toUserId);
      const updatedUsers = targetUser
        ? state.users.map(u => {
            if (u.id === review.toUserId) {
              const newReviewCount = u.reviewCount + 1;
              const newRating = (u.rating * u.reviewCount + review.overallRating) / newReviewCount;
              return { ...u, rating: Math.round(newRating * 100) / 100, reviewCount: newReviewCount };
            }
            return u;
          })
        : state.users;
      return { reviews: [...state.reviews, newReview], users: updatedUsers };
    });
  },
}));
