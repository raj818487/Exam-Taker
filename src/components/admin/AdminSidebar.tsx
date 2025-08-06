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
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/quizzes/new', label: 'Create Quiz', icon: PlusCircle },
    { href: '#', label: 'All Quizzes', icon: FileText },
    { href: '#', label: 'Users', icon: Users },
    { href: '#', label: 'Settings', icon: Settings },
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
                isActive={pathname === item.href}
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
      <SidebarFooter>
         <Button asChild variant="outline" className="w-full">
            <Link href="/">Back to Site</Link>
         </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
