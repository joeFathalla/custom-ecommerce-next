import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

async function createProduct(formData: FormData) {
  "use server";
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const priceCents = Math.round(Number(formData.get("price")) * 100);
  const description = String(formData.get("description") || "").trim() || null;
  const customizable = String(formData.get("customizable") || "") === "on";
  const optionsJsonRaw = String(formData.get("optionsJson") || "").trim();
  let optionsJson: unknown | null = null;
  if (customizable && optionsJsonRaw) {
    try {
      optionsJson = JSON.parse(optionsJsonRaw);
    } catch {
      optionsJson = null;
    }
  const files = formData.getAll("images").filter(Boolean) as File[];

  const allowedTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ]);
  const maxFileSizeBytes = 5 * 1024 * 1024; // 5MB per file

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const savedImagePaths: string[] = [];
  for (const file of files) {
    if (!allowedTypes.has(file.type)) {
      continue;
    }
    if (file.size > maxFileSizeBytes) {
      continue;
    }
    const fileArrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(fileArrayBuffer);
    const ext = mimeToExtension(file.type) ?? safeExtFromName(file.name) ?? "";
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
    const destPath = path.join(uploadsDir, uniqueName);
    await fs.writeFile(destPath, fileBuffer);
    savedImagePaths.push(`/uploads/${uniqueName}`);
  }

  await prisma.product.create({
    data: {
      title,
      slug,
      priceCents,
      description,
      images: [],
      customizable,
      optionsJson: optionsJson as any,
      images: savedImagePaths,
    },
  });
  revalidatePath("/dashboard/products");
  revalidatePath("/products");
}

function mimeToExtension(mimeType: string): string | null {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "image/svg+xml":
      return ".svg";
    default:
      return null;
  }
}

function safeExtFromName(name: string): string | null {
  const ext = path.extname(name).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(ext)) {
    return ext === ".jpeg" ? ".jpg" : ext;
  }
  return null;
}

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New Product</h1>
      <form action={createProduct} className="space-y-4 max-w-lg" encType="multipart/form-data">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input id="price" name="price" type="number" step="0.01" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={4} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input id="customizable" name="customizable" type="checkbox" />
            <Label htmlFor="customizable">Customizable product</Label>
          </div>
          <div className="text-xs text-muted-foreground">
            When enabled, provide an options JSON describing selectable attributes and price adjustments.
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="optionsJson">Options JSON</Label>
          <Textarea id="optionsJson" name="optionsJson" rows={10} placeholder={`{\n  "options": [\n    {\n      "id": "size",\n      "label": "Size",\n      "type": "select",\n      "required": true,\n      "choices": [\n        { "value": "S", "label": "Small", "priceDeltaCents": 0 },\n        { "value": "M", "label": "Medium", "priceDeltaCents": 200 },\n        { "value": "L", "label": "Large", "priceDeltaCents": 400 }\n      ]\n    },\n    {\n      "id": "engraving",\n      "label": "Engraving (max 20 chars)",\n      "type": "text",\n      "maxLength": 20,\n      "priceDeltaCents": 500\n    }\n  ]\n}`} />
          <div className="text-xs text-muted-foreground">
            Supported types: "select" with {`{ value, label, priceDeltaCents }`} choices, and "text" with optional {`maxLength`} and {`priceDeltaCents`} applied when not empty.
          </div>
      <Label htmlFor="images">Images</Label>
          <Input id="images" name="images" type="file" multiple accept="image/*" />
          <p className="text-xs text-muted-foreground">JPEG, PNG, WEBP, GIF, SVG. Max 5MB each.</p>
        </div>
        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}

