# HST Return Worksheet Template

This template defines the structure for the HST return worksheet and missing invoices document (.docx).

## Document Structure

The document contains multiple sections:
1. HST Worksheet for each fiscal year
2. Missing Invoices section (if applicable)

## HST Worksheet Layout (Per Year)

### Title Block (centered)
```
[Company Name]                           -- 18pt bold, navy
HST Return Worksheet - [Year]            -- 14pt, navy
Reporting Period: [Start] - [End]        -- 11pt, gray
BN: [Business Number]                    -- 10pt, gray
```

### Section A: HST Collected on Revenue

5-column table: Date | Description | Gross ($) | Net ($) | HST ($)

For each revenue deposit:
- If invoice exists with explicit HST: use the invoice amounts
- If HST status is unclear: assume HST-included, calculate Net = Gross / 1.13, HST = Gross - Net
- Joe Zhou invoices at $750 typically have HST = $86.28

**Important exclusions from revenue:**
- MB-DEP deposits from Hamilton, ON = CRA refunds, NOT revenue
- Credit card payment reversals / credits
- Internal transfers

Include a TOTAL row with blue background.

Below the table:
```
Line 101 (Total Revenue): $[net total]
Line 105 (HST Collected): $[hst total]
```

### Section B: Input Tax Credits (ITCs)

5-column table: Expense Category | Gross ($) | ITC ($) | HST? | Note

For each expense category, calculate the HST/ITC:

**Full ITC items:**
```
ITC = Gross / 1.13 * 0.13  (equivalently: Gross - Gross/1.13)
```

**Special ITC rules:**
| Category | ITC Rule |
|----------|---------|
| Most business purchases | Full ITC |
| Meals & entertainment | 50% of HST amount only |
| Bank charges, interest | Exempt - $0 ITC |
| Public transit fares | Zero-rated - $0 ITC |
| Foreign purchases (USD) | No Canadian HST - $0 ITC |
| Mixed-use assets (e.g., 75% business) | ITC x business use % |
| Capital assets (MacBook, etc.) | Full ITC in year of purchase |
| Insurance | Exempt - $0 ITC |
| Rent (commercial) | Full ITC |
| Professional fees | Full ITC (if provider is HST-registered) |

Include a TOTAL ITCs row with blue background.

Below: `Line 108 (Total ITCs): $[total]`

### Section C: Net HST Calculation

2-column summary table:

```
Line 105: HST Collected           | $XXX.XX
Line 108: Total ITCs              | ($X,XXX.XX)
Line 109: Net Tax (Refund)        | ($X,XXX.XX)
```

If Line 109 is negative, the company is in a refund position. Display:
```
EXPECTED HST REFUND: $X,XXX.XX    -- centered, green bold text
```

If positive:
```
HST OWING TO CRA: $X,XXX.XX       -- centered, red bold text
```

### Notes Section

Include relevant notes for each year:
- Clarify MB-DEP deposits are CRA refunds
- Note any assumptions about HST on unclear deposits
- Note the 50% M&E restriction
- Note any expenses where HST status is uncertain (e.g., accounting fees -- depends on whether the accountant is HST-registered)
- Remind user to file via CRA My Business Account or Form GST34

---

## Missing Invoices Section

### Section Header (centered)
```
[Company Name]
Missing Invoices for [Year] Consulting Income
These invoices should be completed with client details and retained for CRA records.
```

Brief explanatory paragraph about why these invoices are needed.

### Individual Invoice Layout (one per page)

```
[Company Name]                              -- 16pt bold, navy
[Address]                                   -- 10pt gray
Phone: [Phone] | BN: [BN]                  -- 10pt gray
─────────────────────────────────────────── -- navy divider line

                                    INVOICE -- 18pt bold, navy, right-aligned

Bill To:                            Invoice #: [YYYY-NNN]
[ACTION REQUIRED - Client Name]     Date: [Invoice Date]
[ACTION REQUIRED - Client Address]  Payment: Received (Interac e-Transfer)

┌─────────────────┬─────┬──────────┬──────────┐
│ Description      │ Qty │ Rate     │ Amount   │
├─────────────────┼─────┼──────────┼──────────┤
│ Technology       │ 1   │ $[net]   │ $[net]   │
│ Consulting       │     │          │          │
│ Services         │     │          │          │
├─────────────────┼─────┼──────────┼──────────┤
│                  │     │ Subtotal:│ $[net]   │
│                  │     │ HST(13%):│ $[hst]   │
│                  │     │ TOTAL:   │ $[gross] │  -- blue background
└─────────────────┴─────┴──────────┴──────────┘

Payment received via Interac e-Transfer. Thank you for your business.

ACTION REQUIRED: Update the client name and address fields above
before filing with CRA.                     -- red text
```

### Invoice Numbering

Use sequential numbering: [YEAR]-[NNN]
- Start after the last known invoice number for that year
- If Joe Zhou invoices were 2024-001 and 2024-002, start missing invoices at 2024-003

### Calculations per Invoice
```
Net (pre-HST) = Gross Deposit / 1.13
HST = Gross Deposit - Net
```

---

## Filing Instructions Reminder

At the end of the document, include:

**How to File HST Returns:**
1. Log in to CRA My Business Account (https://www.canada.ca/en/revenue-agency/services/e-services/e-services-businesses/business-account.html)
2. Select "File a return" under GST/HST
3. Enter the figures from the worksheet above
4. Submit electronically

Or mail Form GST34 to the CRA tax centre for your region.

**Filing Deadline:** 3 months after the fiscal year end for annual filers. For a Dec 31 year-end, HST is due by March 31.

**Late Filing:** If overdue, file immediately. Penalty is 1% of owing + 0.25%/month. If in a refund position, there is no penalty for late filing but you should still file promptly.
