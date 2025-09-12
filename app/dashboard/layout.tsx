import { ReactNode } from "react";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return (
      <div className="p-8">
        <p>You must be an admin to access the dashboard.</p>
        <Link className="underline" href="/sign-in">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r p-6 space-y-4">
        <div className="font-semibold">Admin</div>
        <nav className="space-y-2">
          <Link className="block hover:underline" href="/dashboard">Overview</Link>
          <Link className="block hover:underline" href="/dashboard/products">Products</Link>
          <Link className="block hover:underline" href="/dashboard/home">Homepage</Link>
        </nav>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}

