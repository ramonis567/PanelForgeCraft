import { useEffect, useRef } from "react";

export function useAutoSave<T>(value: T, onSave: (v: T) => void, delay = 500) {
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onSave(value), delay);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [value, onSave, delay]);
}