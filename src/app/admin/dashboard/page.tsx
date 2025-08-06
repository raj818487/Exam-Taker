import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Users, CheckCircle, BarChart } from "lucide-react";

const stats = [
    { title: "Total Quizzes", value: "12", icon: FileText, change: "+2 this month" },
    { title: "Total Submissions", value: "1,204", icon: Users, change: "+150 this week" },
    { title: "Average Score", value: "78%", icon: CheckCircle, change: "-2% vs last month" },
    { title: "Highest Participation", value: "General Knowledge", icon: BarChart, change: "250 submissions" },
];

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold font-headline tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back, Admin! Here's a summary of your quiz platform.</p>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="transition-all hover:shadow-md hover:-translate-y-0.5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

             <div className="grid gap-4 lg:grid-cols-2">
                 <Card>
                     <CardHeader>
                         <CardTitle>Recent Activity</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-muted-foreground">Recent activity feed will be displayed here.</p>
                     </CardContent>
                 </Card>
                 <Card>
                     <CardHeader>
                         <CardTitle>Quiz Performance</CardTitle>
                     </CardHeader>
                     <CardContent>
                         <p className="text-muted-foreground">Quiz performance charts will be displayed here.</p>
                     </CardContent>
                 </Card>
            </div>
        </div>
    );
}
