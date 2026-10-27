import { google, sheets_v4 } from "googleapis";
import type { OrderInput } from "@/lib/order-schema";

type InquiryRecord = {
  inquiryId: string;
  createdAt: string;
  input: OrderInput;
};

type SheetSetup = {
  sheetId: number;
  hasBanding: boolean;
  hasConditionalFormatting: boolean;
};

const headers = [
  "Inquiry ID",
  "Date & Time",
  "Customer Name",
  "Phone Number",
  "Email Address",
  "Exact Location",
  "Products Requested",
  "Quantities",
  "Pricing Status",
  "Delivery Charge",
  "Payment Process",
  "Inquiry Status",
  "Notes",
  "Request Token",
];

const inquiryStatuses = [
  "New Inquiry",
  "Quotation Sent",
  "Awaiting Advance",
  "Order Confirmed",
  "Order Ongoing",
  "Delivered",
  "Cancelled",
];

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function quoteSheetName(name: string) {
  return `'${name.replaceAll("'", "''")}'`;
}

async function findOrCreateSheet(sheets: sheets_v4.Sheets, spreadsheetId: string, tabName: string): Promise<SheetSetup> {
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    includeGridData: false,
    fields: "sheets(properties(sheetId,title),bandedRanges(bandedRangeId,range),conditionalFormats)",
  });
  const existing = spreadsheet.data.sheets?.find((sheet) => sheet.properties?.title === tabName);
  if (existing?.properties?.sheetId !== undefined && existing.properties.sheetId !== null) {
    return {
      sheetId: existing.properties.sheetId,
      hasBanding: Boolean(existing.bandedRanges?.length),
      hasConditionalFormatting: Boolean(existing.conditionalFormats?.length),
    };
  }

  const created = await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{
        addSheet: {
          properties: {
            title: tabName,
            gridProperties: { rowCount: 1000, columnCount: headers.length },
          },
        },
      }],
    },
  });
  const sheetId = created.data.replies?.[0]?.addSheet?.properties?.sheetId;
  if (sheetId === undefined || sheetId === null) throw new Error("Google Sheets did not return the created sheet ID.");
  return { sheetId, hasBanding: false, hasConditionalFormatting: false };
}

function statusRule(sheetId: number, status: string, backgroundColor: sheets_v4.Schema$Color, foregroundColor: sheets_v4.Schema$Color) {
  return {
    addConditionalFormatRule: {
      index: 0,
      rule: {
        ranges: [{ sheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 11, endColumnIndex: 12 }],
        booleanRule: {
          condition: { type: "CUSTOM_FORMULA", values: [{ userEnteredValue: `=$L2="${status}"` }] },
          format: { backgroundColor, textFormat: { foregroundColor, bold: true } },
        },
      },
    },
  } satisfies sheets_v4.Schema$Request;
}

