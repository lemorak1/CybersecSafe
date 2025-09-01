'use client';

import type { ReactNode } from 'react';
import { AwarenessProvider } from '@/hooks/useAwareness';

export function Providers({ children }: { children: ReactNode }) {
  return <AwarenessProvider>{children}</AwarenessProvider>;
}
