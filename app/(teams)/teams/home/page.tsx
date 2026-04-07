import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function TeamsHomePage() {
  return (<div><h1 className="font-heading text-3xl font-bold mb-8">Welcome to Teams</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card><CardHeader><CardTitle>Recent Messages</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">No new messages</p></CardContent></Card>
      <Card><CardHeader><CardTitle>Upcoming Meetings</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">No upcoming meetings</p></CardContent></Card>
    </div>
  </div>);
}
