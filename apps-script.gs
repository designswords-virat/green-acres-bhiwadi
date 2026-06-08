/**
 * Green Acres Bhiwadi — Lead Capture
 *
 * Writes form submissions to the first sheet of THIS spreadsheet,
 * and sends an email notification.
 *
 * Setup: this script must be created from INSIDE a Google Sheet
 * (Extensions → Apps Script). It will write to that sheet automatically.
 */

// === EDIT THIS ===
const NOTIFY_EMAIL = "designs.words@gmail.com";
// =================

function doPost(e) {
  try {
    const p = e.parameter;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const now = new Date();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Interested In", "Name", "Contact", "Email"]);
      sheet.getRange("A1:E1")
        .setFontWeight("bold")
        .setBackground("#0d3b1f")
        .setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      now,
      p.interest || "",
      p.name || "",
      p.contact || "",
      p.email || ""
    ]);

    const subject = "New Enquiry — Green Acres Bhiwadi (" + (p.interest || "—") + ")";
    const body =
      "A new enquiry has been submitted from your Green Acres landing page:\n\n" +
      "Interested in : " + (p.interest || "—") + "\n" +
      "Name          : " + (p.name || "—") + "\n" +
      "Contact       : " + (p.contact || "—") + "\n" +
      "Email         : " + (p.email || "—") + "\n\n" +
      "Received      : " + now.toString() + "\n\n" +
      "— Green Acres Lead Bot";

    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
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
