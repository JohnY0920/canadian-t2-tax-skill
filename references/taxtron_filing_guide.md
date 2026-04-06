# TaxTron T2 Web -- Step-by-Step Filing Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [General Information](#general-information)
3. [Shareholder Information](#shareholder-information)
4. [Financial Contact Person](#financial-contact-person)
5. [CRA Questionnaire](#cra-questionnaire)
6. [Balance Sheet - Assets](#balance-sheet---assets)
7. [Balance Sheet - Liabilities](#balance-sheet---liabilities)
8. [Balance Sheet - Equity](#balance-sheet---equity)
9. [Income Statement](#income-statement)
10. [Schedule 8 - CCA](#schedule-8---cca)
11. [Schedule 1 - Net Income Reconciliation](#schedule-1)
12. [Schedule 4 - Loss Continuity](#schedule-4)
13. [Tax Summary & Submission](#tax-summary--submission)

---

## Getting Started

1. Go to https://netfilet2.taxtron.ca
2. Create an account or log in
3. Click "New Return"
4. Select the tax year being filed

**License:** TaxTron charges per return. A single T2 license costs approximately $130. Multi-return packages are available if filing multiple years.

---

## General Information

This is the first page after creating a new return.

| Field | What to Enter | Source |
|-------|--------------|--------|
| Corporation name | Full legal name as registered | Articles of incorporation |
| Business number | 9 digits + RC + 4 digits (e.g., 795629872RC0001) | CRA correspondence |
| Tax year start | First day of fiscal year (e.g., 2024-01-01) | |
| Tax year end | Last day of fiscal year (e.g., 2024-12-31) | |
| Province | Province where head office is located | |
| Type of corporation | Canadian Controlled Private Corporation (CCPC) | Most small businesses |
| First year filing? | Yes/No | |
| Mailing address | Corporation's registered address | |

**Important:** Make sure the BN matches exactly what CRA has on file. An incorrect BN will cause the filing to be rejected.

---

## Shareholder Information

For a single-owner CCPC:

| Field | What to Enter |
|-------|--------------|
| Shareholder name | Owner's full legal name |
| SIN | Optional (but recommended) |
| Number of shares | As per share register (typically 100 common shares) |
| Percentage of shares | 100% |
| Related to other shareholders? | No (if sole shareholder) |

If there are multiple shareholders, add each one with their respective share counts and percentages.

---

## Financial Contact Person

This is the person who prepared or is responsible for the financial information.

| Field | What to Enter |
|-------|--------------|
| Name | Usually the owner/director, or accountant if one prepared the statements |
| Phone | Contact phone number |
| Is this person the same as the authorized signing officer? | Usually Yes for owner-operators |

---

## CRA Questionnaire

TaxTron presents a series of yes/no questions. For a typical small consulting CCPC with no employees, the answers are:

| Question | Typical Answer | Notes |
|----------|---------------|-------|
| Did you pay dividends to shareholders? | No | Unless dividends were actually paid |
| Did you have any capital gains or losses? | No | Unless assets were sold |
| Is this a personal services business? | No | Unless substantially all income is from one client who controls how/when work is done |
| Did you hire eligible apprentices? | No | |
| Did you have any foreign affiliates? | No | |
| Did the corporation receive shareholder loans? | Depends | Yes if shareholder put money INTO the company |
| Did the corporation make loans to shareholders? | Depends | Yes if company transferred money to shareholder's personal account beyond loan repayment |
| Did you have any non-arm's length transactions? | Depends | Transactions with related parties |
| Did you make installment payments? | No | Unless CRA required installments |
| Are you filing an amended return? | No | Unless correcting a prior filing |
| Is the corporation inactive? | No | It earned revenue |
| Does the corporation own land or buildings? | No | Unless it does |
| Did the corporation have any investment income? | No | Unless interest/dividends received |

**For Ontario-specific questions:**
- First-time filer in Ontario? Answer based on filing history
- Eligible for Ontario small business deduction? Yes (for CCPC with < $500K active business income)
- Any Ontario tax credits? Typically No for small consulting firms

---

## Balance Sheet - Assets

Enter each asset using its GIFI code. TaxTron has a dropdown or search for GIFI codes.

**Common entries for a small consulting CCPC:**

| GIFI Code | Description | Amount | Notes |
|-----------|------------|--------|-------|
| 1002 | Cash and deposits | From bank balance at fiscal year end | |
| 1066 | Tax receivable (HST) | HST refund owed by CRA | Only if in refund position |
| 1180 | Prepaid expenses | Lease deposits, prepaid insurance | |
| 1774 | Computer equipment | **GROSS cost** of all computer assets | Combine all items under same GIFI |
| 1800 | Accumulated amortization | **Negative** -- total accumulated CCA to date | |

**Critical notes:**
- TaxTron does NOT allow duplicate GIFI codes. If you have multiple computer assets (e.g., MacBook + printer), combine them into a single 1774 row showing total gross cost.
- Accumulated amortization (1800) is a negative number that reduces total assets.
- Equipment GIFI (1772) is for non-computer equipment. Computer equipment specifically uses 1774.

---

## Balance Sheet - Liabilities

| GIFI Code | Description | Amount | Notes |
|-----------|------------|--------|-------|
| 2600 | Accounts payable | Outstanding bills owed | |
| 2680 | Credit card payable | CC balance at year end | |
| 2980 | Shareholder loans | Due to shareholders | This is a liability of the company |

**Important about shareholder loans (GIFI 2980):**
This represents money the company owes back to the shareholder. It decreases when the company transfers money to the shareholder's personal account (loan repayment). These repayments are NOT expenses and NOT taxable income.

---

## Balance Sheet - Equity

| GIFI Code | Description | Amount |
|-----------|------------|--------|
| 3500 | Common shares | Face value of shares issued (often $100) |
| 3849 | Retained earnings - ending | Opening RE + current year net income/loss |

**Balance sheet MUST balance:** Total Assets = Total Liabilities + Total Equity

If it doesn't balance, the most common fixes are:
1. Check cash balance matches bank statement at year end
2. Verify shareholder loan balance accounts for all transfers during the year
3. Check retained earnings opening balance matches prior year closing
4. Verify no expenses/income items are missing

TaxTron will warn you if the balance sheet doesn't balance. You can proceed by clicking "Ignore" but the return may be flagged by CRA.

---

## Income Statement

Enter revenue and expenses using GIFI codes.

**Revenue:**

| GIFI | Description | Amount |
|------|------------|--------|
| 8000 | Sales of goods and services | Total pre-HST revenue |

**Expenses (enter each on its own line):**

| GIFI | Description | Amount | Notes |
|------|------------|--------|-------|
| 9281 | Motor vehicle - lease | Pre-HST annual lease | Within CRA limit |
| 8810 | Office / software | Pre-HST software subscriptions | |
| 8670 | Professional development | Training, courses, conferences | |
| 8860 | Professional fees | Accounting, legal | |
| 9220 | Transportation | Tolls, transit, parking | |
| 8710 | Interest and bank charges | Bank fees, CC interest, CC annual fee | |
| 8523 | Meals and entertainment | **50% of total** meals expense | Only the deductible half |
| 9200 | Travel | Business trips (pre-HST if domestic) | |
| 9150 | Amortization | Total CCA from Schedule 8 | |

**Critical:** Enter meals & entertainment at the **50% deductible amount**, not the full amount. TaxTron does not automatically halve it.

---

## Schedule 8 - CCA

TaxTron has a dedicated CCA schedule. For each asset class:

| Field | What to Enter |
|-------|--------------|
| Class number | 50, 8, 10, etc. |
| Opening UCC | Undepreciated Capital Cost at start of year (prior year closing UCC) |
| Cost of additions | Total cost of assets added this year (business-use portion only for mixed-use assets) |
| Proceeds of dispositions | Sale price of assets disposed (if any) |
| CCA rate | Auto-filled by TaxTron based on class |
| CCA claimed | TaxTron calculates this with half-year rule; you can claim less but not more |

**For a new filing (first year ever):**
- Opening UCC = $0 for all classes
- Enter the full cost of all assets ever purchased in "additions" if this is the company's first return
- If there are prior years, the opening UCC should match the prior year's closing UCC from the prior T2

**Half-year rule:** TaxTron automatically applies the half-year rule (50% of additions eligible in first year). You don't need to calculate this manually.

---

## Schedule 1 - Net Income Reconciliation {#schedule-1}

This reconciles accounting net income to taxable income. Key adjustments:

| Line | Description | When to Use |
|------|------------|-------------|
| 300 | Net income per financial statements | Always -- this is your starting point |
| 302 | Add back: 50% of meals & entertainment | If you entered the FULL meals amount in expenses (rather than 50%). If you already entered 50%, this line is $0 |
| 404 | Deduct: CCA in excess of accounting amortization | If financial statement amortization differs from CCA claimed |

For most small CCPCs where you entered 50% meals in expenses and CCA matches amortization, Schedule 1 adjustments may be $0, and Line 300 = taxable income (or loss).

---

## Schedule 4 - Loss Continuity {#schedule-4}

Track non-capital losses across years:

| Field | Description |
|-------|------------|
| Non-capital losses from prior years | Sum of all prior year losses not yet applied |
| Current year non-capital loss | This year's loss (if Line 300 is negative) |
| Losses applied in current year | Losses used to offset current year income ($0 if still in loss) |
| Losses available for carryforward | Prior losses + current loss - losses applied |

Non-capital losses can be:
- Carried forward up to **20 years**
- Carried back up to **3 years** (to get a refund of prior taxes paid)

For a company that has never been profitable, all losses accumulate and are available when the company eventually earns income.

---

## Tax Summary & Submission

### Tax Summary Page

For a **loss year**, the tax summary should show:
- Net income: ($X,XXX) -- negative
- Taxable income: $0
- Federal tax: $0
- Provincial tax: $0
- Total tax payable: $0
- Balance owing: $0
- Refund: $0

**All zeros is CORRECT for a loss year.** No tax is owed and no refund is due (unless installments were paid).

### NETFILE Submission

1. Click "File" or "NETFILE" in TaxTron
2. Enter your **Web Access Code (WAC)**
   - Obtain from CRA My Business Account (online)
   - Or call CRA Business Enquiries: 1-800-959-5525
3. TaxTron transmits the return electronically
4. You'll receive a confirmation number -- save this

### If WAC is Not Available

TaxTron can generate a **Barcode Return PDF** for mailing:
1. Click "Print" or "Generate Barcode Return"
2. Print the barcode pages
3. Mail to: Winnipeg Tax Centre, Post Office Box 14001 Station Main, Winnipeg MB R3C 3M3
4. Include all pages generated by TaxTron (do NOT attach financial statements unless requested)

### After Filing

- Save all source documents for **6 years** from the filing date
- File HST returns separately (not part of T2)
- Note the non-capital loss carryforward amount for future years
- If CRA requests additional information, respond within 30 days

---

## Common TaxTron Issues & Solutions

| Issue | Solution |
|-------|---------|
| Balance sheet doesn't balance | Check cash, shareholder loan, and retained earnings. Adjust shareholder loan (GIFI 2980) as it has no tax impact. |
| Can't add duplicate GIFI code | Combine items. E.g., two computers go under one 1774 row with combined total. |
| Tax summary shows all zeros | Correct for loss years. No tax owing = no refund. |
| WAC not available | Use barcode PDF method to mail the return. Or call CRA to get WAC. |
| "Some pre-steps were missing" warning | Check General Information page -- all required fields must be filled. |
| Return rejected by NETFILE | Verify BN is correct, fiscal year dates match CRA records, no duplicate filing for same period. |
