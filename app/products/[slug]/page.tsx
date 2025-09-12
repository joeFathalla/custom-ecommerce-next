import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProductDetail({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findFirst({ where: { slug: params.slug } });
  if (!product) return notFound();
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8">
      <div className="aspect-square bg-muted rounded-md border" />
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <div className="text-xl">${(product.priceCents / 100).toFixed(2)}</div>
        {product.description ? (
          <p className="text-muted-foreground">{product.description}</p>
        ) : null}
        <form action="#" className="space-y-2">
          <button className="inline-flex items-center px-4 py-2 rounded-md border">Add to cart</button>
        </form>
      </div>
    </div>
  );
}

