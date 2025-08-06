
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, UserPlus } from "lucide-react";
import { upsertUser } from '../actions';
import Link from 'next/link';
import { useTransition } from 'react';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const { formState: { errors }, setError } = form;

  const handleRegister = async (data: RegisterFormValues) => {
    startTransition(async () => {
      const result = await upsertUser({ ...data, role: 'user' });
      if (result.user) {
        // Optionally log the user in directly
        // For now, redirect to login page with a success message
        router.push('/login?success=registered');
      } else {
        setError('root', { type: 'manual', message: result.error || 'An unexpected error occurred.' });
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">Create an Account</CardTitle>
          <CardDescription>Sign up to start taking quizzes.</CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(handleRegister)}>
            <CardContent className="space-y-4">
             {errors.root && (
                <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Registration Failed</AlertTitle>
                  <AlertDescription>
                      {errors.root.message}
                  </AlertDescription>
                </Alert>
            )}
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="John Doe" {...form.register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...form.register('email')} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" {...form.register('password')} />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isPending}>
                  <UserPlus className="mr-2 h-4 w-4" /> {isPending ? 'Registering...' : 'Register'}
              </Button>
               <div className="text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline">
                  Login
                </Link>
              </div>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
