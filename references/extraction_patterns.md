# PDF Extraction Patterns for Canadian Bank & Credit Card Statements

## Overview

Source documents come in various PDF formats. This reference covers common patterns for extracting transaction data from Canadian bank statements and credit card statements using `pdfplumber`.

## General Extraction Approach

```python
import pdfplumber
import re
from datetime import datetime

def extract_all_pdfs(upload_dir):
    """Extract text from all PDFs in the upload directory."""
    import glob
    results = {}
    for pdf_path in sorted(glob.glob(f"{upload_dir}/*.pdf")):
        filename = os.path.basename(pdf_path)
        with pdfplumber.open(pdf_path) as pdf:
            text = "\n".join(page.extract_text() or "" for page in pdf.pages)
            results[filename] = text
    return results
```

## Scotiabank Business Checking Statements

### Pattern: "Banking Statement - [Month] [Year].pdf"

These statements typically contain:
- Header with account number and period
- Transaction table with columns: Date | Description | Withdrawals | Deposits | Balance

### Extraction regex patterns:
```python
# Match transaction lines
# Format: MM/DD  Description  Amount  Amount  Balance
SCOTIA_PATTERN = r'(\d{2}/\d{2})\s+(.+?)\s+(\d[\d,]*\.\d{2})?\s+(\d[\d,]*\.\d{2})?\s+(\d[\d,]*\.\d{2})'

# Common Scotiabank descriptions
TESLA_LEASE = r'BUSINESS PAD.*Tesla'
INTERAC_RECEIVED = r'CREDIT MEMO.*Interac.*Transfer'
INTERAC_SENT = r'(DEBIT MEMO|INTERAC SENT)'
BANK_CHARGE = r'Bank Service Charge'
CC_PAYMENT = r'(PC Bill Payment|Credit Card Payment)'
MB_DEP = r'MB-DEP'  # CRA government deposits
MB_TRANSFER = r'MB-TRANSFER'  # Internal transfers
```

### Key patterns to watch for:
- **MB-DEP from Hamilton ON**: These are CRA refund deposits. NOT business income.
- **PC Bill Payment / Credit Card Payment**: These are payments to the credit card. Exclude from expense totals (expenses are on the CC statement).
- **MB-TRANSFER to another account**: Shareholder loan repayments or internal transfers.

## Credit Card Statements (e-Statements)

### Pattern: "[Month] [Year] e-Statement.pdf"

Credit card statements typically show:
- Statement period and payment due date
- Previous balance, payments, purchases, interest
- Transaction list: Date | Description | Amount

### Extraction approach:
```python
# CC statements often have two date columns (transaction date, posting date)
CC_PATTERN = r'(\w{3}\s+\d{1,2})\s+(\w{3}\s+\d{1,2})\s+(.+?)\s+\$?([\d,]+\.\d{2})'

# Or simpler single-date format
CC_SIMPLE = r'(\w{3}\s+\d{1,2})\s+(.+?)\s+\$?([\d,]+\.\d{2})'
```

### Categorization by merchant name:
```python
MERCHANT_CATEGORIES = {
    # Software & AI
    r'(OPENAI|CHATGPT|ANTHROPIC|CLAUDE|GITHUB|COPILOT|NOTION|FIGMA)': 'Software & AI Subscriptions',
    r'(LINKEDIN|COURSERA|UDEMY)': 'Professional Development',
    r'(GODADDY|NAMECHEAP|CLOUDFLARE|AWS|DIGITAL.OCEAN)': 'Business Registration & Legal',

    # Transportation
    r'407\s*ETR': 'Transportation (407 ETR)',
    r'(PRESTO|TTC|GO TRANSIT|METROLINX)': 'Transportation (Transit)',
    r'(PARKING|IMPARK|GREEN P|HONK)': 'Transportation (Parking)',

    # Meals
    r'(RESTAURANT|CAFE|COFFEE|STARBUCKS|TIM HORTONS|MCDONALD|UBER EATS|DOORDASH|SKIP)': 'Meals & Entertainment',

    # Bank
    r'(ANNUAL FEE|INTEREST CHARGE|LATE FEE)': 'Bank Charges & Fees',

    # Capital assets (flag for CCA)
    r'(APPLE\.COM|APPLE STORE|BEST BUY|CANADA COMPUTERS)': 'FLAG: Capital Asset?',

    # Personal (common non-business)
    r'(NETFLIX|SPOTIFY|AMAZON\.CA|WALMART|GROCERY|LOBLAWS|COSTCO)': 'FLAG: Personal?',
}
```

## Prior Year Financial Statements

### Pattern: "[Company] Dec [Year] Fin Stmts.pdf"

These are accountant-prepared financial statements. Key items to extract:
- Balance sheet items (cash, prepaid, equipment, AP, shareholder loan, RE)
- Income statement items (revenue, expenses by category, net income)
- CCA schedule (opening/closing UCC by class)

### Extraction approach:
Financial statements are less structured than bank statements. Look for:
```python
# Dollar amounts near key words
BALANCE_ITEMS = {
    r'[Cc]ash': 'Cash',
    r'[Pp]repaid': 'Prepaid Expenses',
    r'HST.*[Rr]eceivable': 'HST Receivable',
    r'[Cc]omputer': 'Computer Equipment',
    r'[Aa]ccounts [Pp]ayable': 'Accounts Payable',
    r'[Cc]redit [Cc]ard': 'Credit Card Payable',
    r'[Dd]ue to [Ss]hareholder': 'Due to Shareholders',
    r'[Cc]ommon [Ss]hares': 'Common Shares',
    r'[Rr]etained [Ee]arnings': 'Retained Earnings',
}

DOLLAR_PATTERN = r'\$?\s*([\d,]+(?:\.\d{2})?)'
```

## HST Returns

### Pattern: "HST [Year].pdf"

Prior HST returns confirm:
- HST registration status
- Filing frequency (annual vs quarterly)
- Prior year HST collected, ITCs claimed, refund/owing
- HST account number (same BN with RT suffix)

## Invoice PDFs

### Pattern: "Invoice [Client] [Date].pdf"

Extract:
- Invoice number
- Client name and address
- Service description
- Subtotal (pre-HST)
- HST amount
- Total
- Payment date

## CRA Correspondence

Look for:
- Business Number (9 digits + RC0001 or RT0001)
- Filing deadlines
- Demand to file notices
- Assessment notices with amounts owing

## Tips for Robust Extraction

1. **Always try `extract_text()` first** -- it works for most PDFs.
2. **If text extraction fails**, try `extract_tables()` for tabular data.
3. **For scanned PDFs** (image-based), you'll need OCR. Try `pdfplumber` first; if empty, the PDF is likely scanned.
4. **HEIC files** (iPhone photos): Convert to PNG using `pillow-heif` before reading.
5. **Amounts may have commas**: Always strip commas before converting to float.
6. **Watch for negative amounts**: Credits may appear as negative numbers or in a separate column.
7. **Multi-page statements**: Process all pages and concatenate before parsing.
