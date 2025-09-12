import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button asChild>
          <Link href="/dashboard/products/new">New Product</Link>
        </Button>
      </div>
      <div className="grid gap-3">
        {products.map((p) => (
          <div key={p.id} className="border rounded-md p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-muted-foreground">${(p.priceCents / 100).toFixed(2)}</div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="secondary"><Link href={`/dashboard/products/${p.id}`}>Edit</Link></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

