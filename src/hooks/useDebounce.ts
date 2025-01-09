import { useRef } from "react";

export function useDebounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number = 300
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // return debouncedFunction;
  return (...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
