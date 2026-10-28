# Trijuti Rudrakshya Traders — quotation funnel

A production-oriented Next.js sales-inquiry funnel for cement, TMT steel, pipes, sheets, wire, gabion boxes and fabrication steel. It intentionally does **not** publish invented prices, delivery fees, bank details, testimonials or payment confirmations.

## Architecture and order flow

- **Next.js 16 App Router + TypeScript + Tailwind CSS 4** provides the landing page, quotation builder, checkout form and receipt page.
- The landing page builds a multi-product inquiry containing the product, specification, quantity and unit.
- Every supplied material also has its own SEO landing page at `/products/[product-slug]`, with a dedicated selector and checkout CTA.
- `/checkout` receives that list through the URL, collects the customer's contact and exact delivery location, and submits JSON to `POST /api/order`.
- The API validates all fields with Zod, rejects unexpected origins when `FRONTEND_URL` is configured, creates a unique inquiry ID and timestamps it in `Asia/Kathmandu` time.
- The server creates and formats the `Customer_Inquiries` tab when needed, then appends the inquiry with duplicate-request protection.
- The sheet uses a frozen branded header, filters, alternating rows, fitted columns, a hidden request-token column, and a color-coded status dropdown.
- The server sends a professional HTML order-request notification to the business and a receipt confirmation to the customer.
- The API saves the inquiry to Google Sheets first, then attempts both emails. A successful sheet save returns the inquiry ID even when email delivery is temporarily delayed, and the confirmation page clearly reports that status.
- The receipt is clearly a **quotation-inquiry acknowledgment**, not an accepted order, price confirmation or payment receipt.

Private Google and email credentials are read only inside server modules. They are never bundled into browser JavaScript.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and complete the values.
3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

The page can be previewed without credentials. A real form submission needs the Google Sheet and SMTP values described below.

### Individual product pages

- `/products/gajraj-cement`
- `/products/hongshi-cement`
- `/products/sarbottam-cement`
- `/products/sagarmatha-cement`
- `/products/shaurya-cement`
- `/products/tmt-steel`
- `/products/binding-wire`
- `/products/black-steel-pipe`
- `/products/square-rectangular-pipe`
- `/products/corrugated-galvanized-sheet`
- `/products/gabion-box`
- `/products/gi-wire`
- `/products/hr-steel-sheet`
- `/products/ms-channel`

The former misspelled `/products/giriraj-cement` address permanently redirects to the corrected Gajraj page.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public production URL, such as `https://example.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits only, including country code, such as `97798...` |
| `NEXT_PUBLIC_PHONE_NUMBER` | Public call number shown in the header/footer |
| `BUSINESS_EMAIL` | Optional deployment reference; the official inbox is set in `lib/site-config.ts` |
| `EMAIL_FROM` | Verified sender, commonly `Brand <same-gmail-address@gmail.com>` |
| `BRAND_NAME` | Brand displayed in both email templates |
| `GOOGLE_SHEET_ID` | ID between `/d/` and `/edit` in the Google Sheet URL |
| `GOOGLE_SHEET_TAB_NAME` | Use `Customer_Inquiries` unless the tab is renamed |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google Cloud service-account email |
| `GOOGLE_PRIVATE_KEY` | Full private key; Vercel accepts the value with literal `\n` sequences |
| `SMTP_HOST` | Gmail uses `smtp.gmail.com` |
| `SMTP_PORT` | Use `465` for secure SMTP, or `587` for STARTTLS |
| `SMTP_USER` | Verified sending account |
| `SMTP_PASS` | Gmail App Password, not the normal Gmail password |
| `FRONTEND_URL` | Exact production origin allowed to call the order API |
| `EMAIL_SERVICE_API_KEY` | Reserved for a future Resend/Brevo/SendGrid adapter; not used by the SMTP implementation |

Never commit `.env.local`.

## Google Spreadsheet setup

1. Create a new Google Spreadsheet.
2. Rename the first tab to `Customer_Inquiries`.
3. Paste this header row into row 1, starting at cell A1:

   ```text
   Inquiry ID	Date & Time	Customer Name	Phone Number	Email Address	Exact Location	Products Requested	Quantities	Pricing Status	Delivery Charge	Payment Process	Inquiry Status	Notes	Request Token
   ```

4. Freeze row 1: **View → Freeze → 1 row**.
5. Enable filters: select row 1, then **Data → Create a filter**.
6. Add a status dropdown to column L from row 2 downward: **Data → Data validation → Dropdown**. Add:
   - New Inquiry
   - Quotation Sent
   - Awaiting Advance
   - Order Confirmed
   - Order Ongoing
   - Delivered
   - Cancelled
7. Optionally add conditional colors to those status values.
8. Find the Sheet ID in the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`.
9. In Google Cloud Console, create/select a project, enable **Google Sheets API**, create a service account and generate a JSON key.
10. Add the JSON `client_email` and `private_key` to the matching environment variables.
11. Share the Google Sheet with the service-account email as **Editor**. Without this step, submissions will fail.

