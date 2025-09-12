import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

async function saveSettings(formData: FormData) {
  "use server";
  const heroTitle = String(formData.get("heroTitle") || "").trim() || null;
  const heroSubtitle = String(formData.get("heroSubtitle") || "").trim() || null;
  const heroImageUrl = String(formData.get("heroImageUrl") || "").trim() || null;
  const featuredSlugsRaw = String(formData.get("featuredSlugs") || "").trim();
  const featuredSlugs = featuredSlugsRaw
    ? featuredSlugsRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const featuredProducts = await prisma.product.findMany({
    where: { slug: { in: featuredSlugs } },
    select: { id: true },
  });

  await prisma.storeSetting.upsert({
    where: { id: (await prisma.storeSetting.findFirst()?.then(s => s?.id)) || "000000000000000000000000" },
    create: {
      heroTitle,
      heroSubtitle,
      heroImageUrl,
      featuredProductIds: featuredProducts.map((p) => p.id),
      banners: [],
    },
    update: {
      heroTitle,
      heroSubtitle,
      heroImageUrl,
      featuredProductIds: featuredProducts.map((p) => p.id),
    },
  });

  revalidatePath("/");
}

export default async function HomeCustomizationPage() {
  const settings = await prisma.storeSetting.findFirst();

  const featuredSlugs = settings
    ? (
        await prisma.product.findMany({
          where: { id: { in: settings.featuredProductIds } },
          select: { slug: true },
        })
      ).map((p) => p.slug)
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Homepage</h1>
      <form action={saveSettings} className="space-y-4 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="heroTitle">Hero title</Label>
          <Input id="heroTitle" name="heroTitle" defaultValue={settings?.heroTitle ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="heroSubtitle">Hero subtitle</Label>
          <Textarea id="heroSubtitle" name="heroSubtitle" rows={3} defaultValue={settings?.heroSubtitle ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="heroImageUrl">Hero image URL</Label>
          <Input id="heroImageUrl" name="heroImageUrl" defaultValue={settings?.heroImageUrl ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="featuredSlugs">Featured product slugs (comma separated)</Label>
          <Input id="featuredSlugs" name="featuredSlugs" defaultValue={featuredSlugs.join(", ")} />
        </div>
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}

