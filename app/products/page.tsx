import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProductsIndexPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-6">Shop</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <Link key={p.id} href={`/products/${p.slug}`} className="group border rounded-md overflow-hidden">
            <div className="aspect-square bg-muted" />
            <div className="p-3">
              <div className="font-medium group-hover:underline">{p.title}</div>
              <div className="text-sm text-muted-foreground">${(p.priceCents / 100).toFixed(2)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

