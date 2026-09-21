import { useState, useRef, useEffect, useCallback } from 'react';

interface TiltState {
  rotateX: number;
  rotateY: number;
  sheenX: number;
  sheenY: number;
  isHovered: boolean;
}

interface UseTiltOptions {
  maxTilt?: number; // max tilt in degrees (default 6)
  sheen?: boolean;
}

export function useTilt<T extends HTMLElement = HTMLDivElement>(options: UseTiltOptions = {}) {
  const { maxTilt = 6, sheen = true } = options;
  const ref = useRef<T | null>(null);
  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    sheenX: 50,
    sheenY: 50,
    isHovered: false,
  });
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      if (isTouchDevice || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normalizedX = (x / rect.width) * 2 - 1; // -1 to 1
      const normalizedY = (y / rect.height) * 2 - 1; // -1 to 1

      const rotateY = normalizedX * maxTilt;
      const rotateX = -normalizedY * maxTilt;
      const sheenX = (x / rect.width) * 100;
      const sheenY = (y / rect.height) * 100;

      setTilt({
        rotateX,
        rotateY,
        sheenX,
        sheenY,
        isHovered: true,
      });
    },
    [isTouchDevice, maxTilt]
  );

  const handleMouseEnter = useCallback(() => {
    if (isTouchDevice) return;
    setTilt((prev) => ({ ...prev, isHovered: true }));
  }, [isTouchDevice]);

  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice) return;
    setTilt({
      rotateX: 0,
      rotateY: 0,
      sheenX: 50,
      sheenY: 50,
      isHovered: false,
    });
  }, [isTouchDevice]);

  return {
    ref,
    tilt,
    isTouchDevice,
    tiltProps: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
    sheenStyle:
      sheen && tilt.isHovered && !isTouchDevice
        ? {
            background: `radial-gradient(circle 180px at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(255, 255, 255, 0.28), transparent 70%)`,
          }
        : undefined,
    cardTransform:
      !isTouchDevice && tilt.isHovered
        ? `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) translateY(-8px)`
        : !isTouchDevice
        ? 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)'
        : undefined,
  };
}
