import { useRef } from "react";
import { useInView } from "framer-motion";

export function useScrollReveal(options?: { once?: boolean; margin?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    margin: (options?.margin ?? "-100px") as `${number}px`,
    amount: options?.amount,
  });

  return { ref, isInView };
}
