"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default function AddToCartButton({
  productId,
  productTitle,
  basePriceCents,
}: {
  productId: string;
  productTitle: string;
  basePriceCents: number;
}) {
  function addToCart() {
    try {
      const cartRaw = localStorage.getItem("cart_v1");
      const cart: any[] = cartRaw ? JSON.parse(cartRaw) : [];
      cart.push({
        productId,
        productTitle,
        basePriceCents,
        priceCents: basePriceCents,
        selections: {},
        quantity: 1,
        addedAt: new Date().toISOString(),
      });
      localStorage.setItem("cart_v1", JSON.stringify(cart));
      alert("Added to cart");
    } catch {
      // ignore
    }
  }

  return (
    <Button className="w-full h-12 text-base" onClick={addToCart}>
      <ShoppingCart className="h-5 w-5 mr-2" />
      Add to Cart
    </Button>
  );
}

