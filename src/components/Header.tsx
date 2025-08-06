'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { BookHeart, LogIn, UserCircle, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole');
      const name = localStorage.getItem('userName');
      setUserRole(role);
      setUserName(name);
    }
  }, [pathname]); 

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
    }
    setUserRole(null);
    setUserName(null);
    router.push('/login');
    router.refresh();
  };

  const getDashboardLink = () => {
    if (userRole === 'admin') {
      return '/admin/dashboard';
    }
    if (userRole === 'user') {
      return '/dashboard';
    }
    return '/login';
  };

  if (pathname.startsWith('/admin') || pathname === '/login') {
    return null; 
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookHeart className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline">QuizMaster Pro</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Quizzes
          </Link>
          {userRole && (
             <Link
             href={getDashboardLink()}
             className="transition-colors hover:text-foreground/80 text-foreground/60"
           >
             Dashboard
           </Link>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
         {userRole ? (
           <>
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Welcome, {userName}</span>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
           </>
         ) : (
          <Button asChild>
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
         )}
        </div>
      </div>
    </header>
  );
}
