import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/origins", label: "Origins" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/campaigns", label: "Campaigns" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/content-pages", label: "Pages" },
  { href: "/admin/hero-content", label: "Hero" },
  { href: "/admin/trust-bar", label: "Trust Bar" },
  { href: "/admin/employees", label: "Employees" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/schedule", label: "Schedule" },
  { href: "/admin/meetings", label: "Meetings" },
  { href: "/admin/conversations", label: "Conversations" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-border bg-card p-4 hidden md:block overflow-y-auto">
        <Link href="/admin/dashboard" className="font-heading text-lg font-bold text-accent block mb-6">
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
