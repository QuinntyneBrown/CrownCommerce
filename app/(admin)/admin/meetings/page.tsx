import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function MeetingsPage() {
  return (<div><div className="flex justify-between items-center mb-8"><h1 className="font-heading text-3xl font-bold">Meetings</h1><Button>Schedule Meeting</Button></div><Card><CardContent className="p-8 text-center text-muted-foreground">Meeting management view</CardContent></Card></div>);
}
