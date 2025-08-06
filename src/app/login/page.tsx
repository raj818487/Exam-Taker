'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from "lucide-react"

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleLogin = (role: 'admin' | 'user') => {
    // In a real app, you'd have a proper authentication flow.
    // Here, we're simulating it with localStorage.
    if (typeof window !== 'undefined') {
        localStorage.setItem('userRole', role);
    }
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">Login to QuizMaster Pro</CardTitle>
          <CardDescription>Select your role to proceed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error === 'unauthorized_admin' && (
            <Alert variant="destructive">
               <Terminal className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                You must be logged in as an administrator to view that page.
              </AlertDescription>
            </Alert>
          )}
           {error === 'unauthorized_user' && (
            <Alert variant="destructive">
               <Terminal className="h-4 w-4" />
              <AlertTitle>Login Required</AlertTitle>
              <AlertDescription>
                You must be logged in to view that page.
              </AlertDescription>
            </Alert>
          )}
          <Button className="w-full" onClick={() => handleLogin('admin')}>
            <Shield className="mr-2 h-4 w-4" /> Login as Administrator
          </Button>
          <Button className="w-full" variant="outline" onClick={() => handleLogin('user')}>
            <User className="mr-2 h-4 w-4" /> Login as User
          </Button>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-center text-muted-foreground w-full">This is a simulated login. No credentials are required.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
