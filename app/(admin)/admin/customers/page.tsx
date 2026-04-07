import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function CustomersPage() {
  return (<div><div className="flex justify-between items-center mb-8"><h1 className="font-heading text-3xl font-bold">Customers</h1><Button>Add Customer</Button></div><Card><CardContent className="p-8 text-center text-muted-foreground">Customer management view</CardContent></Card></div>);
}
