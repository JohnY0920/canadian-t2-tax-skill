#!/usr/bin/env node
/**
 * Generate Financial Statements + HST Worksheets + Missing Invoices
 *
 * This script creates two Word documents from a JSON data file:
 *   1. [Company]_Financial_Statements.docx
 *   2. [Company]_HST_Worksheets_Invoices.docx
 *
 * Usage:
 *   1. Create a data.json file with all financial data (see DATA_SCHEMA below)
 *   2. Run: node generate_documents.js data.json
 *
 * Prerequisites: npm install docx (in the script's directory)
 */

const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, BorderStyle, WidthType,
        ShadingType, PageNumber, PageBreak, TabStopType, TabStopPosition } = require('docx');

// ── Constants ──
const PAGE_WIDTH = 12240;
const MARGINS = { top: 1440, right: 1440, bottom: 1440, left: 1440 };
const CONTENT_WIDTH = PAGE_WIDTH - MARGINS.left - MARGINS.right;
const FONT = "Arial";
const BORDER = { style: BorderStyle.SINGLE, size: 1, color: "999999" };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const NO_BORDER = { style: BorderStyle.NONE, size: 0 };
const NO_BORDERS = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER };
const CELL_MARGINS = { top: 60, bottom: 60, left: 100, right: 100 };
const HEADER_FILL = { fill: "1F4E79", type: ShadingType.CLEAR };
const ALT_FILL = { fill: "F2F2F2", type: ShadingType.CLEAR };
const TOTAL_FILL = { fill: "D6E4F0", type: ShadingType.CLEAR };

// ── Helper Functions ──
function txt(text, opts = {}) {
  return new TextRun({ text: String(text), font: FONT, size: opts.size || 22, ...opts });
}
function boldTxt(text, opts = {}) { return txt(text, { bold: true, ...opts }); }
function whiteTxt(text, opts = {}) { return txt(text, { bold: true, color: "FFFFFF", ...opts }); }

function para(children, opts = {}) {
  return new Paragraph({ children: Array.isArray(children) ? children : [children], ...opts });
}
function emptyPara() { return para([txt("")]); }

function headerCell(text, width) {
  return new TableCell({
    borders: BORDERS, width: { size: width, type: WidthType.DXA },
    shading: HEADER_FILL, margins: CELL_MARGINS,
    children: [para([whiteTxt(text, { size: 20 })], { alignment: AlignmentType.CENTER })]
  });
}

function cell(children, width, opts = {}) {
  const align = opts.align || AlignmentType.LEFT;
  const sz = opts.fontSize || 20;
  const content = typeof children === 'string' ? [txt(children, { size: sz })] : children;
  return new TableCell({
    borders: BORDERS, width: { size: width, type: WidthType.DXA },
    margins: CELL_MARGINS, shading: opts.shading || undefined,
    children: [para(content, { alignment: align })]
  });
}

function fmtDollars(value) {
  if (typeof value !== 'number') return String(value);
  return value < 0
    ? `($${Math.abs(value).toLocaleString('en-CA', {minimumFractionDigits: 0, maximumFractionDigits: 0})})`
    : `$${value.toLocaleString('en-CA', {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
}

function fmtDollars2(value) {
  if (typeof value !== 'number') return String(value);
  return value < 0
    ? `($${Math.abs(value).toFixed(2)})`
    : `$${value.toFixed(2)}`;
}

function numCell(value, width, opts = {}) {
  return cell([txt(fmtDollars(value), { size: opts.fontSize || 20 })], width, { align: AlignmentType.RIGHT, ...opts });
}

function numCell2(value, width, opts = {}) {
  return cell([txt(fmtDollars2(value), { size: opts.fontSize || 20 })], width, { align: AlignmentType.RIGHT, ...opts });
}

function sectionHeading(text) {
  return para([boldTxt(text, { size: 26, color: "1F4E79" })], {
    spacing: { before: 300, after: 150 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: "1F4E79", space: 4 } }
  });
}

function makeDoc(sections, companyName, docTitle) {
  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 22 } } } },
    sections: [{
      properties: {
        page: { size: { width: PAGE_WIDTH, height: 15840 }, margin: MARGINS }
      },
      headers: {
        default: new Header({
          children: [para([
            txt(companyName, { size: 18, color: "999999" }),
            new TextRun({ text: `\t${docTitle}`, font: FONT, size: 18, color: "999999" }),
          ], { tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }] })]
        })
      },
      footers: {
        default: new Footer({
          children: [para([
            txt("Unaudited - Prepared for Management Use", { size: 16, italics: true, color: "999999" }),
            new TextRun({ text: "\tPage ", font: FONT, size: 16, color: "999999" }),
            new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: "999999" }),
          ], { tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }] })]
        })
      },
      children: sections
    }]
  });
}

async function saveDoc(doc, outputPath) {
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Created: ${outputPath} (${buffer.length} bytes)`);
}

