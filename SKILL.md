---
name: canadian-t2-tax
description: "Canadian T2 Corporate Tax Return preparation skill. Use this skill whenever a user needs help with Canadian corporate taxes, T2 filing, HST returns, CRA submissions, corporate financial statements for a CCPC, or mentions TaxTron, NETFILE, GIFI codes, CCA schedules, or any Canadian small business tax work. Also trigger when the user uploads bank statements, credit card statements, invoices, or prior-year financial statements and wants to prepare tax filings. This skill handles the full end-to-end workflow: document intake, Excel workbook preparation, financial statement generation, HST worksheets, missing invoice creation, and step-by-step TaxTron T2 Web filing guidance."
---

# Canadian T2 Corporate Tax Return -- Full Workflow

This skill walks through the complete process of preparing and filing a Canadian T2 corporate income tax return for a CCPC (Canadian Controlled Private Corporation). It is designed to work even with a lower-cost model by providing explicit, structured instructions at every step.

The workflow has 4 phases. Complete them in order, but each phase produces standalone deliverables the user can act on immediately.

## Before You Start

**Required skills to invoke alongside this one:**
- Read the `xlsx` SKILL.md before generating the Excel workbook (Phase 2)
- Read the `docx` SKILL.md before generating Word documents (Phase 3)

**Dependencies:**
- Python 3 with `openpyxl`, `pdfplumber` (install via `pip install openpyxl pdfplumber --break-system-packages`)
- Node.js with `docx` package (install via `npm install docx` in a local project directory if global install fails)

**Key principle:** All dollar amounts on the T2 return and financial statements must be **pre-HST** (divide HST-inclusive amounts by 1.13 for Ontario). HST amounts are tracked separately for the HST return.

---

## Phase 1: Document Intake & Data Extraction

### Goal
Read all source documents the user provides, extract financial data, categorize transactions, and produce a structured summary. Then generate a list of clarification questions.

### Step 1.1: Identify Source Documents

Ask the user to provide (or check uploads for) these document types:

| Document Type | What to Extract | Priority |
|---|---|---|
| Bank statements (PDF) | All deposits (revenue), all withdrawals (expenses), monthly service charges | Critical |
| Credit card statements (PDF) | All charges with dates, merchant names, amounts | Critical |
| Prior-year financial statements | Opening balances (cash, assets, liabilities, retained earnings, shareholder loan) | Critical |
| Prior-year HST return | HST registration status, prior refund/owing | Important |
| Invoices issued | Client names, amounts, HST charged, dates | Important |
| CRA correspondence | Business Number, filing deadlines, demand letters | Important |
| Lease agreements | Monthly amounts, terms (for Tesla/vehicle leases especially) | If applicable |

### Step 1.2: Extract Data from PDFs

Use `pdfplumber` to extract text from each PDF. Read `references/extraction_patterns.md` for common bank statement and credit card statement patterns.

```python
import pdfplumber

def extract_pdf_text(path):
    with pdfplumber.open(path) as pdf:
        return "\n".join(page.extract_text() or "" for page in pdf.pages)
```

For each transaction found, capture: **date, description, amount, credit/debit direction**.

### Step 1.3: Categorize Transactions

Classify every transaction into one of these categories. Read `references/t2_reference.md` for the full GIFI code and T2 line mapping.

**Revenue categories:**
- Consulting/service income (T2 Line 8000)
- Product sales
- Interest income
- Government refunds (HST refunds from CRA -- these are NOT revenue)

**Expense categories (with T2 lines):**
- Motor vehicle lease/expenses (L9281)
- Software & subscriptions (L8810)
- Professional development (L8670)
- Professional fees/accounting (L8860)
- Transportation -- tolls, transit, parking (L9220)
- Bank charges & interest (L8710)
- Meals & entertainment -- 50% deductible (L8523)
- Business travel (L9200)
- Office supplies (L8811)
- Telephone & communication (L8811)
- Capital assets -- DO NOT expense, goes to CCA Schedule 8

**Non-deductible / exclusions:**
- Credit card payments (already tracked in CC statement -- exclude to avoid double-counting)
- Shareholder loan repayments (transfers to personal accounts)
- Personal expenses
- CRA refund deposits (MB-DEP from Hamilton, ON)

### Step 1.4: Generate Clarification Questions

After categorizing, generate questions for anything ambiguous. Read `references/clarification_questions.md` for the full template. Common questions include:

