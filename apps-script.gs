/**
 * Green Acres Bhiwadi — Lead Capture
 *
 * Writes form submissions to the first sheet of THIS spreadsheet.
 * No email notification — leads live in the Sheet only.
 */

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

    const contact = (p.contact || "").toString().trim();

    if (contact && sheet.getLastRow() > 1) {
      const existing = sheet.getRange(2, 4, sheet.getLastRow() - 1, 1).getValues();
      const isDuplicate = existing.some(row => String(row[0]).trim() === contact);
      if (isDuplicate) {
        return ContentService
          .createTextOutput(JSON.stringify({ ok: true, duplicate: true }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    sheet.appendRow([
      now,
      p.interest || "",
      p.name || "",
      contact,
      p.email || ""
    ]);

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
