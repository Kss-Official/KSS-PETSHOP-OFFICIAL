/**
 * flyAnimation.ts
 * Clean helper - flying transitions across screen disabled per user preference
 */

export interface FlyToCartOptions {
  startX?: number;
  startY?: number;
  icon?: 'heart' | 'bag' | 'sparkle';
  color?: string;
  onComplete?: () => void;
}

export const triggerFlyToCart = (_options?: FlyToCartOptions) => {
  if (_options?.onComplete) {
    _options.onComplete();
  }
};