## Gmail / SMTP setup

1. Choose a Gmail or Google Workspace account that will send website emails. It may be different from the office inbox that receives orders.
2. Enable 2-Step Verification.
3. Create a Google **App Password** for Mail.
4. Use `smtp.gmail.com`, port `465`, the full Gmail address as `SMTP_USER`, and the 16-character App Password as `SMTP_PASS`.
5. The order-recipient inbox is configured as `siteConfig.email` in `lib/site-config.ts`.
6. Customers see the authenticated `SMTP_USER` as the sender. Their replies are directed to the office inbox.

Both emails are responsive, table-based HTML with inline styles for Gmail compatibility. The business email contains customer and product details plus a follow-up callout. The customer email explains the next steps and warns against unverified payment instructions.

## Testing a complete submission

1. Add all Google Sheets and SMTP environment values.
2. Run `npm run dev`.
3. Add at least one product on the homepage and continue to checkout.
4. Submit using an email address you can check.
5. Confirm all four outcomes:
   - A new row appears in `Customer_Inquiries`.
   - The business inbox receives the new-inquiry email.
   - The customer inbox receives the inquiry-received email.
   - The browser reaches `/order-confirmation` and shows the same inquiry ID.
6. Also test invalid email, missing location, an empty cart and a temporary wrong SMTP password. Failed submissions should remain on checkout with a clear error.

Google Sheets is the primary order record. If the sheet saves but email delivery later fails, the API returns the inquiry ID with an email-delayed status so the customer does not submit the same request again. The confirmation page asks the customer to keep the reference number while the business resolves the email configuration.

## Build checks

```bash
npm run typecheck
npm run build
```

## Deploying on Vercel

1. Push the project to a Git repository and import it in Vercel.
2. Keep the framework preset as **Next.js**.
3. Add every value from `.env.example` under **Project Settings → Environment Variables** for Production and Preview as needed.
4. Set `NEXT_PUBLIC_SITE_URL` and `FRONTEND_URL` to the production URL. Their origins must match exactly.
5. Store `GOOGLE_PRIVATE_KEY` as the complete key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`. Literal `\n` line breaks are supported by the code.
6. Deploy, then run the complete submission test above on the production URL.
7. Add the final public phone, WhatsApp number, business email and address before advertising the site.

## Content safeguards

- Real photography is used for the construction, TMT-steel and wire visuals. Sarbottam and Hongshi use product photographs.
- Gajraj, Sagarmatha, Shaurya and material groups without an authorized product photo use neutral real construction photography.
- The site contains no customer-review section because no verified testimonials were provided.
- The video/reels section is intentionally omitted because no video links were provided.
- Pricing always reads **Request latest price** or **Pending quotation**.
- Delivery fees and advance-payment details are never guessed.
- Bank details must come from an authorized representative after quotation confirmation.

See [IMAGE-SOURCES.md](./IMAGE-SOURCES.md) for product-image and photography sources.
