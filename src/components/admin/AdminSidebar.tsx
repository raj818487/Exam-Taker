'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  PlusCircle,
  BookHeart,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('userName');
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
    }
    router.push('/login');
    router.refresh();
  };

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/quizzes/new', label: 'Create Quiz', icon: PlusCircle },
    { href: '/admin/quizzes', label: 'All Quizzes', icon: FileText },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <BookHeart className="w-6 h-6 text-primary" />
          <h1 className="text-lg font-semibold font-headline">QuizMaster Pro</h1>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                className="w-full justify-start"
              >
                <Link href={item.href}>
                  <item.icon className="w-4 h-4 mr-2" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex-col gap-2 items-start">
         <div className='p-2 w-full'>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
                <Avatar>
                    <AvatarImage src={`https://placehold.co/40x40.png`} alt={userName || 'Admin'} data-ai-hint="user avatar" />
                    <AvatarFallback>{userName?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-sidebar-accent-foreground">{userName || 'Admin'}</span>
                    <span className="text-xs text-muted-foreground">Administrator</span>
                </div>
            </div>
         </div>
         <div className='p-2 w-full space-y-2'>
            <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/"><ChevronLeft /> Back to Site</Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                <LogOut /> Logout
            </Button>
         </div>
      </SidebarFooter>
    </Sidebar>
  );
}
