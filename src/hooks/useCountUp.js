import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Animates a number from 0 to `end` once the element scrolls into view.
 * @param {number} end - target value
 * @param {object} opts - { duration = 1400ms, decimals = 0 }
 */
export function useCountUp(end, opts = {}) {
  const { duration = 1400, decimals = 0 } = opts;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let raf;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(end * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, end, duration]);

  const display =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();

  return { ref, display };
}
