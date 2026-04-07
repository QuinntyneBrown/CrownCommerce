import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function TrustBarPage() {
  return (<div><div className="flex justify-between items-center mb-8"><h1 className="font-heading text-3xl font-bold">Trust Bar</h1><Button>Add Item</Button></div><Card><CardContent className="p-8 text-center text-muted-foreground">Trust bar management</CardContent></Card></div>);
}
