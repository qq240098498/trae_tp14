import { create } from 'zustand';
import type { User, CoachSkill, Game, Order, Review, CreateOrderData, MatchResult, OrderStatus } from '../types';
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

  registerPlayer: (data: Partial<User>) => void;
  registerCoach: (data: Partial<User>, skills: Omit<CoachSkill, 'id' | 'userId'>[]) => void;
  login: (userId: string) => void;
  logout: () => void;

  setPendingOrder: (data: CreateOrderData) => void;
  generateMatches: () => MatchResult[];
  createOrder: (coachId: string, skillId: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

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
    const topResults = results.slice(0, 5);
    set({ matchResults: topResults });
    return topResults;
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
