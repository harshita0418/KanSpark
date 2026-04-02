'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getToken } from '@/lib/api';

const publicPaths = ['/login', '/signup', '/'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = getToken();

  useEffect(() => {
    const isPublicPath = publicPaths.includes(pathname);
    
    if (!token && !isPublicPath) {
      router.push('/login');
    } else if (token && isPublicPath) {
      router.push('/workspace');
    }
  }, [pathname, token, router]);

  if (!token && !publicPaths.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}