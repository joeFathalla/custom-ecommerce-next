"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart } from "lucide-react";

type Choice = {
  value: string;
  label: string;
  priceDeltaCents?: number;
};

type OptionDef = {
  id: string;
  label: string;
  type: "select" | "text";
  required?: boolean;
  choices?: Choice[];
  maxLength?: number;
  priceDeltaCents?: number; // applies when text is non-empty
};

type OptionsSchema = {
  options: OptionDef[];
};

export default function ProductConfigurator({
  basePriceCents,
  optionsJson,
  productId,
  productTitle,
}: {
  basePriceCents: number;
  optionsJson: OptionsSchema | null;
  productId: string;
  productTitle: string;
}) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const options: OptionDef[] = Array.isArray(optionsJson?.options)
    ? (optionsJson?.options as OptionDef[])
    : [];

  const priceCents = useMemo(() => {
    let total = basePriceCents;
    for (const option of options) {
      if (option.type === "select") {
        const val = selections[option.id];
        if (!val) continue;
        const choice = option.choices?.find((c) => c.value === val);
        if (choice?.priceDeltaCents) {
          total += choice.priceDeltaCents;
        }
      } else if (option.type === "text") {
        const text = selections[option.id] ?? "";
        if (text.length > 0 && option.priceDeltaCents) {
          total += option.priceDeltaCents;
        }
      }
    }
    return total;
  }, [basePriceCents, options, selections]);

  function updateSelection(optionId: string, value: string) {
    setSelections((prev) => ({ ...prev, [optionId]: value }));
  }

  function addToCart() {
    try {
      const cartRaw = localStorage.getItem("cart_v1");
      const cart: any[] = cartRaw ? JSON.parse(cartRaw) : [];
      cart.push({
        productId,
        productTitle,
        basePriceCents,
        priceCents,
        selections,
        quantity: 1,
        addedAt: new Date().toISOString(),
      });
      localStorage.setItem("cart_v1", JSON.stringify(cart));
      alert("Added to cart");
    } catch {
      // no-op
    }
  }

  const isValid = useMemo(() => {
    for (const opt of options) {
      if (opt.required) {
        if (!selections[opt.id] || selections[opt.id].length === 0) return false;
      }
      if (opt.type === "text" && typeof opt.maxLength === "number") {
        if ((selections[opt.id] ?? "").length > opt.maxLength) return false;
      }
    }
    return true;
  }, [options, selections]);

  return (
    <div className="space-y-4">
      {options.map((opt) => (
        <div key={opt.id} className="space-y-2">
          <Label htmlFor={`opt_${opt.id}`}>
            {opt.label}
            {opt.required ? " *" : ""}
          </Label>
          {opt.type === "select" ? (
            <Select
              value={selections[opt.id] ?? ""}
              onValueChange={(v) => updateSelection(opt.id, v)}
            >
              <SelectTrigger id={`opt_${opt.id}`} className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {opt.choices?.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                    {typeof c.priceDeltaCents === "number" && c.priceDeltaCents !== 0
                      ? ` (+$${(c.priceDeltaCents / 100).toFixed(2)})`
                      : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id={`opt_${opt.id}`}
              value={selections[opt.id] ?? ""}
              onChange={(e) => updateSelection(opt.id, e.target.value)}
              maxLength={opt.maxLength}
              placeholder="Enter text"
            />
          )}
        </div>
      ))}

      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">
          ${ (priceCents / 100).toFixed(2) }
        </div>
        <Button className="h-12 text-base" disabled={!isValid} onClick={addToCart}>
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

