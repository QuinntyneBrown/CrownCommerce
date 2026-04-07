import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function CampaignsPage() {
  return (<div><div className="flex justify-between items-center mb-8"><h1 className="font-heading text-3xl font-bold">Campaigns</h1><Button>Create Campaign</Button></div><Card><CardContent className="p-8 text-center text-muted-foreground">Campaign management view</CardContent></Card></div>);
}
