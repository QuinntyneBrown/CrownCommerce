# Shopping Cart & Checkout — Detailed Design

## 1. Overview

Cart and checkout flows are mutation-heavy, correctness-sensitive, and easy to get wrong if request payloads are trusted too early. The design must protect price integrity, make checkout idempotent, and keep read/write boundaries explicit.

| Requirement | Summary |
|---|---|
| **L2-005** | Cart management |
| **L2-006** | Checkout flow |
| **L2-007** | Payment lifecycle |

## 2. Five-Pass Audit Summary

| Pass | Problem Found | Design Correction |
|---|---|---|
| **1. Cart identity** | The current shape leans on `userId` query parameters. | Cart ownership should be derived from session or a cart cookie, not trusted query strings. |
| **2. Price integrity** | The old design risked trusting client-supplied totals and order payloads. | The server recomputes totals, validates products, and snapshots `unitPrice` at checkout. |
| **3. Transaction safety** | Order, item, and payment writes were not framed as one logical transaction. | Checkout creates order, order items, and payment intent/status inside one service transaction. |
| **4. Idempotency** | Retry behavior was not addressed. | Checkout requires an idempotency key to avoid duplicate order creation on retries. |
| **5. Boundary choice** | The design overused generic REST handlers for first-party flows. | First-party UI may use Server Actions where appropriate; Route Handlers remain the public API boundary for browser/API consumers. |

## 3. Target Architecture

### 3.1 Cart Model

Primary files:

- [`lib/db/schema/orders.ts`](C:/projects/CrownCommerce/lib/db/schema/orders.ts)
- [`app/api/orders/cart/route.ts`](C:/projects/CrownCommerce/app/api/orders/cart/route.ts)
- [`app/api/orders/cart/items/route.ts`](C:/projects/CrownCommerce/app/api/orders/cart/items/route.ts)
- [`lib/features/cart-summary.tsx`](C:/projects/CrownCommerce/lib/features/cart-summary.tsx)

Rules:

- Anonymous users get a cart identifier via cookie; authenticated users may merge that cart into a user-linked cart.
- Cart reads must return enriched product snapshots needed for rendering, not only raw item rows.
- Product existence and salability are validated server-side before add/update operations.

### 3.2 Checkout Service

Target sequence:

```text
validate cart -> recompute totals -> create order -> create order_items -> create payment record -> clear/close cart
```

Rules:

- All checkout writes happen through one domain service.
- The service owns tax/shipping calculations once those features exist.
- `orders.order_items.unitPrice` is a mandatory snapshot of purchase-time pricing.
- Payment status transitions are explicit: `pending -> confirmed -> refunded`.

### 3.3 API and UI Boundary

- Cart interactions may be client-driven.
- Checkout submission is a good Server Action candidate for first-party UI.
- Public JSON endpoints remain valid for non-UI clients and automation, but they should delegate to the same domain service.

## 4. Performance & Code Quality Rules

- Never trust `total`, `amount`, or `unitPrice` from the client.
- Do not expose all orders or payments without auth, pagination, and filtering.
- Checkout retries must be idempotent.
- Use a transaction for order creation and related writes.
- Cart pages should not issue multiple duplicate product lookups per item.
- Payment processing side effects should be auditable and explicit; even an internal payment module needs clean state transitions.

## 5. Current Repo Gaps

- [`app/api/orders/cart/route.ts`](C:/projects/CrownCommerce/app/api/orders/cart/route.ts) reads cart data from a `userId` query parameter.
- [`app/api/orders/route.ts`](C:/projects/CrownCommerce/app/api/orders/route.ts) and [`app/api/payments/route.ts`](C:/projects/CrownCommerce/app/api/payments/route.ts) accept raw bodies and write directly to tables.
- No shared checkout transaction service is in place yet.
- Payment and order endpoints are not consistently protected or idempotent.

## 6. Key Decisions

1. Cart identity is a server concern, not a client-trusted query parameter.
2. Checkout correctness matters more than endpoint simplicity.
3. Order totals are derived on the server and written as immutable snapshots.
4. Route Handlers and Server Actions must share one checkout service so pricing and transaction logic cannot drift.
