# Financial Statements Document Template

This template defines the structure and formatting for the financial statements Word document (.docx). Use the `docx` npm library (docx-js) to generate.

## Document Settings

- Page size: US Letter (12240 x 15840 DXA)
- Margins: 1 inch all sides (1440 DXA)
- Content width: 9360 DXA
- Font: Arial throughout
- Body text: 11pt (size: 22 in docx-js half-points)
- Colors: Navy headers (#1F4E79), gray subtitles (#666666)

## Page 1: Title Page

Center-aligned, with vertical spacing:

```
[Company Legal Name]           -- 24pt bold, navy
Financial Statements           -- 18pt, navy
For the Year Ended [Date]      -- 14pt, gray
(Unaudited - Prepared for Management Use)  -- 11pt italic, light gray

Business Number: [BN]
Address: [Address]
Prepared: [Month Year]
```

## Page 2-3: Balance Sheet

### Header
```
BALANCE SHEET
As at [Fiscal Year End Date]    -- italic, gray
```

### Assets Table
3 columns: Description (4200 DXA) | Current Year (2580 DXA) | Prior Year (2580 DXA)

Structure:
```
[Header Row: navy background, white text]
                              | 2024      | 2023
Current Assets
  Cash and Bank Deposits      | $XX,XXX   | $XX,XXX
  Prepaid Expenses            | $X,XXX    | $X,XXX
  HST Receivable              | $X,XXX    | $X,XXX
Total Current Assets          | $XX,XXX   | $XX,XXX    [gray background]
                              |           |
Capital Assets
  Computer Equipment (Gross)  | $X,XXX    | $X,XXX
  Less: Accumulated Amort.    | ($X,XXX)  | ($X,XXX)
Total Capital Assets (Net)    | $X,XXX    | $X,XXX     [gray background]
                              |           |
TOTAL ASSETS                  | $XX,XXX   | $XX,XXX    [blue background, bold]
```

### Liabilities Table
Same column widths. Structure:
```
Current Liabilities
  Accounts Payable            | $XXX      | $XXX
  Credit Card Payable         | $XXX      | $XXX
  Due to Shareholders         | $X,XXX    | $XX,XXX
Total Liabilities             | $X,XXX    | $XX,XXX    [gray background]

SHAREHOLDERS' EQUITY
  Common Shares               | $100      | $100
  Retained Earnings           | $XX,XXX   | $XX,XXX
Total Equity                  | $XX,XXX   | $XX,XXX    [gray background]

TOTAL LIABILITIES & EQUITY    | $XX,XXX   | $XX,XXX    [blue background, bold]
```

**CRITICAL CHECK:** The TOTAL ASSETS row must equal the TOTAL LIABILITIES & EQUITY row for both years.

## Page 4: Income Statement

3 columns: Description (4680 DXA) | Current Year (2340 DXA) | Prior Year (2340 DXA)

```
Revenue
  Consulting Revenue (pre-HST) | $X,XXX   | $X,XXX
Total Revenue                  | $X,XXX   | $X,XXX    [gray background]

Expenses
  [Each expense category]      | $X,XXX   | --
  ...
Total Expenses                 | $XX,XXX  | $XX,XXX   [gray background]

NET INCOME (LOSS)              | ($XX,XXX)| ($X,XXX)  [blue background, bold]
```

Use "--" for prior year expense detail if not available (just show the total).

## Page 5: Schedule 8 - CCA

6 columns: Asset Class | Rate | Opening UCC | Additions | CCA Claimed | Closing UCC

Include a notes section below the table explaining each asset class entry.

## Pages 6-7: Notes to Financial Statements

Include these notes (adjust content based on actual company situation):

### Note 1: Nature of Operations
Describe what the company does, where it's incorporated, HST registration status.

### Note 2: Basis of Presentation
State: unaudited, historical cost basis, ASPE standards (Canadian accounting standards for private enterprises), prepared for management and CRA filing.

### Note 3: Significant Accounting Policies
Cover: revenue recognition (when services rendered), CCA method (declining balance at CRA rates, half-year rule), income tax treatment (CCPC, small business deduction eligibility).

### Note 4: Revenue
Total revenue, pre-HST, primary clients.

### Note 5: Significant Expenses
Describe the largest expense category (usually motor vehicle lease). Include CRA limits and how the company's expense compares.

### Note 6: Due to Shareholders
Opening balance, closing balance, explanation that transfers are loan repayments (not taxable income, not deductible expense).

### Note 7: Non-Capital Losses
List each year's loss, total available for carryforward, 20-year rule, note that no tax payable in current year.

### Note 8: HST Registration
State that HST returns are filed separately, company is in refund or owing position.

### Note 9: Income Tax
State whether tax is payable. For loss years: no federal or provincial tax payable, no installments paid, no refund due.

## Page 8: T2 Filing Summary

2-column table: Item | Amount

List key T2 return lines and amounts, then a numbered filing checklist with action items.

## Formatting Details

### Table Styling
- Header rows: Navy (#1F4E79) background, white bold text, centered
- Subtotal rows: Light gray (#F2F2F2) background
- Total rows: Light blue (#D6E4F0) background, bold text
- Cell borders: Light gray (#999999), single line, 1pt
- Cell padding: top/bottom 60 DXA, left/right 100 DXA
- Number alignment: Right-aligned
- Negative numbers: In parentheses with $ sign, e.g., ($1,234)

### Header/Footer
- Header: Company name (left) + "Financial Statements - Year Ended [Date]" (right), 9pt gray
- Footer: "Unaudited - Prepared for Management Use" (left) + "Page X" (right), 8pt gray italic
- Use TabStopType.RIGHT with TabStopPosition.MAX for right-aligned elements

### Page Breaks
- New page for each major section (Balance Sheet, Income Statement, CCA, Notes, Filing Summary)
- Use `new Paragraph({ children: [new PageBreak()] })` between sections
