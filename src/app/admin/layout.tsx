'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { Header } from '@/components/Header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      router.replace('/login?error=unauthorized_admin');
    } else {
      setIsAuth(true);
    }
    setLoading(false);
  }, [router]);

  if (loading || !isAuth) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Card>
            <CardContent className="p-8 flex flex-col items-center gap-4">
                 <Loader className="w-8 h-8 animate-spin text-primary" />
                 <p className="text-muted-foreground">Authenticating...</p>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
