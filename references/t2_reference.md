# T2 Line Numbers, GIFI Codes & CCA Classes

## Table of Contents
1. [GIFI Codes for Balance Sheet](#gifi-codes-for-balance-sheet)
2. [GIFI Codes for Income Statement](#gifi-codes-for-income-statement)
3. [T2 Return Line Numbers](#t2-return-line-numbers)
4. [CCA Classes and Rates](#cca-classes-and-rates)
5. [Common Expense Categories Mapping](#common-expense-categories-mapping)

---

## GIFI Codes for Balance Sheet

### Assets
| GIFI | Description | Typical Use |
|------|------------|-------------|
| 1000 | Cash and deposits | Bank account balance |
| 1002 | Cash - Canadian currency | Primary checking account |
| 1060 | Accounts receivable | Outstanding invoices |
| 1066 | Tax receivable (HST/GST) | HST refund owed by CRA |
| 1120 | Inventory | Product inventory |
| 1180 | Prepaid expenses | Prepaid leases, deposits, insurance |
| 1740 | Furniture and fixtures | Office furniture |
| 1772 | Machinery and equipment | 3D printers, manufacturing equipment |
| 1774 | Computer equipment | Laptops, desktops, servers, peripherals |
| 1776 | Computer software | Licensed software (if capitalized) |
| 1800 | Accumulated amortization - total | Contra-asset for all CCA |

### Liabilities
| GIFI | Description | Typical Use |
|------|------------|-------------|
| 2600 | Accounts payable and accrued liabilities | Bills owed to suppliers |
| 2620 | Accrued liabilities | Professional fees owing |
| 2680 | Credit card payable | Outstanding CC balance |
| 2700 | HST/GST payable | HST owed to CRA |
| 2780 | Current portion of long-term debt | Loans due within 12 months |
| 2980 | Loans from shareholders | Due to shareholders/directors |

### Equity
| GIFI | Description | Typical Use |
|------|------------|-------------|
| 3500 | Common shares | Share capital |
| 3600 | Retained earnings | Accumulated profits/losses |
| 3620 | Retained earnings - beginning | Opening RE balance |
| 3849 | Retained earnings - ending | Closing RE (3620 + net income) |

---

## GIFI Codes for Income Statement

### Revenue
| GIFI | Description | T2 Line |
|------|------------|---------|
| 8000 | Sales of goods and services | 8000 |
| 8089 | Total sales | 8089 |
| 8090 | Other revenue | 8090 |
| 8210 | Rental income | 8210 |
| 8230 | Interest income | 8230 |
| 8299 | Total revenue | 8299 |

### Expenses
| GIFI | Description | T2 Line | Notes |
|------|------------|---------|-------|
| 8520 | Purchases / cost of sales | 8520 | |
| 8523 | Meals and entertainment | 8523 | Only 50% deductible |
| 8590 | Subcontracts | 8590 | |
| 8670 | Professional development / training | 8670 | 100% deductible |
| 8710 | Interest and bank charges | 8710 | |
| 8760 | Business taxes, licenses, memberships | 8760 | |
| 8810 | Office expenses / software | 8810 | |
| 8811 | Office supplies / telephone | 8811 | |
| 8860 | Professional fees (legal, accounting) | 8860 | |
| 8870 | Management and admin fees | 8870 | |
| 8910 | Rent | 8910 | |
| 8960 | Repairs and maintenance | 8960 | |
| 9060 | Salaries, wages, benefits | 9060 | |
| 9150 | Amortization of tangible assets | 9150 | CCA amount |
| 9180 | Insurance | 9180 | |
| 9200 | Travel expenses | 9200 | |
| 9220 | Motor vehicle expenses (not CCA) | 9220 | Fuel, tolls, parking, transit |
| 9224 | Motor vehicle - fuel | 9224 | |
| 9225 | Motor vehicle - repairs | 9225 | |
| 9226 | Motor vehicle - insurance | 9226 | |
| 9227 | Motor vehicle - license and registration | 9227 | |
| 9281 | Motor vehicle - lease payments | 9281 | Subject to CRA monthly limit |
| 9367 | Advertising and promotion | 9367 | |
| 9368 | Total expenses | 9368 | |
| 9369 | Total expenses before adjustments | 9369 | |
| 9898 | Other expenses | 9898 | |
| 9999 | Net income / (loss) | 9999 | Revenue - Expenses |

---

## T2 Return Line Numbers

### Key Lines on the T2 Return
| Line | Description | Source |
|------|------------|--------|
| 001 | Corporation name | |
| 002 | Mailing address | |
| 005 | Business number | BN: 9 digits + RC0001 |
| 060 | Tax year start date | Jan 1 for calendar year |
| 061 | Tax year end date | Dec 31 for calendar year |
| 070 | Province of filing | ON for Ontario |
| 200 | Federal tax payable | Calculated |
| 235 | Provincial tax payable | Calculated |
| 300 | Net income per financial statements (Line 9999) | Schedule 1 |
| 350 | Taxable income | After adjustments |
| 400 | Federal tax rate | 9% for CCPC (small business) |
| 430 | Small business deduction | Up to $500K active business income |
| 700 | Total tax payable | Sum of all taxes |
| 770 | Balance owing / refund | Tax payable - credits/installments |

### Schedule 1 - Net Income Reconciliation
| Line | Description |
|------|------------|
| 300 | Net income per financial statements |
| 302 | Add: 50% of meals & entertainment |
| 404 | Deduct: CCA claimed (if not in financial statements) |
| 435 | Net income for tax purposes |

### Schedule 4 - Loss Continuity
| Field | Description |
|-------|------------|
| Non-capital losses - opening | Losses from prior years |
| Current year non-capital loss | This year's loss |
| Losses applied this year | Losses used to reduce income |
| Non-capital losses - closing | Available for future years |

---

## CCA Classes and Rates

| Class | Rate | Assets | Half-Year Rule |
|-------|------|--------|----------------|
| 1 | 4% | Buildings acquired after 1987 | Yes |
| 8 | 20% | Office equipment, furniture, photocopiers, fax, phone systems, printers, 3D printers | Yes |
| 10 | 30% | Motor vehicles (purchased), general-purpose electronic equipment | Yes |
| 10.1 | 30% | Passenger vehicles costing > $37,000 (2024 limit) | Yes |
| 12 | 100% | Software (< $500), linens, uniforms, tools (< $500) | No |
| 14 | 5% or term | Patents, franchises, limited-life licenses | N/A |
| 50 | 55% | Computers, laptops, tablets, servers, system software acquired after Mar 18, 2007 | Yes |
| 53 | 50% | Manufacturing and processing equipment acquired after 2015 | Yes |
| 54 | 30% | Zero-emission vehicles > $61,000 | Yes |
| 55 | 40% | Zero-emission vehicles < $61,000 | Yes |

### CCA Calculation Formula

**Standard year:**
```
CCA = Rate x UCC at start of year
```

**Year of acquisition (half-year rule):**
```
CCA = Rate x (Opening UCC + (Net Additions / 2))
Net Additions = Additions - Disposals (if any)
```

**Year of disposal:**
```
If proceeds > UCC: recapture (add to income)
If UCC > proceeds: terminal loss (deduct from income)
```

### CRA Vehicle Lease Limits (2024)
- Monthly lease limit: $1,050 + HST (before tax)
- If actual lease < limit, deduct actual amount
- Tesla at $865.93/mo including HST = ~$766/mo pre-HST -- within limit

---

## Common Expense Categories Mapping

This maps real-world expenses to T2 lines. Use this when categorizing bank and credit card transactions.

| Real-World Expense | T2 Line | GIFI | Deductible % | Notes |
|---|---|---|---|---|
| ChatGPT, Claude, Copilot subscriptions | L8810 | 8810 | 100% | Software |
| LinkedIn Premium | L8670 | 8670 | 100% | Professional development |
| Domain registration, hosting | L8860 | 8860 | 100% | Business registration |
| Udemy, Coursera courses | L8670 | 8670 | 100% | Training |
| Conference tickets | L8670 | 8670 | 100% | Professional development |
| 407 ETR highway tolls | L9220 | 9220 | 100% | Transportation |
| TTC/transit passes | L9220 | 9220 | 100% | Transportation |
| Parking fees | L9220 | 9220 | 100% | Transportation |
| Client dinners, lunches | L8523 | 8523 | 50% | Meals & entertainment |
| Annual credit card fee | L8710 | 8710 | 100% | Bank charges |
| Credit card interest | L8710 | 8710 | 100% | Interest expense |
| Bank monthly fee | L8710 | 8710 | 100% | Bank charges |
| E-transfer fees | L8710 | 8710 | 100% | Bank charges |
| Tesla lease payment | L9281 | 9281 | 100%* | *Subject to CRA limit |
| Tesla repairs/tires | L9225 | 9225 | 100% | Motor vehicle maintenance |
| Accounting/CPA fees | L8860 | 8860 | 100% | Professional fees |
| MacBook purchase | Sched 8 | N/A | CCA | Class 50, 55% |
| Office printer | Sched 8 | N/A | CCA | Class 8, 20% |
| Laptop bag, cables, peripherals | L8810 | 8810 | 100% | If < $500 each |
| US business trip expenses | L9200 | 9200 | 100% | No HST applies |