async function prepareInquirySheet(sheets: sheets_v4.Sheets, spreadsheetId: string, tabName: string) {
  const setup = await findOrCreateSheet(sheets, spreadsheetId, tabName);
  const { sheetId } = setup;
  const navy = { red: 0.047, green: 0.141, blue: 0.259 };
  const orange = { red: 0.863, green: 0.49, blue: 0.016 };
  const white = { red: 1, green: 1, blue: 1 };
  const text = { red: 0.075, green: 0.137, blue: 0.235 };
  const paleBlue = { red: 0.953, green: 0.969, blue: 0.988 };

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${quoteSheetName(tabName)}!A1:N1`,
    valueInputOption: "RAW",
    requestBody: { values: [headers] },
  });

  const widths = [150, 175, 155, 130, 220, 260, 340, 175, 155, 170, 300, 165, 270, 230];
  const requests: sheets_v4.Schema$Request[] = [
    {
      updateSheetProperties: {
        properties: { sheetId, gridProperties: { frozenRowCount: 1, hideGridlines: true } },
        fields: "gridProperties.frozenRowCount,gridProperties.hideGridlines",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: headers.length },
        cell: {
          userEnteredFormat: {
            backgroundColor: navy,
            textFormat: { foregroundColor: white, bold: true, fontFamily: "Arial", fontSize: 10 },
            horizontalAlignment: "CENTER",
            verticalAlignment: "MIDDLE",
            wrapStrategy: "WRAP",
            borders: { bottom: { style: "SOLID_THICK", color: orange } },
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy,borders)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 0, endColumnIndex: headers.length },
        cell: {
          userEnteredFormat: {
            textFormat: { foregroundColor: text, fontFamily: "Arial", fontSize: 10 },
            verticalAlignment: "MIDDLE",
            wrapStrategy: "WRAP",
          },
        },
        fields: "userEnteredFormat(textFormat,verticalAlignment,wrapStrategy)",
      },
    },
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "ROWS", startIndex: 0, endIndex: 1 },
        properties: { pixelSize: 46 },
        fields: "pixelSize",
      },
    },
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "COLUMNS", startIndex: 13, endIndex: 14 },
        properties: { hiddenByUser: true },
        fields: "hiddenByUser",
      },
    },
    {
      setDataValidation: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: 11, endColumnIndex: 12 },
        rule: {
          condition: { type: "ONE_OF_LIST", values: inquiryStatuses.map((value) => ({ userEnteredValue: value })) },
          strict: true,
          showCustomUi: true,
        },
      },
    },
    {
      setBasicFilter: {
        filter: { range: { sheetId, startRowIndex: 0, endRowIndex: 1000, startColumnIndex: 0, endColumnIndex: headers.length } },
      },
    },
    ...widths.map((pixelSize, index) => ({
      updateDimensionProperties: {
        range: { sheetId, dimension: "COLUMNS", startIndex: index, endIndex: index + 1 },
        properties: { pixelSize },
        fields: "pixelSize",
      },
    } satisfies sheets_v4.Schema$Request)),
  ];

  if (!setup.hasBanding) {
    requests.push({
      addBanding: {
        bandedRange: {
          range: { sheetId, startRowIndex: 0, endRowIndex: 1000, startColumnIndex: 0, endColumnIndex: headers.length },
          rowProperties: { headerColor: navy, firstBandColor: white, secondBandColor: paleBlue },
        },
      },
    });
  }

  if (!setup.hasConditionalFormatting) {
    requests.push(
      statusRule(sheetId, "New Inquiry", { red: 1, green: 0.929, blue: 0.8 }, { red: 0.565, green: 0.282, blue: 0 }),
      statusRule(sheetId, "Quotation Sent", { red: 0.859, green: 0.918, blue: 0.996 }, { red: 0.118, green: 0.302, blue: 0.6 }),
      statusRule(sheetId, "Awaiting Advance", { red: 0.929, green: 0.878, blue: 0.988 }, { red: 0.384, green: 0.149, blue: 0.58 }),
      statusRule(sheetId, "Order Confirmed", { red: 0.82, green: 0.945, blue: 0.855 }, { red: 0.047, green: 0.424, blue: 0.216 }),
      statusRule(sheetId, "Order Ongoing", { red: 0.812, green: 0.953, blue: 0.965 }, { red: 0.02, green: 0.369, blue: 0.4 }),
      statusRule(sheetId, "Delivered", { red: 0.741, green: 0.922, blue: 0.784 }, { red: 0.027, green: 0.329, blue: 0.165 }),
      statusRule(sheetId, "Cancelled", { red: 0.996, green: 0.886, blue: 0.886 }, { red: 0.6, green: 0.067, blue: 0.067 }),
    );
  }

  await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests } });
}

export async function saveInquiryToSheet(record: InquiryRecord) {
  const spreadsheetId = required("GOOGLE_SHEET_ID");
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME || "Customer_Inquiries";
  const serviceAccountEmail = required("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = required("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  await prepareInquirySheet(sheets, spreadsheetId, tabName);

  const tokens = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${quoteSheetName(tabName)}!N2:N`,
  });
  const duplicateIndex = tokens.data.values?.findIndex((row) => row[0] === record.input.requestToken) ?? -1;
  if (duplicateIndex >= 0) {
    const rowNumber = duplicateIndex + 2;
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${quoteSheetName(tabName)}!A${rowNumber}:A${rowNumber}`,
    });
    return { inquiryId: String(existing.data.values?.[0]?.[0] || record.inquiryId), created: false };
  }

  const itemSummary = record.input.items.map((item) => `${item.productName} — ${item.variant}`).join(" | ");
  const quantitySummary = record.input.items.map((item) => `${item.quantity} ${item.unit}`).join(" | ");

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${quoteSheetName(tabName)}!A:N`,
    valueInputOption: "RAW",
    // OVERWRITE writes into the next empty row without shifting the prepared
    // formatting, dropdown validation, or banding out of alignment.
    insertDataOption: "OVERWRITE",
    requestBody: {
      values: [[
        record.inquiryId,
        record.createdAt,
        record.input.fullName,
        record.input.phone,
        record.input.email,
        record.input.location,
        itemSummary,
        quantitySummary,
        "Pending quotation",
        "Pending confirmation",
        "Advance bank transfer after quotation confirmation",
        "New Inquiry",
        record.input.notes || "",
        record.input.requestToken,
      ]],
    },
  });

  return { inquiryId: record.inquiryId, created: true };
}
