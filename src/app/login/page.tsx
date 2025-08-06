'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, LogIn } from "lucide-react";
import { authenticateUser } from '../actions';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { formState: { errors, isSubmitting }, setError } = form;

  const handleLogin = async (data: LoginFormValues) => {
    const user = await authenticateUser(data.email, data.password);

    if (user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userName', user.name);
      }
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } else {
       setError('root', { type: 'manual', message: 'Invalid email or password.' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">Login to QuizMaster Pro</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(handleLogin)}>
            <CardContent className="space-y-4">
            {error && (
                <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                    {error === 'unauthorized_admin' && 'You must be logged in as an administrator to view that page.'}
                    {error === 'unauthorized_user' && 'You must be logged in to view that page.'}
                </AlertDescription>
                </Alert>
            )}
             {errors.root && (
                <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>
                    {errors.root.message}
                </AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="admin@example.com" {...form.register('email')} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="password" {...form.register('password')} />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <LogIn className="mr-2 h-4 w-4" /> {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{' '}
                <Link href="/register" className="underline">
                  Register
                </Link>
              </div>
              <p className="text-xs text-center text-muted-foreground w-full">
                  Hint: Use <code className="font-mono p-1 bg-muted rounded">admin@example.com</code> or <code className="font-mono p-1 bg-muted rounded">user@example.com</code> with password <code className="font-mono p-1 bg-muted rounded">password</code>.
              </p>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
