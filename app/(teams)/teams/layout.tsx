import Link from "next/link";
import { requireTeamMember } from "@/lib/auth/guards";

export default async function TeamsLayout({ children }: { children: React.ReactNode }) {
  await requireTeamMember();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-border bg-card p-4 hidden md:block">
        <Link href="/home" className="font-heading text-lg font-bold text-accent block mb-6">Teams</Link>
        <nav className="space-y-1">
          <Link href="/home" className="block px-3 py-2 rounded-md text-sm hover:bg-muted">Home</Link>
          <Link href="/chat" className="block px-3 py-2 rounded-md text-sm hover:bg-muted">Chat</Link>
          <Link href="/meetings" className="block px-3 py-2 rounded-md text-sm hover:bg-muted">Meetings</Link>
          <Link href="/team" className="block px-3 py-2 rounded-md text-sm hover:bg-muted">Team</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
