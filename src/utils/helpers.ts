import type { OrderStatus } from '../types';

export const formatDate = (dateStr: string): string => {
  return dateStr;
};

export const statusText: Record<OrderStatus, string> = {
  pending_payment: '待支付',
  paid: '已支付',
  in_progress: '进行中',
  completed: '已完成',
  cancelled: '已取消',
};

export const statusColor: Record<OrderStatus, string> = {
  pending_payment: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  paid: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  in_progress: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
  completed: 'text-green-400 border-green-400/30 bg-green-400/10',
  cancelled: 'text-gray-400 border-gray-400/30 bg-gray-400/10',
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
};

export const calculateMatchScore = (
  coachRating: number,
  coachOnline: boolean,
  pricePerHour: number,
  budget: number
): { score: number; reasons: string[] } => {
  let score = 0;
  const reasons: string[] = [];

  const ratingScore = (coachRating / 5) * 40;
  score += ratingScore;
  if (coachRating >= 4.8) reasons.push('超高评分');

  if (coachOnline) {
    score += 25;
    reasons.push('当前在线');
  } else {
    score += 10;
    reasons.push('需预约');
  }

  if (budget > 0) {
    const priceDiff = budget - pricePerHour;
    if (priceDiff >= 0) {
      const priceScore = Math.min(35, 20 + (priceDiff / budget) * 15);
      score += priceScore;
      reasons.push('价格符合预算');
    } else {
      score += Math.max(0, 15 - Math.abs(priceDiff / budget) * 20);
      reasons.push('价格略高于预算');
    }
  } else {
    score += 20;
  }

  return { score: Math.round(Math.min(100, score)), reasons };
};
