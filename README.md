# canadian-t2-tax-skill
Canadian T2 Corporate Tax Return preparation skill. Use this skill whenever a user needs help with Canadian corporate taxes, T2 filing, HST returns, CRA submissions, corporate financial statements for a CCPC, or mentions TaxTron, NETFILE, GIFI codes, CCA schedules, or any Canadian small business tax work. Also trigger when the user uploads bank statements, credit card statements, invoices, or prior-year financial statements and wants to prepare tax filings. This skill handles the full end-to-end workflow: document intake, Excel workbook preparation, financial statement generation, HST worksheets, missing invoice creation, and step-by-step TaxTron T2 Web filing guidance.

### SKILL.md (300 lines) -- the main workflow with 4 phases:

- Phase 1: Document Intake & Data Extraction -- reads all uploaded PDFs (bank statements, CC statements, invoices, prior financials, HST returns), extracts transactions, categorizes them by T2 line, and generates a tailored list of clarification questions before proceeding.
- Phase 2: Excel Workbook Preparation -- creates the multi-sheet tax workbook (Opening Position, Income & Invoice Summary, Bank Statement, Tax Summary with CCA, Notes & Action Items) using openpyxl with proper formatting.
- Phase 3: Financial Statements & Supporting Documents -- generates professional .docx files: financial statements (balance sheet, income statement, CCA schedule, 9 notes), HST return worksheets (collected vs ITCs for each year), and template invoices for any undocumented income.
- Phase 4: TaxTron T2 Filing Guide -- page-by-page walkthrough of every TaxTron section with exactly what to enter in each field.

6 reference files covering GIFI codes, CCA classes, T2 line mappings, TaxTron step-by-step guide, clarification question templates, PDF extraction patterns, and document formatting specs.
