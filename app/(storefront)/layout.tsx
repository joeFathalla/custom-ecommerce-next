export const dynamic = "force-dynamic";
import Link from "next/link";
import { SimpleThemeToggle } from "@/components/theme-toggle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg text-foreground hover:text-primary transition-colors">
            Fashion Store
          </Link>
          
          <nav className="flex items-center gap-6 text-sm">
            <Link 
              href="/products" 
              className="text-foreground hover:text-primary transition-colors"
            >
              Shop
            </Link>
            
            {session?.user?.role === "admin" && (
              <Link 
                href="/dashboard" 
                className="text-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            )}
            
            {!session && (
              <Link 
                href="/sign-in" 
                className="text-foreground hover:text-primary transition-colors"
              >
                Sign In
              </Link>
            )}
            
            <SimpleThemeToggle />
          </nav>
        </div>
      </header>
      
      <main className="flex-1 bg-background">
        {children}
      </main>
      
      <footer className="border-t bg-card/30">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Fashion Store</h3>
              <p className="text-sm text-muted-foreground">
                Curated fashion staples and statement pieces for your wardrobe.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <div><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">Shop All</Link></div>
                <div><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Featured</Link></div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Support</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Contact Us</span></div>
                <div><span className="text-muted-foreground">Size Guide</span></div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Fashion Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

