import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ProductDetail({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findFirst({ where: { slug: params.slug } });
  if (!product) return notFound();
  
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link 
            href="/products" 
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg border border-border overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20" />
              {product.featured && (
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 text-sm rounded">
                  Featured
                </div>
              )}
            </div>
            
            {/* Additional product images placeholder */}
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className="aspect-square bg-muted rounded border border-border"
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.title}</h1>
              <div className="text-2xl font-semibold text-primary">
                ${(product.priceCents / 100).toFixed(2)}
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="font-medium text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Actions */}
            <div className="space-y-4">
              <Button className="w-full h-12 text-base">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              
              <Button variant="outline" className="w-full h-12 text-base">
                Add to Wishlist
              </Button>
            </div>

            {/* Product Info */}
            <div className="border-t border-border pt-6 space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Product Details</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>SKU: {product.id.slice(-8).toUpperCase()}</div>
                  <div>Category: {product.categoryId || 'Uncategorized'}</div>
                  <div>Added: {new Date(product.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">Shipping & Returns</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Free shipping on orders over $50</div>
                  <div>30-day return policy</div>
                  <div>Ships within 1-2 business days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

