# Calculation Methodology

This document explains exactly how **Best Conversion Rate** calculates the final INR amount you receive for each platform. All formulas match the logic in [`src/lib/calculation.ts`](./src/lib/calculation.ts).

> [!NOTE]
> All examples below use **$1,000 USD** with an assumed mid-market rate of **₹95.00 / USD** to illustrate the math. Actual results depend on live rates.

---

## Table of Contents

- [Key Terms](#key-terms)
- [Fintech Platforms](#fintech-platforms)
  - [Skydo](#skydo)
  - [Mulya](#mulya)
  - [Infinity App](#infinity-app)
- [Banks](#banks)
  - [Bank Charges (Shared Formula)](#bank-charges-shared-formula)
  - [IDFC First Bank](#idfc-first-bank)
  - [Indian Overseas Bank (IOB)](#indian-overseas-bank-iob)
- [Final Ranking](#final-ranking)

---

## Key Terms

| Term | Definition |
|---|---|
| **Mid-Market Rate** | The "true" exchange rate with no markup or fees. This is the baseline used by all fintech platforms and the reference point for bank comparisons. |
| **TT Buy Rate** | Telegraphic Transfer buying rate — the rate a bank uses to convert incoming foreign wire transfers. Always lower than the mid-market rate. |
| **Effective Rate** | `Receiving Amount ÷ USD Amount` — the real rate you end up getting after all deductions. This is what gets compared. |
| **GST** | Goods & Services Tax at 18%, applied on service/transaction fees in India. |

---

## Fintech Platforms

Fintech platforms (Skydo, Mulya, Infinity App) all use the **mid-market rate with no markup**. The only cost is their platform fee (plus GST where applicable).

### Skydo

Skydo uses a **tiered transaction fee** based on the USD amount, with **18% GST** on top.

#### Fee Structure

| USD Amount | Transaction Fee |
|---|---|
| < $2,000 | $19 × Mid-Market Rate (flat fee in INR) |
| $2,000 – $9,999 | $29 × Mid-Market Rate (flat fee in INR) |
| ≥ $10,000 | 0.3% of INR amount |

#### Formula

```
Amount INR        = USD Amount × Mid-Market Rate
Transaction Fee   = (tiered, see table above)
GST on Fee        = Transaction Fee × 0.18

Total Fee         = Transaction Fee + GST on Fee
Receiving Amount  = Amount INR − Total Fee
Effective Rate    = Receiving Amount ÷ USD Amount
```

#### Worked Example ($1,000 USD)

```
Amount INR        = 1000 × 95.00          = ₹95,000.00
Transaction Fee   = 19 × 95.00            = ₹1,805.00   (since $1,000 < $2,000)
GST on Fee        = 1,805.00 × 0.18       = ₹324.90

Total Fee         = 1,805.00 + 324.90     = ₹2,129.90
Receiving Amount  = 95,000.00 − 2,129.90  = ₹92,870.10
Effective Rate    = 92,870.10 ÷ 1,000     = ₹92.8701 / USD
```

---

### Mulya

Mulya charges a flat **1% fee** on the converted INR amount. No tiered pricing.

#### Formula

```
Amount INR        = USD Amount × Mid-Market Rate
Total Fee         = Amount INR × 0.01
Receiving Amount  = Amount INR − Total Fee
Effective Rate    = Receiving Amount ÷ USD Amount
```

#### Worked Example ($1,000 USD)

```
Amount INR        = 1000 × 95.00          = ₹95,000.00
Total Fee         = 95,000.00 × 0.01      = ₹950.00

Receiving Amount  = 95,000.00 − 950.00    = ₹94,050.00
Effective Rate    = 94,050.00 ÷ 1,000     = ₹94.0500 / USD
```

---

### Infinity App

Infinity App charges a flat **0.5% fee** on the converted INR amount.

#### Formula

```
Amount INR        = USD Amount × Mid-Market Rate
Total Fee         = Amount INR × 0.005
Receiving Amount  = Amount INR − Total Fee
Effective Rate    = Receiving Amount ÷ USD Amount
```

#### Worked Example ($1,000 USD)

```
Amount INR        = 1000 × 95.00          = ₹95,000.00
Total Fee         = 95,000.00 × 0.005     = ₹475.00

Receiving Amount  = 95,000.00 − 475.00    = ₹94,525.00
Effective Rate    = 94,525.00 ÷ 1,000     = ₹94.5250 / USD
```

---

## Banks

Banks work differently. They don't charge a percentage fee on your transfer — instead, they apply a **TT Buy Rate** that is lower than the mid-market rate. The difference between what your USD _should_ be worth (at mid-market) and what the bank gives you (at TT rate) _is_ the forex fee. On top of that, banks charge **service charges with GST**.

### Bank Charges (Shared Formula)

Both IDFC First Bank and IOB use the same tiered service charge structure for inward remittances.

#### Service Charge Tiers

| INR Amount (at TT Rate) | Taxable Value |
|---|---|
| < ₹1,00,000 | max(1% of amount, ₹250) |
| ₹1,00,000 – ₹9,99,999 | ₹1,000 + 0.5% of (amount − ₹1,00,000) |
| ≥ ₹10,00,000 | ₹5,500 + 0.1% of (amount − ₹10,00,000) |

The **GST on bank charges** = `Taxable Value × 0.18`

> [!IMPORTANT]
> Only the GST component (`Taxable Value × 0.18`) is treated as an additional out-of-pocket cost. The service charge itself is absorbed into the spread for calculation purposes.

---

### IDFC First Bank

#### Formula

```
Amount INR (Market)   = USD Amount × Mid-Market Rate
Amount INR (TT)       = USD Amount × IDFC TT Buy Rate

Forex Fee             = Amount INR (Market) − Amount INR (TT)
Bank Charges GST      = calcBankCharges(Amount INR at TT Rate)

Total Fee             = Forex Fee + Bank Charges GST
Receiving Amount      = Amount INR (Market) − Total Fee
Effective Rate        = Receiving Amount ÷ USD Amount
```

#### Worked Example ($1,000 USD)

Assume Mid-Market Rate = ₹95.00, IDFC TT Buy Rate = ₹94.60

```
Amount INR (Market)   = 1000 × 95.00             = ₹95,000.00
Amount INR (TT)       = 1000 × 94.60             = ₹94,600.00

Forex Fee             = 95,000.00 − 94,600.00    = ₹400.00

Bank Charges:
  Taxable Value       = max(1% × 94,600, 250)
                      = max(946.00, 250)          = ₹946.00
  GST on Charges      = 946.00 × 0.18            = ₹170.28

Total Fee             = 400.00 + 170.28           = ₹570.28
Receiving Amount      = 95,000.00 − 570.28        = ₹94,429.72
Effective Rate        = 94,429.72 ÷ 1,000         = ₹94.4297 / USD
```

---

### Indian Overseas Bank (IOB)

IOB works similarly to IDFC but charges an additional **IRC (Inward Remittance Certificate) fee** of ₹150 + 18% GST.

#### Formula

```
Amount INR (Market)   = USD Amount × Mid-Market Rate
Amount INR (TT)       = USD Amount × IOB TT Buy Rate

Forex Fee             = Amount INR (Market) − Amount INR (TT)
Bank Charges GST      = calcBankCharges(Amount INR at TT Rate)

IRC Fee               = ₹150
GST on IRC            = 150 × 0.18 = ₹27
IRC Total             = ₹177

Total Fee             = Forex Fee + Bank Charges GST + IRC Total
Receiving Amount      = Amount INR (Market) − Total Fee
Effective Rate        = Receiving Amount ÷ USD Amount
```

#### Worked Example ($1,000 USD)

Assume Mid-Market Rate = ₹95.00, IOB TT Buy Rate = ₹94.40

```
Amount INR (Market)   = 1000 × 95.00             = ₹95,000.00
Amount INR (TT)       = 1000 × 94.40             = ₹94,400.00

Forex Fee             = 95,000.00 − 94,400.00    = ₹600.00

Bank Charges:
  Taxable Value       = max(1% × 94,400, 250)
                      = max(944.00, 250)          = ₹944.00
  GST on Charges      = 944.00 × 0.18            = ₹169.92

IRC Total             = 150 + (150 × 0.18)        = ₹177.00

Total Fee             = 600.00 + 169.92 + 177.00  = ₹946.92
Receiving Amount      = 95,000.00 − 946.92        = ₹94,053.08
Effective Rate        = 94,053.08 ÷ 1,000         = ₹94.0531 / USD
```

---

## Final Ranking

After computing each platform's result, all five are sorted by **effective rate** in descending order:

```
Best    ▲  Highest effective rate  →  You receive the most ₹
          ...
Worst   ▼  Lowest effective rate   →  You receive the least ₹
```

The platform at the top is tagged as **best** (highlighted in green), and the one at the bottom is tagged as **worst** (highlighted in red). Everything in between is **default**.

> [!TIP]
> Rankings can change significantly based on the USD amount. For example, Skydo's flat $19 fee is expensive for small transfers but very competitive at higher amounts. Always compare at _your_ specific transfer amount.

---

## Summary Comparison Table

| Platform | Fee Model | GST | Extra Charges |
|---|---|---|---|
| **Skydo** | Tiered: $19 / $29 / 0.3% | 18% on fee | — |
| **Mulya** | Flat 1% | Included | — |
| **Infinity App** | Flat 0.5% | Included | — |
| **IDFC First Bank** | TT Rate spread + tiered svc charge | 18% on svc charge | — |
| **IOB** | TT Rate spread + tiered svc charge | 18% on svc charge | IRC ₹150 + GST |

---

<p align="center">
  <a href="./README.md">← Back to README</a>
</p>
