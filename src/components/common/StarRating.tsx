import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  showValue?: boolean;
}

export default function StarRating({
  rating,
  max = 5,
  size = 16,
  interactive = false,
  onChange,
  showValue = false,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const filled = rating >= i + 1;
          const half = !filled && rating >= i + 0.5;
          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(i + 1)}
              className={cn(
                'relative transition-transform',
                interactive && 'hover:scale-125 cursor-pointer'
              )}
            >
              <Star
                size={size}
                className={cn(
                  filled || half
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-600'
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-yellow-400 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