- Unidentified deposits: "What is the source of the $X deposit on [date]? Is this business income?"
- Transfers to personal accounts: "The $X transfer to account [number] on [date] -- is this a shareholder loan repayment, salary, or dividend?"
- Mixed-use assets: "What percentage of [asset] is used for business purposes?"
- Missing invoices: "There are deposits totalling $X without corresponding invoices. Who were the clients?"
- Vehicle use: "Is the leased vehicle used for any personal trips? CRA requires a standby charge benefit if so."

Present these as a numbered checklist the user can answer. Wait for answers before proceeding to Phase 2.

---

## Phase 2: Excel Workbook Preparation

### Goal
Create a comprehensive Excel workbook that serves as the single source of truth for all tax numbers. This workbook feeds into Phase 3 (documents) and Phase 4 (TaxTron filing).

### Read the xlsx SKILL.md first!

Before writing any openpyxl code, read the `xlsx` skill's SKILL.md for formatting standards, color coding conventions, and formula rules.

### Workbook Structure

Create these sheets in order:

#### Sheet 1: "Opening Position"
Prior-year balance sheet and income statement (from prior financial statements).

| Item | Amount ($) | Notes |
|---|---|---|
| **BALANCE SHEET** | | |
| Cash | | From prior year bank balance |
| Prepaid Expenses | | |
| HST Receivable | | |
| Computer Equipment (Net) | | Opening UCC for CCA |
| Accounts Payable | | |
| Credit Card Payable | | |
| HST Payable | | |
| Due to Shareholders | | Shareholder loan balance |
| Common Shares | | |
| Retained Earnings | | |
| **INCOME STATEMENT** | | |
| Revenue | | |
| Total Expenses | | |
| Net Income / (Loss) | | |

#### Sheet 2: "Income & Invoice Summary"
All revenue deposits with HST breakdown and invoice cross-reference.

Columns: Date | Gross Received ($) | HST Portion ($) | Net Income ($) | Source/Invoice | Invoiced? | Notes

**Key rule:** For deposits where HST status is unclear, assume HST-included and calculate: Net = Gross / 1.13, HST = Gross - Net.

#### Sheet 3: "Bank Statement" (one per fiscal year)
All bank transactions, categorized.

Columns: Month | Date | Description | Withdrawal ($) | Deposit ($) | Category | Tax Treatment

Include a SUMMARY section at the bottom with totals by category.

#### Sheet 4: "Tax Summary" (one per fiscal year)
The master expense summary with T2 line mapping.

Columns: Category | Tax Treatment | T2 Line | Total Spent ($) | Deductible ($) | Notes

Also include a CCA section:

| Asset | Class | Rate | Cost ($) | Business % | First Year CCA ($) |
|---|---|---|---|---|---|

And a monthly credit card breakdown section.

#### Sheet 5: "Notes & Action Items"
Key filing notes, deadlines, flags, and action items.

### Formatting Requirements
- Use blue text for user-editable inputs (hardcoded numbers)
- Use black text for all formulas
- Yellow background for cells needing user attention (FLAG items)
- Currency format: $#,##0 with negative in parentheses
- Include data validation notes on FLAG items
- Freeze top rows for headers
- Auto-fit column widths

### Save Location
Save to the user's workspace folder as `[CompanyName]_Tax_[Years].xlsx`.

---

## Phase 3: Financial Statements & Supporting Documents

### Goal
Generate professional Word documents: financial statements, HST return worksheets, and missing invoices. These support the T2 filing and CRA record-keeping requirements.

### Read the docx SKILL.md first!

Before writing any docx-js code, read the `docx` skill's SKILL.md for document creation patterns, table formatting, and validation steps.

### Document 1: Financial Statements (.docx)

Read `references/financial_statements_template.md` for the complete structure and formatting specifications. The document must contain:

1. **Title Page** -- Company name, "Financial Statements", fiscal year, "(Unaudited)", BN, address
2. **Balance Sheet** -- Assets, Liabilities, Shareholders' Equity with current and prior year columns. MUST BALANCE (Assets = Liabilities + Equity).
3. **Income Statement** -- Revenue, itemized expenses, net income/loss with current and prior year
4. **Schedule 8 - CCA** -- Each asset class with opening UCC, additions, CCA rate, CCA claimed, closing UCC. Apply half-year rule on additions.
5. **Notes to Financial Statements** -- 8-10 notes covering: nature of operations, basis of presentation, accounting policies, revenue, significant expenses, shareholder loan, non-capital losses, HST registration, income tax
6. **T2 Filing Summary** -- Key line items and a filing checklist

### Document 2: HST Return Worksheets & Missing Invoices (.docx)

Read `references/hst_worksheet_template.md` for the complete structure. The document must contain:

