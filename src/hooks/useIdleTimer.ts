import { useState, useEffect, useRef } from 'react';

export const useIdleTimer = (timeout: number, onIdle: () => void) => {
  const [isIdle, setIsIdle] = useState(false);
  const timer = useRef<number | null>(null);

  const resetTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setIsIdle(false);
    timer.current = window.setTimeout(() => {
      setIsIdle(true);
      onIdle();
    }, timeout);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

    const handleEvent = () => {
      resetTimer();
    };

    events.forEach(event => {
      window.addEventListener(event, handleEvent);
    });

    resetTimer();

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleEvent);
      });
    };
  }, [timeout, onIdle]);

  return isIdle;
};
