import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(initialSeconds) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef(null);

  const reset = useCallback((newSeconds) => {
    clearInterval(intervalRef.current);
    setSecondsLeft(newSeconds ?? initialSeconds);
    setIsRunning(false);
    setIsFinished(false);
  }, [initialSeconds]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);

  const toggle = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Reset when initialSeconds changes (new exercise)
  useEffect(() => {
    reset(initialSeconds);
  }, [initialSeconds]);

  const formatted = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;

  return { secondsLeft, formatted, isRunning, isFinished, toggle, reset, start, pause };
}
