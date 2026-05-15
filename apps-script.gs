/**
 * Green Acres Bhiwadi — Lead Capture
 * This script receives form submissions, writes them to the Google Sheet,
 * and emails a notification.
 *
 * SETUP: see setup-instructions.md
 */

// === EDIT THIS ===
const NOTIFY_EMAIL = "designs.words@gmail.com"; // where lead notifications go
// =================

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Add header row on first submission
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Interested In", "Name", "Contact", "Email"]);
      sheet.getRange("A1:E1").setFontWeight("bold").setBackground("#16432d").setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    const p = e.parameter;
    const timestamp = new Date();

    sheet.appendRow([
      timestamp,
      p.interest || "",
      p.name || "",
      p.contact || "",
      p.email || ""
    ]);

    // Send notification email
    const subject = "New Enquiry — Green Acres Bhiwadi (" + (p.interest || "—") + ")";
    const body =
      "A new enquiry has been submitted from your Green Acres landing page:\n\n" +
      "Interested in : " + (p.interest || "—") + "\n" +
      "Name          : " + (p.name || "—") + "\n" +
      "Contact       : " + (p.contact || "—") + "\n" +
      "Email         : " + (p.email || "—") + "\n\n" +
      "Received      : " + timestamp.toString() + "\n\n" +
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

// Optional GET handler — lets you open the deployed URL in a browser to verify it's live.
function doGet() {
  return ContentService.createTextOutput("Green Acres lead endpoint is live.");
}
