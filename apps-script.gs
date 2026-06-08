/**
 * Green Acres Bhiwadi — Lead Capture
 *
 * Writes form submissions into your CRM Google Sheet ("Green Acre_ Bhiwadi_...").
 * Auto-fills S.NO, DATE, NAME, NUMBER, SOURCE, Interested In, E-MAIL ID.
 * Sends an email notification on every submission.
 */

// ============== EDIT THESE ==============
const NOTIFY_EMAIL = "realtyreverence@gmail.com";

// Paste the Sheet ID from your CRM sheet URL.
// URL pattern:
//   https://docs.google.com/spreadsheets/d/<<<THIS_IS_THE_ID>>>/edit#...
const SHEET_ID = "PASTE_SHEET_ID_HERE";

// Tab name inside the CRM sheet to write into.
const SHEET_TAB = "Sheet1";
// ========================================

function doPost(e) {
  try {
    const p = e.parameter;
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_TAB) || ss.getSheets()[0];
    const now = new Date();

    // Compute next S.NO by looking at the max value in column A (data starts at row 2)
    const lastRow = sheet.getLastRow();
    let nextSerial = 1;
    if (lastRow >= 2) {
      const serials = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      const maxSerial = serials.reduce(function (max, row) {
        const v = Number(row[0]);
        return (isFinite(v) && v > max) ? v : max;
      }, 0);
      nextSerial = maxSerial + 1;
    }

    // Format DATE as DD.MM.YYYY (matches the existing CRM format)
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const formattedDate = dd + "." + mm + "." + now.getFullYear();

    // Column layout (A → J):
    //   A: S.NO   B: DATE   C: NAME   D: NUMBER   E: SOURCE
    //   F: What are you interested in   G: E-MAIL ID
    //   H: Location   I: Visit Done   J: REMARKS
    sheet.appendRow([
      nextSerial,
      formattedDate,
      p.name || "",
      p.contact || "",
      "Website",
      p.interest || "",
      p.email || "",
      "",  // Location — filled manually
      "",  // Visit Done — filled manually
      ""   // Remarks — filled manually
    ]);

    // Email notification
    const subject = "New Enquiry — Green Acres Bhiwadi (" + (p.interest || "—") + ")";
    const body =
      "A new enquiry from your Green Acres landing page:\n\n" +
      "S.NO          : " + nextSerial + "\n" +
      "Interested in : " + (p.interest || "—") + "\n" +
      "Name          : " + (p.name || "—") + "\n" +
      "Contact       : " + (p.contact || "—") + "\n" +
      "Email         : " + (p.email || "—") + "\n" +
      "Source        : Website\n" +
      "Date          : " + formattedDate + "\n\n" +
      "— Green Acres Lead Bot";

    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, serial: nextSerial }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("Green Acres lead endpoint is live.");
}
