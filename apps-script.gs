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

    sheet.appendRow([
      now,
      p.interest || "",
      p.name || "",
      p.contact || "",
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