// ══════════════════════════════════════════════════════════
// DATA SCHEMA -- The model fills this JSON before running
// ══════════════════════════════════════════════════════════
/*
{
  "company": {
    "name": "Company Name",
    "bn": "123456789RC0001",
    "address": "123 Main St, City, ON",
    "phone": "416-555-1234",
    "fiscal_year_end": "December 31, 2024"
  },
  "balance_sheet": {
    "current_year": {
      "cash": 28045, "prepaid": 6101, "hst_receivable": 1749,
      "equipment_gross": 6903, "accumulated_amort": 2910,
      "ap": 800, "cc_payable": 173, "due_to_shareholders": 6923,
      "common_shares": 100, "retained_earnings": 31892
    },
    "prior_year": {
      "cash": 54623, "prepaid": 6101, "hst_receivable": 3398,
      "equipment_gross": 2147, "accumulated_amort": 1770,
      "ap": 800, "cc_payable": 173, "due_to_shareholders": 18845,
      "common_shares": 100, "retained_earnings": 44581
    },
    "prior_year_label": "2023"
  },
  "income_statement": {
    "revenue": 5027, "revenue_description": "Consulting Revenue (pre-HST)",
    "expenses": [
      {"name": "Tesla Lease (Motor Vehicle)", "amount": 9190},
      {"name": "Software & AI Subscriptions", "amount": 3086}
    ],
    "prior_year": { "revenue": 4333, "total_expenses": 12756, "net_income": -8423 }
  },
  "cca": [
    {"class": 50, "name": "Computer", "rate": 0.55, "opening_ucc": 377, "additions": 4756},
    {"class": 8, "name": "Equipment", "rate": 0.20, "opening_ucc": 0, "additions": 706}
  ],
  "notes": {
    "nature": "Technology consulting, AI development, data science services",
    "motor_vehicle": "Tesla leased at $865.93/month including HST",
    "motor_vehicle_monthly_prehst": 766,
    "cra_monthly_limit": 1050,
    "shareholder_loan_opening": 18845,
    "shareholder_loan_closing": 6923,
    "prior_ncl": 8423,
    "ncl_years": [{"year": 2023, "loss": 8423}]
  },
  "hst_years": [
    {
      "year": 2024,
      "revenue_items": [
        {"date": "Jan 15", "desc": "Invoice - Client", "gross": 750, "hst": 86.28}
      ],
      "itc_items": [
        {"category": "Tesla Lease", "gross": 10391.16, "hst": 1195.44, "note": "Pre-HST $9,195.72"}
      ],
      "notes": ["Note 1 text", "Note 2 text"]
    }
  ],
  "missing_invoices": [
    {"num": "2024-003", "date": "March 5, 2024", "gross": 50}
  ],
  "filing_checklist": [
    "Obtain WAC from CRA",
    "Complete NETFILE via TaxTron"
  ],
  "output_dir": "/path/to/output/"
}
*/

