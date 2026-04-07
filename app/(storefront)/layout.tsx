import Link from "next/link";
import { getBrand } from "@/lib/theme";
import { ChatContainer } from "@/lib/features/chat-container";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brand = await getBrand();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading text-xl font-bold text-accent">
            {brand.name}
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/shop" className="hover:text-accent transition-colors">Shop</Link>
            <Link href="/bundles" className="hover:text-accent transition-colors">Bundles</Link>
            <Link href="/closures" className="hover:text-accent transition-colors">Closures</Link>
            <Link href="/frontals" className="hover:text-accent transition-colors">Frontals</Link>
            <Link href="/bundle-deals" className="hover:text-accent transition-colors">Deals</Link>
            <Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/cart" className="hover:text-accent transition-colors text-sm">Cart</Link>
            <Link href="/login" className="hover:text-accent transition-colors text-sm">Login</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-heading font-bold text-lg mb-4">{brand.name}</h3>
              <p className="text-sm text-muted-foreground">{brand.tagline}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/bundles" className="hover:text-accent">Bundles</Link></li>
                <li><Link href="/closures" className="hover:text-accent">Closures</Link></li>
                <li><Link href="/frontals" className="hover:text-accent">Frontals</Link></li>
                <li><Link href="/bundle-deals" className="hover:text-accent">Bundle Deals</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/contact" className="hover:text-accent">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-accent">FAQ</Link></li>
                <li><Link href="/shipping" className="hover:text-accent">Shipping</Link></li>
                <li><Link href="/returns" className="hover:text-accent">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-accent">About</Link></li>
                <li><Link href="/wholesale" className="hover:text-accent">Wholesale</Link></li>
                <li><Link href="/ambassador" className="hover:text-accent">Ambassador</Link></li>
                <li><Link href="/privacy" className="hover:text-accent">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
          </div>
        </div>
      </footer>

      <ChatContainer />
    </div>
  );
}