**For each fiscal year:**
1. **Section A: HST Collected** -- Every revenue deposit with gross/net/HST breakdown
2. **Section B: Input Tax Credits (ITCs)** -- Every deductible expense category with HST calculated. Note: bank charges (exempt), public transit (zero-rated), US expenses (no HST), meals (50% ITC restriction)
3. **Section C: Net HST Calculation** -- Line 105 (collected) minus Line 108 (ITCs) = Line 109 (net/refund)

**Missing invoices section:**
- One invoice per page for each undocumented income deposit
- Include: company letterhead, invoice number, date, "Bill To" (flagged for user to complete), line items with HST breakdown, payment confirmation note

### CCA Half-Year Rule Reference

When an asset is acquired during the year, only half the addition is eligible for CCA in the first year:
```
First-year CCA = Rate x (Opening UCC + (Additions / 2))
```

Common classes:
- **Class 50 (55%)**: Computers, laptops, servers
- **Class 8 (20%)**: Office equipment, furniture, printers, 3D printers
- **Class 10 (30%)**: Motor vehicles (if owned, not leased)
- **Class 12 (100%)**: Software (under $500), tools

### HST Rules Quick Reference

| Item | HST Treatment for ITCs |
|---|---|
| Most business purchases | Full ITC (amount / 1.13 x 0.13) |
| Meals & entertainment | 50% of HST only |
| Bank charges, interest | Exempt -- no HST, no ITC |
| Public transit | Zero-rated -- no HST |
| Foreign purchases (US) | No Canadian HST applies |
| Mixed-use assets | ITC proportional to business use % |
| Capital assets | Full ITC in year of purchase (even if CCA is spread over years) |

---

## Phase 4: TaxTron T2 Web Filing Guide

### Goal
Provide a step-by-step guide for entering all data into TaxTron T2 Web (netfilet2.taxtron.ca) and submitting via NETFILE.

Read `references/taxtron_filing_guide.md` for the complete page-by-page walkthrough.

### Overview of TaxTron Sections

The user navigates through these sections in order. For each section, tell the user exactly what to enter in each field based on the Excel workbook data.

1. **General Information** -- Corporation name, BN, fiscal year dates, province, CCPC status
2. **Shareholder Information** -- Name, SIN (optional), shares held, relationship
3. **Financial Person** -- Person who prepared the financial information
4. **CRA Questions** -- Series of yes/no questions about the corporation's activities
5. **Assets (GIFI)** -- Balance sheet asset items with GIFI codes
6. **Liabilities (GIFI)** -- Balance sheet liability items with GIFI codes
7. **Equity (GIFI)** -- Retained earnings, common shares
8. **Revenue/Expenses (GIFI)** -- Income statement items
9. **Schedule 8 - CCA** -- Capital cost allowance for each asset class
10. **Schedule 1 - Net Income Reconciliation** -- Adjustments from accounting to tax income
11. **Schedule 4 - Loss Continuity** -- Non-capital loss tracking
12. **Tax Summary** -- Final review before submission

### NETFILE Submission

- Requires a **Web Access Code (WAC)** from CRA
- WAC can be obtained from: CRA My Business Account, or by calling 1-800-959-5525
- If WAC is unavailable, TaxTron can generate a barcode PDF for mailing to CRA
- Mailing address: Winnipeg Tax Centre, Post Office Box 14001 Station Main, Winnipeg MB R3C 3M3

### Important Tax Concepts for Loss Years

When a corporation has a net loss:
- Taxable income = $0 (losses cannot make it negative on the return)
- Federal tax = $0, Provincial tax = $0
- No refund (unless installments were paid)
- The loss becomes a **non-capital loss** that can be carried forward 20 years or back 3 years
- Tax summary showing all zeros is CORRECT for a loss year

---

## Quality Checklist

Before delivering any files to the user, verify:

- [ ] Balance sheet balances (Assets = Liabilities + Equity) for every year
- [ ] All amounts on T2 and financial statements are pre-HST
- [ ] CCA half-year rule is applied correctly on first-year additions
- [ ] Meals & entertainment are at 50% deduction on T2, 50% ITC on HST
- [ ] Credit card payments are excluded from bank statement expenses (avoid double-counting)
- [ ] Shareholder loan repayments are NOT listed as expenses
- [ ] CRA refund deposits (MB-DEP) are NOT listed as revenue
- [ ] Non-capital loss carryforward is calculated correctly (sum of all loss years)
- [ ] HST worksheet net = HST collected - ITCs (should be negative/refund if expenses >> revenue)
- [ ] Missing invoices have HST breakdown and "ACTION REQUIRED" flag for client details
- [ ] All files saved to user's workspace folder with descriptive names
