'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlusCircle, MoreHorizontal, User, Shield, Edit, Trash2 } from 'lucide-react';
import type { User } from '@/lib/types';
import { UserForm, type UserFormValues } from './UserForm';
import { upsertUser, deleteUser } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';


export function UserManagement({ initialUsers }: { initialUsers: User[] }) {
  const { toast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPending, startTransition] = useTransition();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);


  const handleAdd = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };
  
  const handleDeleteConfirm = (user: User) => {
    setUserToDelete(user);
  };

  const handleDelete = () => {
    if (!userToDelete) return;
    
    startTransition(async () => {
      const result = await deleteUser(userToDelete.id);
      if (result.success) {
        setUsers(users.filter(u => u.id !== userToDelete.id));
        toast({ title: 'Success', description: 'User has been deleted.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
      setUserToDelete(null);
    });
  };

  const handleFormSubmit = async (values: UserFormValues) => {
    let result: { user?: User; error?: string } = {};
    
    startTransition(async () => {
        result = await upsertUser({ ...values, id: selectedUser?.id });
        if (result.user) {
            if (selectedUser) {
                // Update
                setUsers(users.map(u => u.id === result.user!.id ? result.user! : u));
            } else {
                // Create
                setUsers([...users, result.user]);
            }
            toast({ title: 'Success', description: `User ${selectedUser ? 'updated' : 'created'} successfully.` });
        }
    })

    // This needs to be outside the transition to return the error message to the form
    await new Promise(resolve => setTimeout(resolve, 0)); 
    const finalResult = await upsertUser({ ...values, id: selectedUser?.id });
    return { error: finalResult.error };

  };

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all registered users on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                      {user.role === 'admin' ? <Shield className="mr-1.5 h-3 w-3" /> : <User className="mr-1.5 h-3 w-3" />}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteConfirm(user)} className="text-destructive">
                           <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{users.length}</strong> of <strong>{users.length}</strong> users.
          </div>
        </CardFooter>
      </Card>
      
      <UserForm
        user={selectedUser}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onFormSubmit={handleFormSubmit}
      />
      
      {userToDelete && (
        <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the user account
                    for <span className="font-semibold">{userToDelete.name}</span>.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                    {isPending ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}

    </>
  );
}