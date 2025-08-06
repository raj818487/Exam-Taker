import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function UsersPage() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold font-headline tracking-tight">User Management</h1>
                <p className="text-muted-foreground mt-1">
                    Manage platform users and their roles.
                </p>
            </header>
            
            <Card className="flex flex-col items-center justify-center h-96 border-2 border-dashed">
                <CardContent className="text-center">
                   <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                   <h2 className="text-2xl font-semibold">User Management Coming Soon</h2>
                   <p className="text-muted-foreground mt-2">This section is under construction.</p>
                </CardContent>
            </Card>
        </div>
    );
}
