import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold font-headline tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Configure application settings.
                </p>
            </header>
            
            <Card className="flex flex-col items-center justify-center h-96 border-2 border-dashed">
                 <CardContent className="text-center">
                   <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-spin-slow" />
                   <h2 className="text-2xl font-semibold">Settings Page Coming Soon</h2>
                   <p className="text-muted-foreground mt-2">This section is under construction.</p>
                </CardContent>
            </Card>
        </div>
    );
}
