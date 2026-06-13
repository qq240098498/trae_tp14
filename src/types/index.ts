export type UserRole = 'player' | 'coach';

export interface User {
  id: string;
  role: UserRole;
  username: string;
  avatar: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  bio: string;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  createdAt: string;
}

export interface CoachSkill {
  id: string;
  userId: string;
  gameId: string;
  rankLevel: string;
  pricePerHour: number;
  description: string;
}

export interface Game {
  id: string;
  name: string;
  icon: string;
  category: string;
}

export type OrderStatus = 'pending_payment' | 'paid' | 'in_progress' | 'completed' | 'cancelled' | 'refunding' | 'refunded';

export interface Order {
  id: string;
  playerId: string;
  coachId: string;
  gameId: string;
  duration: number;
  startTime: string;
  requirements: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  refundReason?: string;
  refundRequestedAt?: string;
  refundDecidedAt?: string;
  previousStatus?: OrderStatus;
}

export interface Review {
  id: string;
  orderId: string;
  fromUserId: string;
  toUserId: string;
  overallRating: number;
  skillRating: number;
  serviceRating: number;
  attitudeRating: number;
  content: string;
  tags: string[];
  createdAt: string;
}

export interface MatchResult {
  coach: User;
  skill: CoachSkill;
  matchScore: number;
  matchReasons: string[];
}

export interface RepeatCustomer {
  coach: User;
  skills: CoachSkill[];
  orderCount: number;
  lastOrder: Order | null;
  averageRating: number;
}

export interface CreateOrderData {
  gameId: string;
  duration: number;
  startTime: string;
  requirements: string;
  budget: number;
  voiceRequired: boolean;
}

export type BookingFailureReason =
  | 'coach_not_found'
  | 'skill_not_found'
  | 'game_not_matched'
  | 'coach_not_available_today'
  | 'start_time_passed'
  | 'time_conflict'
  | 'price_exceeds_budget'
  | 'duration_invalid'
  | 'unknown';

export interface BookingValidationResult {
  valid: boolean;
  reason?: BookingFailureReason;
  message?: string;
  detail?: string;
}
