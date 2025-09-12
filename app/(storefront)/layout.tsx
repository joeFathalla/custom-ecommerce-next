import Link from "next/link";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg">Fashion Store</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/products" className="hover:underline">Shop</Link>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-muted-foreground">© {new Date().getFullYear()} Fashion Store</div>
      </footer>
    </div>
  );
}

