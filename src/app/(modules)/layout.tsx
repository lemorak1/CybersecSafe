'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';
import { useAwareness } from '@/hooks/useAwareness';

function AwarenessScoreHeader() {
  const { score } = useAwareness();

  return (
    <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
      <ShieldCheck className="w-6 h-6 text-primary" />
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">Puntuación:</p>
        <span className="text-lg font-bold text-primary">{score}</span>
      </div>
    </div>
  );
}

export default function ModuleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Button variant="ghost" asChild className="font-semibold">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Laboratorio CyberSafe
              </Link>
            </Button>
            <AwarenessScoreHeader />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
    </div>
  );
}
