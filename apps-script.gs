/**
 * Green Acres Bhiwadi — Lead + Subscriber Capture
 *
 * Routes incoming POSTs to one of two sheet tabs:
 *   - default          → first sheet (leads, full enquiry form)
 *   - type=subscribe   → "Subscribers" tab (newsletter email-only)
 *
 * Sends a notification email for either type.
 */

// === EDIT THIS ===
const NOTIFY_EMAIL = "realtyreverence@gmail.com";
// =================

function doPost(e) {
  try {
    const p = e.parameter;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = new Date();

    if (p.type === "subscribe") {
      // ====== SUBSCRIBER (newsletter pill) ======
      let sheet = ss.getSheetByName("Subscribers");
      if (!sheet) sheet = ss.insertSheet("Subscribers");

      if (sheet.getLastRow() === 0) {
        sheet.appendRow(["Timestamp", "Email"]);
        sheet.getRange("A1:B1")
          .setFontWeight("bold")
          .setBackground("#16432d")
          .setFontColor("#ffffff");
        sheet.setFrozenRows(1);
      }

      sheet.appendRow([timestamp, p.email || ""]);

      MailApp.sendEmail(
        NOTIFY_EMAIL,
        "New Subscriber — Green Acres Bhiwadi",
        "A new email subscriber from your Green Acres landing page:\n\n" +
        "Email     : " + (p.email || "—") + "\n" +
        "Received  : " + timestamp.toString() + "\n\n" +
        "— Green Acres Lead Bot"
      );
    } else {
      // ====== LEAD (full enquiry form) ======
      const sheet = ss.getSheets()[0]; // first tab

      if (sheet.getLastRow() === 0) {
        sheet.appendRow(["Timestamp", "Interested In", "Name", "Contact", "Email"]);
        sheet.getRange("A1:E1")
          .setFontWeight("bold")
          .setBackground("#16432d")
          .setFontColor("#ffffff");
        sheet.setFrozenRows(1);
      }

      sheet.appendRow([
        timestamp,
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
        "Received      : " + timestamp.toString() + "\n\n" +
        "— Green Acres Lead Bot";

      MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
    }

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
