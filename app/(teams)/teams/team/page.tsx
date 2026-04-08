import { db } from "@/lib/db";
import { employees } from "@/lib/db/schema/scheduling";
import { asc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function TeamDirectoryPage() {
  const allEmployees = await db
    .select({
      id: employees.id,
      name: employees.name,
      role: employees.role,
      department: employees.department,
      presence: employees.presence,
    })
    .from(employees)
    .orderBy(asc(employees.name))
    .limit(50);

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-8">Team Directory</h1>
      <Card>
        <CardHeader><CardTitle>Team Members</CardTitle></CardHeader>
        <CardContent>
          {allEmployees.length === 0 ? (
            <p className="text-muted-foreground">No team members found</p>
          ) : (
            <div className="space-y-3">
              {allEmployees.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-sm text-muted-foreground">{emp.role}{emp.department ? ` · ${emp.department}` : ""}</p>
                  </div>
                  <Badge variant={emp.presence === "online" ? "default" : "secondary"}>
                    {emp.presence || "offline"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
