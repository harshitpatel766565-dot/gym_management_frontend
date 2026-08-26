import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Flame, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-forge-950 flex items-center justify-center p-6 text-center text-forge-100">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-red to-brand-orange flex items-center justify-center mx-auto shadow-lg shadow-brand-red/30">
          <Flame className="w-9 h-9 text-white fill-white" />
        </div>

        <div>
          <span className="text-6xl font-black font-heading text-brand-orange">404</span>
          <h2 className="text-2xl font-bold font-heading text-white uppercase mt-2">
            Page Not In The Playbook
          </h2>
          <p className="text-xs text-forge-400 mt-2">
            The page you are looking for might have been moved, removed, or never existed.
          </p>
        </div>

        <div className="flex justify-center gap-4 pt-2">
          <Link href="/">
            <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Return Home
            </Button>
          </Link>
          <Link href="/programs">
            <Button variant="outline" size="md">
              View Programs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
