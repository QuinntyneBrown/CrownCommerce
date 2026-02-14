# CrownCommerce — Financial Models Guide
## Models to Build, Monitor & Maintain for Origin Hair Collective & Mane Haus

---

# TABLE OF CONTENTS

1. [Unit Economics Model](#1-unit-economics-model)
2. [Cash Flow Forecast](#2-cash-flow-forecast)
3. [Revenue & Sales Model](#3-revenue--sales-model)
4. [Customer Acquisition Cost (CAC) Model](#4-customer-acquisition-cost-cac-model)
5. [Customer Lifetime Value (CLV) Model](#5-customer-lifetime-value-clv-model)
6. [Inventory & Landed Cost Model](#6-inventory--landed-cost-model)
7. [Pricing Model](#7-pricing-model)
8. [Break-Even Analysis](#8-break-even-analysis)
9. [Marketing ROI Model](#9-marketing-roi-model)
10. [Loyalty Program Financial Model](#10-loyalty-program-financial-model)
11. [Multi-Brand P&L Model](#11-multi-brand-pl-model)
12. [Scenario & Sensitivity Analysis](#12-scenario--sensitivity-analysis)
13. [Monitoring Cadence & Dashboard Design](#13-monitoring-cadence--dashboard-design)
14. [Tools & Implementation](#14-tools--implementation)

---

# 1. UNIT ECONOMICS MODEL

## Purpose

Understand the true profitability of every product sold, down to the individual SKU. This model answers: "How much money do we actually make on each bundle, wig, or clip-in we sell?"

## Key Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| **Revenue per Unit** | Selling price after discounts | Varies by SKU |
| **COGS per Unit** | Wholesale cost + landed cost + packaging | < 40% of retail (DTC) |
| **Gross Profit per Unit** | Revenue per Unit − COGS per Unit | > 60% DTC, > 40% wholesale |
| **Contribution Margin** | Gross Profit − Variable Costs (shipping, payment processing, returns) | > 45% DTC |
| **Fully Loaded Margin** | Contribution Margin − Allocated Fixed Costs | > 20% |

## Inputs to Track

- **Wholesale cost per SKU** (by origin: Cambodia, India, China)
- **Landed cost components:** freight, duties (0% HS 6703 / 15.5% HS 6704), brokerage, insurance
- **Packaging cost per unit:** boxes, tissue, stickers, care cards
- **Shipping cost per order:** average outbound shipping (DTC vs wholesale)
- **Payment processing fees:** Stripe/Square rates (typically 2.9% + $0.30)
- **Return rate by product category:** target < 5% for hair extensions
- **Discount/promotion absorption:** average discount depth per unit

## How to Monitor

| Frequency | Action |
|-----------|--------|
| **Weekly** | Review top 10 SKUs by volume — flag any with contribution margin below 35% |
| **Monthly** | Full SKU-level profitability report; compare actual COGS vs. model assumptions |
| **Quarterly** | Recalculate landed costs with current freight rates and exchange rates (CAD/USD) |
| **Per Shipment** | Log actual landed cost per shipment and compare to model estimate |

## Red Flags

- Contribution margin dropping below 35% on any high-volume SKU
- Actual COGS deviating more than 10% from model
- Return rate exceeding 8% on any product category
- Payment processing fees exceeding 3.5% of revenue

---

# 2. CASH FLOW FORECAST

## Purpose

Predict when money comes in and when it goes out. For an import business with 4-12 week lead times and upfront supplier payments, cash flow is the most critical survival metric.

## Model Structure

### Cash Inflows

| Source | Timing | Notes |
|--------|--------|-------|
| DTC sales revenue | Day of sale (net of processing delay) | Stripe payouts: T+2 business days |
| Wholesale invoices | Net 15 or Net 30 from invoice date | Track aging rigorously |
| Deposits / pre-orders | At time of order | Liability until fulfilled |

### Cash Outflows

| Category | Timing | Notes |
|----------|--------|-------|
| Supplier payments (inventory) | 30% deposit at order, 70% before shipment | Largest cash outflow; 4-12 weeks before revenue |
| Freight & logistics | At shipment / on arrival | Sea freight cheaper but ties up cash longer |
| Duties & brokerage | On customs clearance | 0% (HS 6703) or 15.5% (HS 6704) |
| Marketing spend | Monthly (ads), per campaign (influencers) | Budget: $1,500-$3,800/month |
| Platform costs | Monthly (SaaS, hosting, domains) | Relatively fixed |
| Consultant fees | Monthly retainer or per-batch | $300-$600/month early growth |
| Insurance | Monthly or annual | $1,200-$1,800/year |
| Packaging & supplies | Per order batch | Order in bulk to reduce cost |

### 13-Week Rolling Forecast

Build a week-by-week cash flow projection covering the next 13 weeks (one quarter). Each row is a week; columns are:

```
Week | Opening Balance | Cash In (DTC) | Cash In (Wholesale) | Cash In (Other)
     | Cash Out (Inventory) | Cash Out (Freight) | Cash Out (Marketing)
     | Cash Out (Operations) | Cash Out (Other) | Closing Balance
     | Cumulative Minimum Balance
```

## How to Monitor

| Frequency | Action |
|-----------|--------|
| **Weekly** | Update 13-week forecast with actuals; extend by one week |
| **Biweekly** | Review wholesale accounts receivable aging; follow up on overdue invoices |
| **Monthly** | Compare forecast vs. actuals for the prior month; adjust assumptions |
| **Before each inventory order** | Model the cash impact: when does the deposit go out, when will revenue come in? |

## Red Flags

- Closing balance projected to drop below 2 weeks of operating expenses
- Wholesale receivables aging past 45 days
- Cash conversion cycle (time from paying supplier to receiving customer payment) exceeding 90 days
- Inventory order requiring more than 60% of available cash

---

# 3. REVENUE & SALES MODEL

## Purpose

Forecast revenue by channel, brand, product category, and time period. This model drives all other financial projections and hiring/investment decisions.

## Revenue Channels

| Channel | Year 1 Mix | Year 2 Mix | Year 3 Mix | Avg. Margin |
|---------|-----------|-----------|-----------|------------|
| **DTC — Website (Origin Hair)** | 50% | 45% | 40% | 60-70% |
| **DTC — Website (Mane Haus)** | 0% | 10% | 15% | 60-70% |
| **DTC — Instagram/Social** | 20% | 15% | 10% | 55-65% |
| **Wholesale — Salons** | 25% | 25% | 25% | 40-50% |
| **Marketplace (Amazon/Etsy)** | 5% | 5% | 10% | 35-45% |

## Key Revenue Drivers

| Driver | Metric | How to Calculate |
|--------|--------|-----------------|
| **Website traffic** | Monthly unique visitors | Google Analytics |
| **Conversion rate** | Orders / Visitors | Target: 2-3% (DTC e-commerce) |
| **Average order value (AOV)** | Total Revenue / Total Orders | Target: $150-$250 |
| **Purchase frequency** | Orders per Customer per Year | Target: 1.5-2.5x |
| **Active customers** | Customers with purchase in last 12 months | Segment by brand |
| **New customer acquisition** | First-time buyers per month | Track by channel |
| **Repeat purchase rate** | Returning customers / Total customers | Target: 25% Y1 → 45% Y3 |

## Revenue Formula

```
Monthly Revenue = Active Customers × Purchase Frequency (monthly) × AOV
```

Or equivalently:

```
Monthly Revenue = Website Visitors × Conversion Rate × AOV
                + Wholesale Accounts × Avg Monthly Order × Wholesale AOV
                + Marketplace Units × Marketplace Avg Price
```

## Projections (from Business Plan)

| Period | Revenue Range | Net Profit Range |
|--------|--------------|-----------------|
| **Year 1** | $43,000 - $72,000 | $14,000 - $25,000 |
| **Year 2** | $125,000 - $234,000 | $56,000 - $102,000 |
| **Year 3** | $252,000 - $504,000 | $121,000 - $243,000 |

## How to Monitor

| Frequency | Action |
|-----------|--------|
| **Daily** | Track orders placed, revenue, and AOV |
| **Weekly** | Review revenue by channel; compare to weekly target |
| **Monthly** | Full revenue report: actual vs. forecast by channel, brand, and product category |
| **Quarterly** | Update annual forecast; recalibrate conversion rates and AOV assumptions |

## Red Flags

- Weekly revenue dropping 20%+ below forecast for 2+ consecutive weeks
- Conversion rate falling below 1.5%
- AOV declining more than 15% from baseline
- New customer acquisition stalling for 3+ consecutive weeks
- Single channel representing more than 70% of revenue (concentration risk)

---

# 4. CUSTOMER ACQUISITION COST (CAC) MODEL

## Purpose

Understand how much it costs to acquire each new customer, by channel. Ensures marketing spend is generating profitable growth.

## CAC by Channel

| Channel | Cost Components | Target CAC |
|---------|----------------|-----------|
| **Instagram Ads** | Ad spend + creative production | < $25 |
| **TikTok Ads** | Ad spend + content creation | < $20 |
| **Google Ads / SEO** | Ad spend + SEO tools | < $30 |
| **Influencer Marketing** | Product gifting + fees | < $15 (at scale) |
| **Referral Program** | Referral reward ($10 discount) + points cost | < $12 |
| **Organic Social** | Content creation time (labor) | < $5 |
| **Salon Outreach** | Samples + sales time | < $50 per account |

## Formulas

```
CAC (Channel) = Total Channel Spend / New Customers Acquired via Channel

Blended CAC = Total Marketing Spend / Total New Customers

CAC Payback Period = CAC / (AOV × Gross Margin)
```

## How to Monitor

| Frequency | Action |
|-----------|--------|
| **Weekly** | Review ad spend vs. conversions by platform (Meta, TikTok, Google) |
| **Biweekly** | Calculate rolling 14-day CAC by channel |
| **Monthly** | Full CAC analysis with blended rate; compare to CLV for LTV:CAC ratio |
| **Quarterly** | Audit attribution: are channels getting proper credit? Review multi-touch paths |

## Red Flags

- Blended CAC exceeding 30% of first-order AOV
- Any paid channel CAC exceeding $40 without clear CLV justification
- CAC payback period exceeding 90 days
- LTV:CAC ratio falling below 3:1
- Rising CAC trend over 3+ consecutive months without improved retention

---

# 5. CUSTOMER LIFETIME VALUE (CLV) MODEL

## Purpose

Quantify the total revenue and profit a customer generates over their entire relationship with the brand. This is the counterpart to CAC and the most important metric for long-term business health.

## CLV Formula

```
Simple CLV = AOV × Purchase Frequency (annual) × Customer Lifespan (years)

Gross Profit CLV = Simple CLV × Gross Margin %

Net CLV = Gross Profit CLV − Total Acquisition & Retention Costs
```

## CLV by Customer Segment

| Segment | AOV | Annual Frequency | Lifespan | Gross Margin | Estimated CLV |
|---------|-----|-----------------|----------|-------------|--------------|
| **Casual Buyer** | $120 | 1.2x | 1.5 yrs | 60% | $130 |
| **Regular Customer** | $175 | 2.5x | 3 yrs | 62% | $814 |
| **Loyal / Crown Rewards** | $220 | 3.5x | 4 yrs | 64% | $1,971 |
| **Wholesale Account** | $800 | 6x | 5+ yrs | 45% | $10,800+ |

## Cohort Analysis Structure

Track CLV by monthly acquisition cohort:

```
Cohort (Month) | Month 1 Rev | Month 3 Rev | Month 6 Rev | Month 12 Rev
               | Retention % | Retention % | Retention % | Retention %
Jan 2026       | $X          | $Y          | $Z          | $W
Feb 2026       | ...         | ...         | ...         | ...
```

## How to Monitor

| Frequency | Action |
|-----------|--------|
| **Monthly** | Update cohort analysis; calculate rolling 12-month CLV |
| **Monthly** | Calculate LTV:CAC ratio by acquisition channel |
| **Quarterly** | Segment CLV by customer tier, brand, and acquisition source |
| **Quarterly** | Compare predicted CLV vs. actual revenue per cohort |
| **Annually** | Recalculate lifespan assumptions and retention curves |

## Red Flags

- LTV:CAC ratio falling below 3:1 (healthy is 3:1 to 5:1)
- 90-day retention rate dropping below 20%
- CLV declining across consecutive cohorts (suggests product or service degradation)
- Wholesale account CLV declining (losing reorder volume)

---

# 6. INVENTORY & LANDED COST MODEL

## Purpose

Track the true cost of getting products from factory to warehouse, and optimize inventory levels to avoid stockouts and overstock.

## Landed Cost Components

| Component | Typical Range | Notes |
|-----------|--------------|-------|
| **FOB product cost** | $3 - $160/100g bundle | Varies dramatically by origin and quality |
| **International freight** | $2 - $15/kg (air), $0.50 - $3/kg (sea) | Sea is cheaper but 6-8 weeks vs 5-7 days |
| **Customs duties** | 0% (HS 6703 raw) or 15.5% (HS 6704 finished) | Cambodia duty-free via LDCT until 2029 |
| **Customs brokerage** | $50 - $150 per shipment | Flat fee per customs entry |
| **Insurance** | 0.5% - 1.5% of cargo value | Required for high-value shipments |
| **Domestic shipping to warehouse** | $20 - $80 per shipment | From port/airport to Mississauga |
| **Inspection / QC** | $50 - $100 per batch (if using consultant) | Critical for new suppliers |

## Landed Cost Formula

```
Landed Cost per Unit = FOB Cost
                     + (Freight Cost / Units in Shipment)
                     + (Duty Rate × FOB Cost)
                     + (Brokerage / Units in Shipment)
                     + (Insurance Rate × FOB Cost)
                     + (Domestic Transport / Units in Shipment)
                     + (QC Cost / Units in Shipment)
```

## Inventory Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| **Inventory Turnover** | COGS / Average Inventory Value | 6-8x per year |
| **Days of Inventory (DOI)** | (Avg Inventory / COGS) × 365 | 45-60 days |
| **Stockout Rate** | SKUs out of stock / Total active SKUs | < 5% |
| **Sell-Through Rate** | Units Sold / Units Received | > 80% within 90 days |
| **Dead Stock %** | Units unsold > 180 days / Total Inventory | < 10% |

## Reorder Point Model

```
Reorder Point = (Average Daily Sales × Lead Time in Days) + Safety Stock

Safety Stock = Z-score × Std Dev of Daily Demand × √Lead Time
```

For hair extensions with 4-12 week lead times, safety stock is critical. Use a Z-score of 1.65 (95% service level) for top sellers and 1.28 (90%) for slower movers.

## How to Monitor

| Frequency | Action |
|-----------|--------|
| **Weekly** | Check inventory levels vs. reorder points; flag SKUs approaching stockout |
| **Biweekly** | Review sell-through rates; identify slow movers for promotion |
| **Monthly** | Calculate landed cost per unit for each recent shipment; compare to model |
| **Monthly** | Review inventory turnover and DOI; adjust purchasing plan |
| **Quarterly** | Audit dead stock; create clearance/bundling plan for stale inventory |
| **Per Shipment** | Log all cost components and reconcile against model estimates |

## Red Flags

- Any top-20 SKU hitting stockout (immediate lost revenue)
- Landed cost exceeding model by more than 15% (check freight rates, exchange rates)
- Inventory turnover falling below 4x annually (capital tied up in unsold product)
- Dead stock exceeding 15% of total inventory value
- CAD/USD exchange rate swinging more than 5% from budget assumption

---

# 7. PRICING MODEL

## Purpose

Set and dynamically adjust prices to maximize revenue while staying competitive. Prices must cover all costs, fund growth, and reflect brand positioning.

## Pricing Framework

### Cost-Plus Floor

```
Minimum Price = Landed Cost per Unit / (1 − Minimum Margin %)

Example: $45 landed cost / (1 − 0.55) = $100 minimum DTC price
```

### Competitive Positioning

| Tier | Position | Pricing Approach |
|------|----------|-----------------|
| **Premium (Origin Hair, Mane Haus)** | Top 25% of market | 15-25% above mid-market competitors |
| **Mid-Market** | Market average | Match competitor pricing |
| **Value / Clearance** | Below market | For dead stock and promotions only |

### Channel-Specific Pricing

| Channel | Strategy | Typical Margin |
|---------|----------|---------------|
| **DTC Website** | Full retail price; primary revenue channel | 60-70% |
| **Instagram/Social** | Occasional flash sales (10-15% off) | 50-60% |
| **Wholesale (Salon)** | 40-50% below retail; volume-based tiers | 40-50% |
| **Marketplace (Amazon)** | Competitive; account for marketplace fees (15%) | 35-45% |

## Price Elasticity Testing

Run structured A/B price tests on 2-3 SKUs per quarter:

```
Revenue Impact = (New Price × New Volume) − (Old Price × Old Volume)
Margin Impact = (New Margin × New Volume) − (Old Margin × Old Volume)
```

## How to Monitor

| Frequency | Action |
|-----------|--------|
| **Weekly** | Check competitor pricing on top 10 SKUs (Clore Beauty, Weave Got It, Canada Hair) |
| **Monthly** | Review margin by SKU; flag any below cost-plus floor |
| **Monthly** | Analyze discount depth and frequency — ensure average discount stays below 12% |
| **Quarterly** | Run price elasticity tests; adjust pricing tiers based on results |
| **Per Cost Change** | Recalculate cost-plus floors when landed costs change |

## Red Flags

- Average discount depth exceeding 15% (eroding brand premium)
- Any SKU selling below cost-plus floor for 2+ consecutive weeks
- Competitors undercutting by more than 25% on comparable products
- Wholesale accounts demanding pricing below 40% margin

---

# 8. BREAK-EVEN ANALYSIS

## Purpose

Determine the minimum sales volume or revenue needed to cover all fixed and variable costs. Essential for knowing when the business becomes self-sustaining.

## Break-Even Formulas

```
Break-Even Units = Fixed Costs / (Price per Unit − Variable Cost per Unit)

Break-Even Revenue = Fixed Costs / Contribution Margin Ratio

Contribution Margin Ratio = (Price − Variable Costs) / Price
```

## Fixed vs. Variable Cost Classification

### Fixed Costs (Monthly)

| Category | Year 1 Estimate | Year 2 Estimate |
|----------|----------------|----------------|
| E-commerce platform & hosting | $150 - $300 | $200 - $400 |
| Insurance | $100 - $150 | $100 - $150 |
| Software subscriptions | $100 - $200 | $200 - $350 |
| Storage / warehouse | $0 (home-based) | $200 - $500 |
| Consultant retainer | $0 - $300 | $300 - $600 |
| **Total Fixed** | **$350 - $950** | **$1,000 - $2,000** |

### Variable Costs (Per Order)

| Category | Typical % of Revenue |
|----------|---------------------|
| COGS (product + landed cost) | 30-40% (DTC) |
| Shipping (outbound) | 5-8% |
| Payment processing | 2.9% + $0.30 |
| Packaging | 2-3% |
| Returns/refunds | 1-3% |
| **Total Variable** | **~41-55%** |

## Break-Even Scenarios

| Scenario | Monthly Fixed | Avg Contribution Margin | Break-Even Revenue/Month |
|----------|--------------|------------------------|-------------------------|
| **Lean Startup (Y1)** | $500 | 50% | $1,000 |
| **Growth Phase (Y2)** | $1,500 | 52% | $2,885 |
| **Scaled (Y3)** | $3,000 | 55% | $5,455 |
| **With Marketing** | $5,000 (incl. $3K ads) | 55% | $9,091 |

## How to Monitor

| Frequency | Action |
|-----------|--------|
| **Monthly** | Calculate actual fixed costs and contribution margin; update break-even point |
| **Monthly** | Track cumulative revenue vs. break-even line on a chart |
| **Quarterly** | Recalculate break-even under updated cost structure |
| **Before major spending decisions** | Model the new break-even point with the added fixed cost |

## Red Flags

- Revenue consistently below break-even for 3+ consecutive months
- Fixed costs growing faster than revenue
- Contribution margin declining (variable costs increasing)

---

# 9. MARKETING ROI MODEL

## Purpose

Measure the return on every marketing dollar spent. With a budget of $1,500-$3,800/month, every dollar must work.

## Channel ROI Framework

| Channel | Monthly Budget | Key Metrics | ROI Formula |
|---------|---------------|------------|-------------|
| **Instagram/Facebook Ads** | $600 | ROAS, CPC, CPM, conversions | Revenue from Ads / Ad Spend |
| **TikTok Ads** | $400 | Views, engagement, conversions | Revenue from Ads / Ad Spend |
| **Influencer/Ambassador** | $300 - $500 | Reach, promo code usage, new customers | Revenue from Codes / Total Influencer Cost |
| **Email Marketing** | $100 - $200 | Open rate, click rate, revenue per email | Email Revenue / Email Platform Cost |
| **SEO/Content** | $200 - $400 | Organic traffic, organic conversions | Organic Revenue / SEO Investment |
| **Referral Program** | Variable | Referrals completed, referral revenue | Referral Revenue / Reward Cost |

## Key Marketing Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| **ROAS (Return on Ad Spend)** | Revenue from Ads / Ad Spend | > 4:1 |
| **CPA (Cost per Acquisition)** | Total Spend / New Customers | < $25 |
| **CPM (Cost per 1000 Impressions)** | (Spend / Impressions) × 1000 | < $15 |
| **Email Revenue per Send** | Email Revenue / Emails Sent | > $0.10 |
| **Influencer ROI** | (Revenue − Cost) / Cost | > 200% |

## Attribution Model

Start with last-click attribution for simplicity, but build toward a weighted multi-touch model:

| Touch Point | Weight (Suggested) |
|-------------|-------------------|
| First touch (awareness) | 20% |
| Mid-funnel (engagement) | 20% |
| Last touch (conversion) | 40% |
| Post-purchase (retention) | 20% |

## How to Monitor

| Frequency | Action |
|-----------|--------|
| **Daily** | Check ad platform dashboards: spend pacing, CPC, ROAS |
| **Weekly** | Review spend vs. budget by channel; pause underperforming ads (ROAS < 2:1) |
| **Biweekly** | Analyze influencer/ambassador performance; compare promo code usage |
| **Monthly** | Full marketing ROI report by channel; reallocate budget to highest performers |
| **Quarterly** | Audit attribution model accuracy; test new channels with 10% of budget |

## Red Flags

- ROAS falling below 2:1 on any paid channel for 2+ consecutive weeks
- Total marketing spend exceeding 25% of revenue
- Email unsubscribe rate exceeding 1% per send
- Influencer campaigns generating zero tracked conversions
- CPA rising above $40 on any channel without CLV justification

---

# 10. LOYALTY PROGRAM FINANCIAL MODEL

## Purpose

Project the financial impact of the Crown Rewards program and ensure it drives profitable behavior, not just point accumulation.

## Program Economics (from Loyalty Program Overview)

| Parameter | Value |
|-----------|-------|
| Base earning rate | 1 point per $1 spent |
| Redemption value | 100 points = $1 CAD |
| Effective earning rate | 1% base return |
| Expected breakage (unredeemed points) | 30-40% |
| Effective program cost | ~0.9% of revenue |
| Tier multipliers | 1x (Starter), 1.5x (Luxe), 2x (Elite), 3x (Icon) |

## Financial Impact Projections

| Metric | Without Program | With Program | Lift |
|--------|----------------|-------------|------|
| Repeat purchase rate | 25% | 45% | +60% |
| Average order value | Baseline | +12% | +12% |
| Customer lifetime value | Baseline | +25% | +25% |
| Referral-driven new customers | — | 15% of acquisitions | New channel |

## Points Liability Model

```
Points Issued (month) = Revenue × Avg Tier Multiplier × 1 point/$1
Points Redeemed (month) = Points Issued (lagged 2-3 months) × (1 − Breakage Rate)
Points Liability = Cumulative Issued − Cumulative Redeemed − Cumulative Expired
Dollar Liability = Points Liability / 100
```

Track points liability on the balance sheet. Expired points (12-month inactivity per program rules) reduce the liability.

## How to Monitor

| Frequency | Action |
|-----------|--------|
| **Monthly** | Calculate points issued, redeemed, expired; update liability |
| **Monthly** | Compare loyalty member AOV and frequency vs. non-members |
| **Monthly** | Track tier distribution (what % of customers are in each tier?) |
| **Quarterly** | Calculate actual breakage rate; adjust liability model if diverging from 30-40% |
| **Quarterly** | Measure referral program ROI: cost per referred customer vs. blended CAC |
| **Annually** | Full program P&L: incremental revenue from loyalty vs. total program cost |

## Red Flags

- Points liability growing faster than revenue (over-issuance)
- Breakage rate dropping below 20% (program cost exceeds budget)
- Loyalty members showing no AOV or frequency lift vs. non-members
- More than 40% of customers in top tiers (tier thresholds too low)
- Referral fraud signals: same payment methods, same IP clusters, immediate returns

---

# 11. MULTI-BRAND P&L MODEL

## Purpose

Produce a profit & loss statement for the overall business and for each brand (Origin Hair Collective, Mane Haus), enabling brand-level investment decisions.

## P&L Structure

```
Revenue
  − Cost of Goods Sold (COGS)
  ─────────────────────────
  = Gross Profit

  − Marketing & Advertising
  − Shipping & Fulfillment
  − Platform & Technology
  − General & Administrative
  ─────────────────────────
  = Operating Profit (EBITDA)

  − Depreciation & Amortization
  − Interest & Financing
  ─────────────────────────
  = Net Profit Before Tax
```

## Shared Cost Allocation

Since CrownCommerce is a shared platform serving multiple brands, allocate shared costs fairly:

| Shared Cost | Allocation Method |
|-------------|-------------------|
| Platform/technology (hosting, Aspire, gateway) | Revenue-weighted split between brands |
| Admin dashboard development | Equal split (both brands use it) |
| Shared component library | Revenue-weighted split |
| Insurance (business-level) | Revenue-weighted split |
| Accounting/legal | Revenue-weighted split |

## How to Monitor

| Frequency | Action |
|-----------|--------|
| **Monthly** | Produce P&L for each brand and consolidated; compare to forecast |
| **Monthly** | Calculate operating margin by brand; flag any brand below 10% operating margin |
| **Quarterly** | Review shared cost allocation; adjust weights based on updated revenue mix |
| **Quarterly** | Compare brand-level profitability trends; inform investment priorities |
| **Annually** | Full-year P&L review; set next-year budget and targets |

## Red Flags

- Either brand operating at a loss for 3+ consecutive months (beyond planned launch investment)
- Shared costs exceeding 15% of consolidated revenue
- Operating margin declining quarter-over-quarter without a clear growth investment explanation
- Revenue concentration: one brand representing more than 85% of total revenue beyond Year 2

---

# 12. SCENARIO & SENSITIVITY ANALYSIS

## Purpose

Stress-test financial models against realistic adverse conditions. Import businesses face unique risks including currency fluctuations, supply chain disruptions, and demand shifts.

## Key Variables to Stress-Test

| Variable | Base Case | Downside | Severe Downside |
|----------|-----------|----------|-----------------|
| **CAD/USD exchange rate** | 0.73 | 0.68 | 0.63 |
| **Freight rates (% increase)** | 0% | +30% | +60% |
| **Supplier price increase** | 0% | +10% | +20% |
| **Customs duty (if LDCT ends)** | 0% (Cambodia) | 15.5% | 15.5% + surcharges |
| **Conversion rate** | 2.5% | 1.8% | 1.2% |
| **Return rate** | 4% | 8% | 12% |
| **Marketing CAC** | $20 | $30 | $45 |
| **Demand (volume)** | Plan | −20% | −40% |

## Scenario Definitions

### Best Case
- Strong CAD, low freight, high conversion, strong word-of-mouth
- Revenue +25% vs. plan, margins +5pp

### Base Case
- Assumptions from business plan hold
- Revenue and margins on plan

### Downside
- CAD weakens, freight rises, one major supplier issue per year
- Revenue −15%, margins −8pp

### Severe Downside
- Multiple simultaneous adversities: weak CAD, high freight, LDCT revoked, demand slump
- Revenue −35%, margins −15pp, cash flow negative

## Sensitivity Table Format

```
            | Revenue Impact | Margin Impact | Cash Impact |
Variable    | −10% | +10%   | −10% | +10%  | −10% | +10% |
─────────────────────────────────────────────────────────────
Exchange rate|      |        |      |       |      |       |
Freight cost |      |        |      |       |      |       |
COGS         |      |        |      |       |      |       |
Conversion   |      |        |      |       |      |       |
AOV          |      |        |      |       |      |       |
```

## How to Monitor

| Frequency | Action |
|-----------|--------|
| **Monthly** | Update CAD/USD rate and freight rate assumptions with current market data |
| **Quarterly** | Run full scenario analysis with updated actuals; recalculate downside thresholds |
| **On major events** | Immediately re-run scenarios when: exchange rate moves 5%+, new tariffs announced, supplier issues arise |
| **Annually** | Review scenario definitions and thresholds; adjust for business maturity |

## Red Flags

- Actuals tracking closer to "Downside" scenario than "Base Case" for 2+ months
- Multiple stress variables moving adversely simultaneously
- No contingency plan documented for "Severe Downside" scenarios

---

# 13. MONITORING CADENCE & DASHBOARD DESIGN

## Recommended Monitoring Schedule

### Daily Dashboard (5-minute check)

| Metric | Source |
|--------|--------|
| Orders placed (count & revenue) | E-commerce platform |
| Website traffic & conversion rate | Google Analytics |
| Ad spend pacing & ROAS | Meta Ads, TikTok Ads |
| Cash balance | Bank account |

### Weekly Review (30-minute review)

| Metric | Source |
|--------|--------|
| Revenue vs. weekly target (by channel) | Sales model |
| Top/bottom performing SKUs | Unit economics model |
| Inventory alerts (low stock, reorder) | Inventory model |
| CAC by channel (rolling 7-day) | CAC model |
| Marketing spend vs. budget | Marketing ROI model |

### Monthly Business Review (2-hour deep dive)

| Deliverable | Models Used |
|-------------|------------|
| P&L by brand (actual vs. forecast) | Multi-brand P&L |
| Cash flow: actual vs. forecast, updated 13-week projection | Cash flow forecast |
| Unit economics update: margins by SKU | Unit economics |
| Customer metrics: CLV, retention, cohort analysis | CLV model |
| Inventory health: turnover, DOI, dead stock | Inventory model |
| Marketing ROI by channel | Marketing ROI |
| Loyalty program metrics | Loyalty financial model |
| Updated break-even analysis | Break-even model |

### Quarterly Strategic Review (half-day)

| Deliverable | Models Used |
|-------------|------------|
| Scenario analysis refresh | Scenario model |
| Pricing review and competitor analysis | Pricing model |
| Annual forecast update | Revenue model |
| Supplier cost review and renegotiation planning | Landed cost model |
| Loyalty program P&L | Loyalty model |
| Brand-level investment decisions | Multi-brand P&L |

## Dashboard KPIs Summary

| KPI | Target | Warning | Critical |
|-----|--------|---------|----------|
| Monthly Revenue vs. Plan | > 90% | 75-90% | < 75% |
| Gross Margin (DTC) | > 60% | 50-60% | < 50% |
| Contribution Margin | > 45% | 35-45% | < 35% |
| LTV:CAC Ratio | > 3:1 | 2:1 - 3:1 | < 2:1 |
| Cash Runway | > 3 months | 1-3 months | < 1 month |
| Inventory Turnover | > 6x/yr | 4-6x/yr | < 4x/yr |
| ROAS (Paid Ads) | > 4:1 | 2:1 - 4:1 | < 2:1 |
| Repeat Purchase Rate | > 35% | 25-35% | < 25% |
| Stockout Rate | < 5% | 5-10% | > 10% |
| Customer Satisfaction (NPS) | > 50 | 30-50 | < 30 |

---

# 14. TOOLS & IMPLEMENTATION

## Recommended Tool Stack

| Function | Tool | Cost | Priority |
|----------|------|------|----------|
| **Spreadsheet models** | Google Sheets (free) or Excel | $0 - $15/month | Immediate |
| **Accounting** | Wave (free) or QuickBooks | $0 - $35/month | Immediate |
| **Analytics** | Google Analytics 4 | Free | Immediate |
| **Ad tracking** | Meta Ads Manager, TikTok Ads Manager | Free (platform tools) | Immediate |
| **Inventory management** | Built into e-commerce platform or Stocky | $0 - $30/month | Month 3+ |
| **Dashboard** | Google Looker Studio (free) or Metabase | Free | Month 6+ |
| **Email analytics** | Built into email platform (Mailchimp, Klaviyo) | Part of subscription | Immediate |

## Implementation Priority

### Phase 1 — Pre-Launch (Now)

1. **Unit Economics Model** — set up in a spreadsheet with all SKU-level costs
2. **Cash Flow Forecast** — build 13-week projection; update weekly
3. **Break-Even Analysis** — know your minimum viable revenue target
4. **Pricing Model** — establish cost-plus floors and competitive positioning

### Phase 2 — Launch (Month 1-3)

5. **Revenue & Sales Model** — begin tracking actuals vs. forecast
6. **CAC Model** — set up tracking pixels and UTM parameters on all channels
7. **Marketing ROI Model** — configure conversion tracking in all ad platforms
8. **Inventory & Landed Cost Model** — log first shipments with full cost breakdown

### Phase 3 — Growth (Month 4-12)

9. **CLV Model** — enough data for initial cohort analysis (need 3+ months)
10. **Multi-Brand P&L** — relevant once Mane Haus launches
11. **Loyalty Program Financial Model** — when Crown Rewards program goes live
12. **Scenario & Sensitivity Analysis** — enough history to calibrate assumptions

## Spreadsheet Template Structure

Each model should be a separate tab (or linked sheet) in a master financial workbook:

```
Master Financial Workbook
├── Dashboard (summary KPIs with conditional formatting)
├── Unit Economics (SKU-level)
├── Cash Flow (13-week rolling)
├── Revenue Model (monthly by channel)
├── CAC Tracker (by channel, monthly)
├── CLV / Cohorts (monthly cohort matrix)
├── Inventory (SKU stock levels, landed costs)
├── Pricing (competitive matrix, cost floors)
├── Break-Even (monthly recalculation)
├── Marketing ROI (by channel, monthly)
├── Loyalty Program (points ledger, liability)
├── P&L — Origin Hair Collective
├── P&L — Mane Haus
├── P&L — Consolidated
├── Scenarios (base, downside, severe)
└── Assumptions (single source of truth for all inputs)
```

The **Assumptions** tab is critical — it feeds all other tabs so that changing one input (e.g., exchange rate, freight cost) automatically updates every model.

---

*This guide should be treated as a living document. Review and update the models, targets, and thresholds as the business matures and market conditions evolve.*
