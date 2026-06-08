/**
 * Green Acres Bhiwadi — Email-only Lead Relay
 *
 * Receives the form POST and emails the lead to RECIPIENT_EMAIL.
 * No Google Sheet, no extra setup. Sends FROM your Google account
 * (so the recipient does not need to confirm anything).
 *
 * Setup: see setup-instructions.md
 */

// === EDIT THIS ===
const RECIPIENT_EMAIL = "realtyreverence@gmail.com";
// =================

function doPost(e) {
  try {
    const p = e.parameter;
    const subject = "New Enquiry — Green Acres Bhiwadi (" + (p.interest || "—") + ")";

    const html =
      "<div style='font-family:Arial,sans-serif;color:#1a2b22;max-width:560px'>" +
        "<h2 style='color:#0d3b1f;border-bottom:2px solid #b78b3a;padding-bottom:10px;margin:0 0 18px'>" +
          "New Enquiry — Green Acres Bhiwadi" +
        "</h2>" +
        "<table style='font-size:14px;border-collapse:collapse;width:100%'>" +
          "<tr><td style='padding:8px 14px 8px 0;color:#6b7a72;width:130px'>Interested in</td>" +
              "<td style='padding:8px 0'><strong>" + escapeHtml(p.interest || "—") + "</strong></td></tr>" +
          "<tr><td style='padding:8px 14px 8px 0;color:#6b7a72'>Name</td>" +
              "<td style='padding:8px 0'>" + escapeHtml(p.name || "—") + "</td></tr>" +
          "<tr><td style='padding:8px 14px 8px 0;color:#6b7a72'>Contact</td>" +
              "<td style='padding:8px 0'><a href='tel:" + escapeHtml(p.contact || "") + "' style='color:#16432d'>" +
                escapeHtml(p.contact || "—") + "</a></td></tr>" +
          "<tr><td style='padding:8px 14px 8px 0;color:#6b7a72'>Email</td>" +
              "<td style='padding:8px 0'><a href='mailto:" + escapeHtml(p.email || "") + "' style='color:#16432d'>" +
                escapeHtml(p.email || "—") + "</a></td></tr>" +
        "</table>" +
        "<p style='font-size:12px;color:#999;margin-top:30px'>" +
          "Sent automatically from green-acres-bhiwadi.vercel.app" +
        "</p>" +
      "</div>";

    const mailOptions = {
      to: RECIPIENT_EMAIL,
      subject: subject,
      htmlBody: html
    };
    if (p.email) mailOptions.replyTo = p.email;

    MailApp.sendEmail(mailOptions);

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

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
