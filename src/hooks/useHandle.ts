import { useCallback, useRef } from 'react';

export default function useHandle<T extends (...args: any[]) => any>(callback?: T) {
  const handle = useRef(callback);
  handle.current = callback;
  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    return handle.current?.(...args);
  }, []);
}
