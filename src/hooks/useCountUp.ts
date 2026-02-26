import { useState, useEffect, useRef } from "react";

export function useCountUp(
  target: number,
  shouldStart: boolean,
  duration: number = 2000,
  prefix: string = "",
  suffix: string = ""
) {
  const [value, setValue] = useState(0);
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);
  const frameRef = useRef<number>(undefined);

  useEffect(() => {
    if (!shouldStart) return;

    const startTime = performance.now();
    const startValue = 0;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (target - startValue) * eased);

      setValue(current);
      setDisplay(`${prefix}${current.toLocaleString()}${suffix}`);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    }

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [shouldStart, target, duration, prefix, suffix]);

  return { value, display };
}
