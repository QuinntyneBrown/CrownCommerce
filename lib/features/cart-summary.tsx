"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

interface CartSummaryProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export function CartSummary({ items, onRemove, onCheckout }: CartSummaryProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopping Cart ({items.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Your cart is empty</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="font-medium text-sm">{item.productName}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
      {items.length > 0 && (
        <CardFooter className="flex flex-col gap-4">
          <div className="flex justify-between w-full text-lg font-bold">
            <span>Total</span>
            <span className="text-accent">${total.toFixed(2)}</span>
          </div>
          <Button onClick={onCheckout} className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
