'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-cyan-400">
          Vioneer
        </Link>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" className="text-foreground hover:text-cyan-400 hover:bg-white/5">
            <Link href="#features">Features</Link>
          </Button>
          <Button asChild variant="ghost" className="text-foreground hover:text-cyan-400">
            <Link href="#audit">Audit</Link>
          </Button>
          <Button asChild variant="ghost" className="text-foreground hover:text-cyan-400">
            <Link href="/demo">Test Demo</Link>
          </Button>
          <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-slate-950">
            <Link href="/audit">Start Audit</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
