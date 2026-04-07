import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/origins", label: "Origins" },
  { href: "/orders", label: "Orders" },
  { href: "/customers", label: "Customers" },
  { href: "/leads", label: "Leads" },
  { href: "/inquiries", label: "Inquiries" },
  { href: "/subscribers", label: "Subscribers" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faqs", label: "FAQs" },
  { href: "/gallery", label: "Gallery" },
  { href: "/content-pages", label: "Pages" },
  { href: "/hero-content", label: "Hero" },
  { href: "/trust-bar", label: "Trust Bar" },
  { href: "/employees", label: "Employees" },
  { href: "/users", label: "Users" },
  { href: "/schedule", label: "Schedule" },
  { href: "/meetings", label: "Meetings" },
  { href: "/conversations", label: "Conversations" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-border bg-card p-4 hidden md:block overflow-y-auto">
        <Link href="/dashboard" className="font-heading text-lg font-bold text-accent block mb-6">
          CrownCommerce Admin
        </Link>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
