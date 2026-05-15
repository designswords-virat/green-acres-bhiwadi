# Lead Form Setup — Google Sheet + Email

Follow these once. After this, every submission writes a row to your Sheet **and** emails you.

---

## 1. Create the Google Sheet

1. Go to https://sheets.google.com → **Blank**
2. Rename the sheet to: `Green Acres Leads` (any name is fine)

## 2. Open Apps Script

1. In the Sheet, click **Extensions → Apps Script**
2. Delete the default `function myFunction() {}` placeholder
3. Open the file `apps-script.gs` (in this folder), copy ALL its contents, paste into the Apps Script editor
4. At the top of the script, confirm the line:
   ```
   const NOTIFY_EMAIL = "designs.words@gmail.com";
   ```
   Change the email if you want notifications to go elsewhere.
5. Click the **disk icon** (Save). Name the project `Green Acres Leads`.

## 3. Deploy as a Web App

1. Top-right → **Deploy → New deployment**
2. Click the **gear icon** next to "Select type" → choose **Web app**
3. Fill in:
   - **Description**: `Green Acres lead capture v1`
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**  ← important
4. Click **Deploy**
5. Google will ask you to **Authorize access**:
   - Click **Authorize access**
   - Pick your Google account
   - You'll see "Google hasn't verified this app" — click **Advanced → Go to Green Acres Leads (unsafe)**
   - Click **Allow**
6. Copy the **Web app URL**. It looks like:
   ```
   https://script.google.com/macros/s/AKfycb..../exec
   ```

## 4. Paste the URL into your landing page

Open `index.html` and find this line near the bottom:

```js
const SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_URL_HERE";
```

Replace `PASTE_YOUR_APPS_SCRIPT_URL_HERE` with the URL you just copied. Save.

## 5. Test

1. Open `index.html` in a browser
2. Fill the form, submit
3. Check:
   - Your Google Sheet — a new row should appear
   - Your inbox — a notification email should arrive

If both work, you're done.

---

## Notes

- **Header row** is created automatically on the first submission.
- **Spam**: Google's "Anyone" access just means anyone with the URL can POST to it. The URL is long and not guessable, but if you start getting spam, add a simple hidden field check in the script.
- **Editing the script later**: After any change, you must **Deploy → Manage deployments → pencil/edit icon → Version: New version → Deploy** for the change to take effect. Just clicking "Save" inside the editor is not enough.
- **Quota**: Apps Script free tier allows ~100 emails/day and unlimited Sheet writes — plenty for a coming-soon page.

## Troubleshooting

- **"Something went wrong" alert on submit** → URL is wrong, or you haven't deployed yet, or "Who has access" isn't "Anyone".
- **Sheet row appears but no email** → check spam folder. Make sure `NOTIFY_EMAIL` in the script is spelled correctly.
- **Email arrives but no row in Sheet** → script is attached to the wrong Sheet. Re-open Apps Script from inside the target Sheet (Extensions → Apps Script).
