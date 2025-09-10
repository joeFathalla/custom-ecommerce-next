import { prisma } from "@/lib/prisma";

export default async function DashboardHome() {
  const [productCount, categoryCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-md p-4">
          <div className="text-sm text-muted-foreground">Products</div>
          <div className="text-2xl font-bold">{productCount}</div>
        </div>
        <div className="border rounded-md p-4">
          <div className="text-sm text-muted-foreground">Categories</div>
          <div className="text-2xl font-bold">{categoryCount}</div>
        </div>
      </div>
    </div>
  );
}

