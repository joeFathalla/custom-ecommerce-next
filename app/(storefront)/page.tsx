export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {
  const settings = await prisma.storeSetting.findFirst();
  const featuredProducts = settings?.featuredProductIds?.length
    ? await prisma.product.findMany({ where: { id: { in: settings.featuredProductIds } }, take: 8 })
    : await prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 8 });

  return (
    <div>
      <section className="bg-secondary">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-semibold">{settings?.heroTitle ?? "Elevate Your Wardrobe"}</h1>
            <p className="text-muted-foreground">{settings?.heroSubtitle ?? "Curated fashion staples and statement pieces."}</p>
            <div className="pt-2">
              <Link href="/products" className="inline-flex items-center underline underline-offset-4">Shop collection</Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-md overflow-hidden border bg-card">
            {settings?.heroImageUrl ? (
              <Image src={settings.heroImageUrl} alt="Hero" fill className="object-cover" />
            ) : null}
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-xl font-semibold mb-4">Featured</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`} className="group border rounded-md overflow-hidden">
              <div className="aspect-square bg-muted" />
              <div className="p-3">
                <div className="font-medium group-hover:underline">{p.title}</div>
                <div className="text-sm text-muted-foreground">${(p.priceCents / 100).toFixed(2)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

