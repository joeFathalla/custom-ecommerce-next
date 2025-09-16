/* eslint-disable no-console */
const { PrismaClient } = require("../lib/generated/prisma");

const prisma = new PrismaClient();

async function main() {
	// 1) Categories
	const categories = [
		{ name: "Electronics", slug: "electronics" },
		{ name: "Apparel", slug: "apparel" },
		{ name: "Home & Living", slug: "home-living" },
	];

	for (const category of categories) {
		await prisma.category.upsert({
			where: { slug: category.slug },
			update: { name: category.name },
			create: { name: category.name, slug: category.slug },
		});
	}

	// 2) Products
	const products = [
		{
			title: "Wireless Headphones",
			slug: "wireless-headphones",
			description: "Noise-cancelling over-ear headphones with 40h battery life.",
			priceCents: 12999,
			images: ["/next.svg", "/globe.svg"],
			featured: true,
			categorySlug: "electronics",
		},
		{
			title: "Smart Desk Lamp",
			slug: "smart-desk-lamp",
			description: "LED lamp with adjustable color temperature and app control.",
			priceCents: 4999,
			images: ["/window.svg"],
			featured: false,
			categorySlug: "home-living",
		},
		{
			title: "Performance T‑Shirt",
			slug: "performance-tshirt",
			description: "Breathable, moisture‑wicking fabric for everyday comfort.",
			priceCents: 2599,
			images: ["/vercel.svg"],
			featured: true,
			categorySlug: "apparel",
		},
		{
			title: "4K Action Camera",
			slug: "4k-action-camera",
			description: "Waterproof action cam with image stabilization.",
			priceCents: 19999,
			images: ["/file.svg"],
			featured: false,
			categorySlug: "electronics",
		},
	];

	const createdProducts = [];
	for (const product of products) {
		const created = await prisma.product.upsert({
			where: { slug: product.slug },
			update: {
				title: product.title,
				description: product.description,
				priceCents: product.priceCents,
				images: product.images,
				featured: Boolean(product.featured),
				category: product.categorySlug
					? { connect: { slug: product.categorySlug } }
					: undefined,
			},
			create: {
				title: product.title,
				slug: product.slug,
				description: product.description,
				priceCents: product.priceCents,
				images: product.images,
				featured: Boolean(product.featured),
				category: product.categorySlug
					? { connect: { slug: product.categorySlug } }
					: undefined,
			},
		});
		createdProducts.push(created);
	}

	// 3) Store settings
	const featuredProductIds = createdProducts
		.filter((p) => p.featured)
		.map((p) => p.id);

	const existingSetting = await prisma.storeSetting.findFirst();
	if (!existingSetting) {
		await prisma.storeSetting.create({
			data: {
				heroTitle: "Welcome to Our Store",
				heroSubtitle: "Discover products you will love",
				heroImageUrl: "/globe.svg",
				banners: ["/vercel.svg", "/window.svg"],
				featuredProductIds,
				themePrimaryColor: "#0ea5e9",
			},
		});
	} else {
		await prisma.storeSetting.update({
			where: { id: existingSetting.id },
			data: { featuredProductIds },
		});
	}

	console.log("✅ Database seeded successfully");
}

main()
	.catch((err) => {
		console.error("❌ Seeding failed:", err);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

