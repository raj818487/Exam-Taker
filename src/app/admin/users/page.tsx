import { UserManagement } from "@/components/admin/UserManagement";
import { getUsers } from "@/app/actions";

export default async function UsersPage() {
    const users = await getUsers();

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold font-headline tracking-tight">User Management</h1>
                <p className="text-muted-foreground mt-1">
                    Create, view, and manage all users on the platform.
                </p>
            </header>
            
            <UserManagement initialUsers={users} />
        </div>
    );
}