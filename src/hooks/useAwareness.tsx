'use client';

import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react';

type AwarenessContextType = {
  score: number;
  addScore: (points: number) => void;
  resetScore: () => void;
};

const AwarenessContext = createContext<AwarenessContextType | undefined>(undefined);

export const AwarenessProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState(0);

  const addScore = useCallback((points: number) => {
    setScore((prevScore) => prevScore + points);
  }, []);
  
  const resetScore = useCallback(() => {
    setScore(0);
  }, []);

  const value = useMemo(
    () => ({ score, addScore, resetScore }),
    [score, addScore, resetScore]
  );

  return (
    <AwarenessContext.Provider value={value}>
      {children}
    </AwarenessContext.Provider>
  );
};

export const useAwareness = () => {
  const context = useContext(AwarenessContext);
  if (context === undefined) {
    throw new Error('useAwareness must be used within an AwarenessProvider');
  }
  return context;
};
