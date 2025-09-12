import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProductsIndexPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-background">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-2">Shop</h1>
        <p className="text-muted-foreground">Discover our complete collection of fashion pieces</p>
      </div>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <Link 
              key={p.id} 
              href={`/products/${p.slug}`} 
              className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-200"
            >
              <div className="aspect-square bg-muted relative overflow-hidden">
                {/* Placeholder for product image */}
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {p.title}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">
                    ${(p.priceCents / 100).toFixed(2)}
                  </span>
                  {p.featured && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>
                {p.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {p.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-muted-foreground text-lg mb-2">No products available</div>
          <p className="text-sm text-muted-foreground">Check back later for new items.</p>
        </div>
      )}
    </div>
  );
}