// ── Main ──
async function main() {
  const dataPath = process.argv[2];
  if (!dataPath) {
    console.error("Usage: node generate_documents.js <data.json>");
    console.error("\nCreate a data.json file following the schema in this script, then run again.");
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const co = data.company;
  const bs = data.balance_sheet;
  const is_ = data.income_statement;

  // ════════════════════════════════════════
  // DOCUMENT 1: Financial Statements
  // ════════════════════════════════════════
  const sections = [];

  // Title page
  sections.push(
    emptyPara(), emptyPara(), emptyPara(), emptyPara(), emptyPara(),
    para([boldTxt(co.name, { size: 48, color: "1F4E79" })], { alignment: AlignmentType.CENTER }),
    emptyPara(),
    para([txt("Financial Statements", { size: 36, color: "1F4E79" })], { alignment: AlignmentType.CENTER }),
    para([txt(`For the Year Ended ${co.fiscal_year_end}`, { size: 28, color: "666666" })], { alignment: AlignmentType.CENTER }),
    emptyPara(), emptyPara(),
    para([txt("(Unaudited - Prepared for Management Use)", { size: 22, color: "999999", italics: true })], { alignment: AlignmentType.CENTER }),
    emptyPara(), emptyPara(), emptyPara(),
    para([txt(`Business Number: ${co.bn}`, { size: 22 })], { alignment: AlignmentType.CENTER }),
    para([txt(`Address: ${co.address}`, { size: 22 })], { alignment: AlignmentType.CENTER }),
  );

  // Balance Sheet
  const bsCols = [4200, 2580, 2580];
  const cy = bs.current_year;
  const py = bs.prior_year;
  const totalCurrentAssets = cy.cash + cy.prepaid + cy.hst_receivable;
  const totalCapitalAssets = cy.equipment_gross - cy.accumulated_amort;
  const totalAssets = totalCurrentAssets + totalCapitalAssets;
  const totalLiabilities = cy.ap + cy.cc_payable + cy.due_to_shareholders;
  const totalEquity = cy.common_shares + cy.retained_earnings;

  const pyTotalCurrentAssets = py.cash + py.prepaid + py.hst_receivable;
  const pyTotalCapital = py.equipment_gross - py.accumulated_amort;
  const pyTotalAssets = pyTotalCurrentAssets + pyTotalCapital;
  const pyTotalLiab = py.ap + py.cc_payable + py.due_to_shareholders;
  const pyTotalEquity = py.common_shares + py.retained_earnings;

  sections.push(
    new Paragraph({ children: [new PageBreak()] }),
    sectionHeading("BALANCE SHEET"),
    para([txt(`As at ${co.fiscal_year_end}`, { size: 20, italics: true, color: "666666" })], { spacing: { after: 200 } }),
    para([boldTxt("ASSETS", { size: 24, color: "1F4E79" })]),
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA }, columnWidths: bsCols,
      rows: [
        new TableRow({ children: [headerCell("", bsCols[0]), headerCell("Current", bsCols[1]), headerCell(bs.prior_year_label, bsCols[2])] }),
        new TableRow({ children: [cell("Current Assets", bsCols[0]), cell("", bsCols[1]), cell("", bsCols[2])] }),
        new TableRow({ children: [cell("  Cash and Bank Deposits", bsCols[0]), numCell(cy.cash, bsCols[1]), numCell(py.cash, bsCols[2])] }),
        new TableRow({ children: [cell("  Prepaid Expenses", bsCols[0]), numCell(cy.prepaid, bsCols[1]), numCell(py.prepaid, bsCols[2])] }),
        new TableRow({ children: [cell("  HST Receivable", bsCols[0]), numCell(cy.hst_receivable, bsCols[1]), numCell(py.hst_receivable, bsCols[2])] }),
        new TableRow({ children: [cell([boldTxt("Total Current Assets")], bsCols[0], { shading: ALT_FILL }), numCell(totalCurrentAssets, bsCols[1], { shading: ALT_FILL }), numCell(pyTotalCurrentAssets, bsCols[2], { shading: ALT_FILL })] }),
        new TableRow({ children: [cell("Capital Assets", bsCols[0]), cell("", bsCols[1]), cell("", bsCols[2])] }),
        new TableRow({ children: [cell("  Equipment (Gross)", bsCols[0]), numCell(cy.equipment_gross, bsCols[1]), numCell(py.equipment_gross, bsCols[2])] }),
        new TableRow({ children: [cell("  Less: Accumulated Amortization", bsCols[0]), numCell(-cy.accumulated_amort, bsCols[1]), numCell(-py.accumulated_amort, bsCols[2])] }),
        new TableRow({ children: [cell([boldTxt("Total Capital Assets")], bsCols[0], { shading: ALT_FILL }), numCell(totalCapitalAssets, bsCols[1], { shading: ALT_FILL }), numCell(pyTotalCapital, bsCols[2], { shading: ALT_FILL })] }),
        new TableRow({ children: [cell([boldTxt("TOTAL ASSETS", { size: 24 })], bsCols[0], { shading: TOTAL_FILL }), numCell(totalAssets, bsCols[1], { shading: TOTAL_FILL }), numCell(pyTotalAssets, bsCols[2], { shading: TOTAL_FILL })] }),
      ]
    }),
    emptyPara(),
    para([boldTxt("LIABILITIES & EQUITY", { size: 24, color: "1F4E79" })]),
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA }, columnWidths: bsCols,
      rows: [
        new TableRow({ children: [headerCell("", bsCols[0]), headerCell("Current", bsCols[1]), headerCell(bs.prior_year_label, bsCols[2])] }),
        new TableRow({ children: [cell("  Accounts Payable", bsCols[0]), numCell(cy.ap, bsCols[1]), numCell(py.ap, bsCols[2])] }),
        new TableRow({ children: [cell("  Credit Card Payable", bsCols[0]), numCell(cy.cc_payable, bsCols[1]), numCell(py.cc_payable, bsCols[2])] }),
        new TableRow({ children: [cell("  Due to Shareholders", bsCols[0]), numCell(cy.due_to_shareholders, bsCols[1]), numCell(py.due_to_shareholders, bsCols[2])] }),
        new TableRow({ children: [cell([boldTxt("Total Liabilities")], bsCols[0], { shading: ALT_FILL }), numCell(totalLiabilities, bsCols[1], { shading: ALT_FILL }), numCell(pyTotalLiab, bsCols[2], { shading: ALT_FILL })] }),
        new TableRow({ children: [cell("  Common Shares", bsCols[0]), numCell(cy.common_shares, bsCols[1]), numCell(py.common_shares, bsCols[2])] }),
        new TableRow({ children: [cell("  Retained Earnings", bsCols[0]), numCell(cy.retained_earnings, bsCols[1]), numCell(py.retained_earnings, bsCols[2])] }),
        new TableRow({ children: [cell([boldTxt("Total Equity")], bsCols[0], { shading: ALT_FILL }), numCell(totalEquity, bsCols[1], { shading: ALT_FILL }), numCell(pyTotalEquity, bsCols[2], { shading: ALT_FILL })] }),
        new TableRow({ children: [cell([boldTxt("TOTAL LIABILITIES & EQUITY", { size: 24 })], bsCols[0], { shading: TOTAL_FILL }), numCell(totalLiabilities + totalEquity, bsCols[1], { shading: TOTAL_FILL }), numCell(pyTotalLiab + pyTotalEquity, bsCols[2], { shading: TOTAL_FILL })] }),
      ]
    }),
  );

  // Income Statement
  const isCols = [4680, 2340, 2340];
  const totalExpenses = is_.expenses.reduce((s, e) => s + e.amount, 0);
  const netIncome = is_.revenue - totalExpenses;

  sections.push(
    new Paragraph({ children: [new PageBreak()] }),
    sectionHeading("INCOME STATEMENT"),
    para([txt(`For the Year Ended ${co.fiscal_year_end}`, { size: 20, italics: true, color: "666666" })], { spacing: { after: 200 } }),
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA }, columnWidths: isCols,
      rows: [
        new TableRow({ children: [headerCell("", isCols[0]), headerCell("Current", isCols[1]), headerCell(bs.prior_year_label, isCols[2])] }),
        new TableRow({ children: [cell([boldTxt("Revenue")], isCols[0]), cell("", isCols[1]), cell("", isCols[2])] }),
        new TableRow({ children: [cell(`  ${is_.revenue_description}`, isCols[0]), numCell(is_.revenue, isCols[1]), numCell(is_.prior_year.revenue, isCols[2])] }),
        new TableRow({ children: [cell([boldTxt("Total Revenue")], isCols[0], { shading: ALT_FILL }), numCell(is_.revenue, isCols[1], { shading: ALT_FILL }), numCell(is_.prior_year.revenue, isCols[2], { shading: ALT_FILL })] }),
        new TableRow({ children: [cell([boldTxt("Expenses")], isCols[0]), cell("", isCols[1]), cell("", isCols[2])] }),
        ...is_.expenses.map(e =>
          new TableRow({ children: [cell(`  ${e.name}`, isCols[0]), numCell(e.amount, isCols[1]), cell("--", isCols[2], { align: AlignmentType.RIGHT })] })
        ),
        new TableRow({ children: [cell([boldTxt("Total Expenses")], isCols[0], { shading: ALT_FILL }), numCell(totalExpenses, isCols[1], { shading: ALT_FILL }), numCell(is_.prior_year.total_expenses, isCols[2], { shading: ALT_FILL })] }),
        new TableRow({ children: [cell([boldTxt("NET INCOME (LOSS)", { size: 24 })], isCols[0], { shading: TOTAL_FILL }), numCell(netIncome, isCols[1], { shading: TOTAL_FILL }), numCell(is_.prior_year.net_income, isCols[2], { shading: TOTAL_FILL })] }),
      ]
    }),
  );

  // CCA Schedule
  if (data.cca && data.cca.length > 0) {
    const ccaCols = [2340, 1170, 1170, 1560, 1560, 1560];
    let totalCCA = 0;
    const ccaRows = data.cca.map(c => {
      const cca = Math.round(c.rate * (c.opening_ucc + c.additions / 2));
      totalCCA += cca;
      return new TableRow({ children: [
        cell(`Class ${c.class} (${c.name})`, ccaCols[0]),
        cell(`${Math.round(c.rate*100)}%`, ccaCols[1], { align: AlignmentType.CENTER }),
        numCell(c.opening_ucc, ccaCols[2]), numCell(c.additions, ccaCols[3]),
        numCell(cca, ccaCols[4]), numCell(c.opening_ucc + c.additions - cca, ccaCols[5]),
      ] });
    });

    sections.push(
      new Paragraph({ children: [new PageBreak()] }),
      sectionHeading("SCHEDULE 8 - CAPITAL COST ALLOWANCE"),
      new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA }, columnWidths: ccaCols,
        rows: [
          new TableRow({ children: [headerCell("Class", ccaCols[0]), headerCell("Rate", ccaCols[1]), headerCell("Opening UCC", ccaCols[2]), headerCell("Additions", ccaCols[3]), headerCell("CCA", ccaCols[4]), headerCell("Closing UCC", ccaCols[5])] }),
          ...ccaRows,
        ]
      }),
    );
  }

  // Notes (generated from data.notes)
  if (data.notes) {
    const n = data.notes;
    const currentYearLoss = Math.abs(netIncome);
    const totalNCL = n.prior_ncl + (netIncome < 0 ? currentYearLoss : 0);

    sections.push(
      new Paragraph({ children: [new PageBreak()] }),
      sectionHeading("NOTES TO THE FINANCIAL STATEMENTS"),
      para([boldTxt("1. Nature of Operations", { size: 24, color: "1F4E79" })], { spacing: { before: 200, after: 100 } }),
      para([txt(`${co.name} is a CCPC incorporated in Ontario, providing ${n.nature}. HST registered (BN: ${co.bn}).`)]),
      para([boldTxt("2. Basis of Presentation", { size: 24, color: "1F4E79" })], { spacing: { before: 200, after: 100 } }),
      para([txt("Unaudited, historical cost basis, ASPE standards. Prepared for management and CRA filing.")]),
      para([boldTxt("3. Significant Accounting Policies", { size: 24, color: "1F4E79" })], { spacing: { before: 200, after: 100 } }),
      para([txt("Revenue recognized when services rendered. CCA at CRA declining balance rates with half-year rule. CCPC eligible for small business deduction.")]),
    );
    if (n.motor_vehicle) {
      sections.push(
        para([boldTxt("4. Motor Vehicle Expenses", { size: 24, color: "1F4E79" })], { spacing: { before: 200, after: 100 } }),
        para([txt(`${n.motor_vehicle}. Pre-HST ~$${n.motor_vehicle_monthly_prehst}/month, within CRA limit of $${n.cra_monthly_limit}/month.`)]),
      );
    }
    sections.push(
      para([boldTxt("5. Due to Shareholders", { size: 24, color: "1F4E79" })], { spacing: { before: 200, after: 100 } }),
      para([txt(`Shareholder loan decreased from $${n.shareholder_loan_opening.toLocaleString()} to $${n.shareholder_loan_closing.toLocaleString()}. Transfers are loan repayments -- not taxable, not deductible.`)]),
      para([boldTxt("6. Non-Capital Losses", { size: 24, color: "1F4E79" })], { spacing: { before: 200, after: 100 } }),
      para([txt(`Total NCL available for carryforward: $${totalNCL.toLocaleString()}. Losses carry forward 20 years under the ITA.`)]),
      para([boldTxt("7. Income Tax", { size: 24, color: "1F4E79" })], { spacing: { before: 200, after: 100 } }),
      para([txt(netIncome < 0 ? "No tax payable -- the corporation incurred a net loss." : "Tax calculated at applicable CCPC small business rate.")]),
    );
  }

  // Filing summary
  if (data.filing_checklist) {
    const totalExpensesAmt = is_.expenses.reduce((s, e) => s + e.amount, 0);
    sections.push(
      new Paragraph({ children: [new PageBreak()] }),
      sectionHeading("T2 FILING SUMMARY"),
      new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA }, columnWidths: [5460, 3900],
        rows: [
          new TableRow({ children: [headerCell("Item", 5460), headerCell("Amount", 3900)] }),
          new TableRow({ children: [cell("Total Revenue", 5460), numCell(is_.revenue, 3900)] }),
          new TableRow({ children: [cell("Total Expenses", 5460), numCell(totalExpensesAmt, 3900)] }),
          new TableRow({ children: [cell("Net Income / (Loss)", 5460), numCell(netIncome, 3900)] }),
          new TableRow({ children: [cell([boldTxt("Total Tax Payable")], 5460, { shading: TOTAL_FILL }), numCell(Math.max(0, netIncome * 0.12), 3900, { shading: TOTAL_FILL })] }),
        ]
      }),
      emptyPara(),
      para([boldTxt("Filing Checklist:")]),
      ...data.filing_checklist.map((item, i) => para([txt(`${i+1}. ${item}`)])),
    );
  }

  const doc1 = makeDoc(sections, co.name, `Financial Statements - ${co.fiscal_year_end}`);
  const slug = co.name.replace(/\s+/g, '_');
  await saveDoc(doc1, path.join(data.output_dir, `${slug}_Financial_Statements.docx`));

  // ════════════════════════════════════════
  // DOCUMENT 2: HST Worksheets + Invoices
  // ════════════════════════════════════════
  if (data.hst_years && data.hst_years.length > 0) {
    const hstSections = [];

    for (const hy of data.hst_years) {
      if (hstSections.length > 0) hstSections.push(new Paragraph({ children: [new PageBreak()] }));

      const totalHST = hy.revenue_items.reduce((s, r) => s + r.hst, 0);
      const totalGross = hy.revenue_items.reduce((s, r) => s + r.gross, 0);
      const totalITC = hy.itc_items.reduce((s, r) => s + r.hst, 0);

      const revCols = [1200, 3200, 1600, 1680, 1680];
      const itcCols = [3200, 1600, 1680, 1200, 1680];

      hstSections.push(
        para([boldTxt(co.name, { size: 36, color: "1F4E79" })], { alignment: AlignmentType.CENTER }),
        para([txt(`HST Return Worksheet - ${hy.year}`, { size: 28, color: "1F4E79" })], { alignment: AlignmentType.CENTER }),
        para([txt(`BN: ${co.bn}`, { size: 20, color: "666666" })], { alignment: AlignmentType.CENTER, spacing: { after: 300 } }),

        sectionHeading("A. HST COLLECTED ON REVENUE"),
        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA }, columnWidths: revCols,
          rows: [
            new TableRow({ children: [headerCell("Date", revCols[0]), headerCell("Description", revCols[1]), headerCell("Gross", revCols[2]), headerCell("Net", revCols[3]), headerCell("HST", revCols[4])] }),
            ...hy.revenue_items.map(r =>
              new TableRow({ children: [cell(r.date, revCols[0]), cell(r.desc, revCols[1]), numCell2(r.gross, revCols[2]), numCell2(r.gross - r.hst, revCols[3]), numCell2(r.hst, revCols[4])] })
            ),
            new TableRow({ children: [cell([boldTxt("TOTAL")], revCols[0], { shading: TOTAL_FILL }), cell("", revCols[1], { shading: TOTAL_FILL }), numCell2(totalGross, revCols[2], { shading: TOTAL_FILL }), numCell2(totalGross - totalHST, revCols[3], { shading: TOTAL_FILL }), numCell2(totalHST, revCols[4], { shading: TOTAL_FILL })] }),
          ]
        }),
        emptyPara(),

        sectionHeading("B. INPUT TAX CREDITS (ITCs)"),
        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA }, columnWidths: itcCols,
          rows: [
            new TableRow({ children: [headerCell("Category", itcCols[0]), headerCell("Gross", itcCols[1]), headerCell("ITC", itcCols[2]), headerCell("HST?", itcCols[3]), headerCell("Note", itcCols[4])] }),
            ...hy.itc_items.map(r =>
              new TableRow({ children: [cell(r.category, itcCols[0]), numCell2(r.gross, itcCols[1]), numCell2(r.hst, itcCols[2]), cell(r.hst > 0 ? "Yes" : "No", itcCols[3], { align: AlignmentType.CENTER }), cell(r.note || "", itcCols[4])] })
            ),
            new TableRow({ children: [cell([boldTxt("TOTAL ITCs")], itcCols[0], { shading: TOTAL_FILL }), cell("", itcCols[1], { shading: TOTAL_FILL }), numCell2(totalITC, itcCols[2], { shading: TOTAL_FILL }), cell("", itcCols[3], { shading: TOTAL_FILL }), cell("", itcCols[4], { shading: TOTAL_FILL })] }),
          ]
        }),
        emptyPara(),

        sectionHeading("C. NET HST"),
        new Table({
          width: { size: CONTENT_WIDTH, type: WidthType.DXA }, columnWidths: [6000, 3360],
          rows: [
            new TableRow({ children: [cell("HST Collected", 6000), numCell2(totalHST, 3360)] }),
            new TableRow({ children: [cell("Total ITCs", 6000), numCell2(-totalITC, 3360)] }),
            new TableRow({ children: [cell([boldTxt("Net (Refund)")], 6000, { shading: TOTAL_FILL }), numCell2(totalHST - totalITC, 3360, { shading: TOTAL_FILL })] }),
          ]
        }),
        para([boldTxt(`EXPECTED HST REFUND: $${Math.abs(totalHST - totalITC).toFixed(2)}`, { size: 24, color: totalHST - totalITC < 0 ? "006600" : "CC0000" })], { alignment: AlignmentType.CENTER }),
      );

      if (hy.notes) {
        hstSections.push(sectionHeading("NOTES"));
        hy.notes.forEach((n, i) => hstSections.push(para([txt(`${i+1}. ${n}`, { size: 20 })])));
      }
    }

    // Missing invoices
    if (data.missing_invoices && data.missing_invoices.length > 0) {
      hstSections.push(
        new Paragraph({ children: [new PageBreak()] }),
        para([boldTxt("Missing Invoices", { size: 36, color: "1F4E79" })], { alignment: AlignmentType.CENTER }),
        para([txt("Complete client details and retain for CRA records.", { size: 22, color: "CC0000" })], { alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
      );

      data.missing_invoices.forEach((inv, idx) => {
        if (idx > 0) hstSections.push(new Paragraph({ children: [new PageBreak()] }));
        const net = inv.gross / 1.13;
        const hst = inv.gross - net;
        const cols4 = [3500, 1200, 2330, 2330];

        hstSections.push(
          para([boldTxt(co.name, { size: 32, color: "1F4E79" })]),
          para([txt(`${co.address}  |  BN: ${co.bn}`, { size: 20, color: "666666" })]),
          para([boldTxt("INVOICE", { size: 36, color: "1F4E79" })], { alignment: AlignmentType.RIGHT, spacing: { before: 200, after: 100 } }),
          para([boldTxt(`Invoice #: ${inv.num}  |  Date: ${inv.date}`)]),
          para([boldTxt("Bill To: ", { color: "CC0000" }), txt("[Client Name -- TO BE COMPLETED]", { color: "CC0000", italics: true })]),
          emptyPara(),
          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA }, columnWidths: cols4,
            rows: [
              new TableRow({ children: [headerCell("Description", cols4[0]), headerCell("Qty", cols4[1]), headerCell("Rate", cols4[2]), headerCell("Amount", cols4[3])] }),
              new TableRow({ children: [cell("Technology Consulting Services", cols4[0]), cell("1", cols4[1], { align: AlignmentType.CENTER }), numCell2(net, cols4[2]), numCell2(net, cols4[3])] }),
              new TableRow({ children: [cell("", cols4[0]), cell("", cols4[1]), cell([boldTxt("Subtotal:")], cols4[2], { align: AlignmentType.RIGHT }), numCell2(net, cols4[3])] }),
              new TableRow({ children: [cell("", cols4[0]), cell("", cols4[1]), cell("HST (13%):", cols4[2], { align: AlignmentType.RIGHT }), numCell2(hst, cols4[3])] }),
              new TableRow({ children: [cell("", cols4[0], { shading: TOTAL_FILL }), cell("", cols4[1], { shading: TOTAL_FILL }), cell([boldTxt("TOTAL:")], cols4[2], { align: AlignmentType.RIGHT, shading: TOTAL_FILL }), numCell2(inv.gross, cols4[3], { shading: TOTAL_FILL })] }),
            ]
          }),
          emptyPara(),
          para([txt("Payment received via Interac e-Transfer.", { size: 20, italics: true, color: "666666" })]),
          para([boldTxt("ACTION REQUIRED: ", { size: 20, color: "CC0000" }), txt("Update client name and address.", { size: 20, color: "CC0000" })]),
        );
      });
    }

    const doc2 = makeDoc(hstSections, co.name, "HST Worksheets & Invoices");
    await saveDoc(doc2, path.join(data.output_dir, `${slug}_HST_Worksheets_Invoices.docx`));
  }

  console.log("\nAll documents generated successfully.");
}

main().catch(err => { console.error(err); process.exit(1); });
