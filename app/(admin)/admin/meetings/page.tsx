import { db } from "@/lib/db";
import { meetings } from "@/lib/db/schema/scheduling";
import { desc } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function MeetingsPage() {
  const allMeetings = await db
    .select({
      id: meetings.id,
      title: meetings.title,
      date: meetings.date,
      startTime: meetings.startTime,
      endTime: meetings.endTime,
      location: meetings.location,
    })
    .from(meetings)
    .orderBy(desc(meetings.date))
    .limit(25);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl font-bold">Meetings</h1>
        <Button>Schedule Meeting</Button>
      </div>
      {allMeetings.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No meetings found</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Time</th>
                <th className="text-left p-4">Location</th>
              </tr></thead>
              <tbody>
                {allMeetings.map((m) => (
                  <tr key={m.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4 font-medium">{m.title}</td>
                    <td className="p-4">{m.date}</td>
                    <td className="p-4">{m.startTime} – {m.endTime}</td>
                    <td className="p-4">{m.location || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
