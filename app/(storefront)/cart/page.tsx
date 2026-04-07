"use client";

import { useState } from "react";
import { CartSummary } from "@/lib/features/cart-summary";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<{ id: string; productId: string; productName: string; price: number; quantity: number }[]>([]);

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="font-heading text-3xl font-bold mb-8">Your Cart</h1>
      <CartSummary items={items} onRemove={handleRemove} onCheckout={handleCheckout} />
    </div>
  );
}
