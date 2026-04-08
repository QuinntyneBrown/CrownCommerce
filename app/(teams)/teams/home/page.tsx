import { db } from "@/lib/db";
import { meetings, channels, channelMessages } from "@/lib/db/schema/scheduling";
import { desc, gte } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function TeamsHomePage() {
  const today = new Date().toISOString().split("T")[0];

  const [upcomingMeetings, recentMessages] = await Promise.all([
    db.select({
      id: meetings.id,
      title: meetings.title,
      date: meetings.date,
      startTime: meetings.startTime,
      location: meetings.location,
    })
    .from(meetings)
    .where(gte(meetings.date, today))
    .orderBy(meetings.date)
    .limit(5),

    db.select({
      id: channelMessages.id,
      content: channelMessages.content,
      createdAt: channelMessages.createdAt,
      channelId: channelMessages.channelId,
    })
    .from(channelMessages)
    .orderBy(desc(channelMessages.createdAt))
    .limit(5),
  ]);

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-8">Welcome to Teams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Upcoming Meetings</CardTitle></CardHeader>
          <CardContent>
            {upcomingMeetings.length === 0 ? (
              <p className="text-muted-foreground">No upcoming meetings</p>
            ) : (
              <div className="space-y-3">
                {upcomingMeetings.map((m) => (
                  <div key={m.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{m.title}</p>
                      <p className="text-xs text-muted-foreground">{m.date} at {m.startTime}</p>
                    </div>
                    {m.location && <Badge variant="secondary">{m.location}</Badge>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Messages</CardTitle></CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <p className="text-muted-foreground">No new messages</p>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className="text-sm">
                    <p className="truncate">{msg.content}</p>
                    <p className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
