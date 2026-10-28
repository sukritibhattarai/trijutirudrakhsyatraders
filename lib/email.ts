import nodemailer from "nodemailer";
import type { OrderInput } from "@/lib/order-schema";
import { siteConfig } from "@/lib/site-config";

type InquiryEmailRecord = {
  inquiryId: string;
  createdAt: string;
  input: OrderInput;
};

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function escapeHtml(value: string | number) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emailShell(content: string, preheader: string) {
  const brand = escapeHtml(process.env.BRAND_NAME || "Trijuti Rudrakshya Traders Pvt. Ltd.");
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;background:#eef2f6;font-family:Arial,sans-serif;color:#13233c">
    <div style="display:none;max-height:0;overflow:hidden">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2f6;padding:28px 12px">
      <tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(15,37,64,.08)">
        <tr><td style="background:#0c2442;padding:24px 30px;color:white"><div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#f59e0b;font-weight:bold">Construction materials</div><div style="font-size:22px;font-weight:bold;margin-top:6px">${brand}</div></td></tr>
        <tr><td style="padding:30px">${content}</td></tr>
        <tr><td style="padding:20px 30px;background:#f7f9fb;color:#617087;font-size:12px;line-height:1.6">This message relates to a quotation inquiry. Prices, stock, delivery charges and payment instructions must be confirmed by authorized company staff.</td></tr>
      </table></td></tr>
    </table>
  </body></html>`;
}

function itemRows(input: OrderInput) {
  return input.items
    .map((item) => `<tr><td style="padding:12px 0;border-bottom:1px solid #e5eaf0"><strong>${escapeHtml(item.productName)}</strong><br><span style="color:#617087">${escapeHtml(item.variant)}</span></td><td align="right" style="padding:12px 0;border-bottom:1px solid #e5eaf0">${escapeHtml(item.quantity)} ${escapeHtml(item.unit)}</td></tr>`)
    .join("");
}

function transporter() {
  const port = Number(required("SMTP_PORT"));
  const host = required("SMTP_HOST").trim();
  const user = required("SMTP_USER").trim();
  const rawPassword = required("SMTP_PASS").trim();
  const password = host === "smtp.gmail.com" ? rawPassword.replaceAll(" ", "") : rawPassword;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });
}

export async function sendInquiryEmails(record: InquiryEmailRecord) {
  const businessEmails = siteConfig.orderNotificationEmails;
  const replyToEmail = siteConfig.email;
  const brand = process.env.BRAND_NAME || "Trijuti Rudrakshya Traders Pvt. Ltd.";
  const from = `${brand} <${required("SMTP_USER").trim()}>`;
  const mailer = transporter();

  await mailer.verify();

  const businessHtml = emailShell(`
    <div style="display:inline-block;background:#fff4df;color:#9a5300;border-radius:999px;padding:7px 12px;font-size:12px;font-weight:bold">NEW ORDER REQUEST</div>
    <h1 style="font-size:28px;line-height:1.25;margin:16px 0 8px">A new order request was received</h1>
    <p style="color:#617087;margin:0 0 22px">Inquiry ${escapeHtml(record.inquiryId)} · ${escapeHtml(record.createdAt)}</p>
    <div style="background:#f7f9fb;border-radius:12px;padding:18px;margin-bottom:20px;line-height:1.7">
      <strong>Customer</strong><br>${escapeHtml(record.input.fullName)}<br>${escapeHtml(record.input.phone)}<br>${escapeHtml(record.input.email)}<br>${escapeHtml(record.input.location)}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${itemRows(record.input)}</table>
    ${record.input.notes ? `<p style="margin:20px 0 0"><strong>Project notes:</strong><br>${escapeHtml(record.input.notes)}</p>` : ""}
    <div style="background:#0c2442;color:#fff;border-left:5px solid #f59e0b;border-radius:10px;padding:16px 18px;margin-top:24px;line-height:1.5"><strong>Please contact the customer soon.</strong><br><span style="color:#d9e4ef">Confirm price, stock, delivery charges and the verified advance-payment process before accepting the order.</span></div>
  `, `New quotation inquiry ${record.inquiryId}`);

  const customerHtml = emailShell(`
    <div style="font-size:44px;line-height:1">✓</div>
    <h1 style="font-size:28px;line-height:1.25;margin:14px 0 10px">We received your order request</h1>
    <p style="font-size:16px;line-height:1.7;color:#42536b">Hi ${escapeHtml(record.input.fullName)}, thank you for contacting ${escapeHtml(brand)}. Your order-request reference is <strong>${escapeHtml(record.inquiryId)}</strong>.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px">${itemRows(record.input)}</table>
    <div style="background:#fff7e8;border:1px solid #f5d89f;border-radius:12px;padding:18px;margin-top:22px;line-height:1.6"><strong>What happens next?</strong><br>Our sales team will confirm the latest price, stock availability, delivery charge and advance amount. Only use bank details sent through a verified company representative.</div>
    <p style="color:#617087;line-height:1.7;margin-top:22px">This email confirms receipt of your order request. The order is accepted only after our team confirms the quotation, stock, delivery and payment details.</p>
  `, `We received order request ${record.inquiryId}`);

  const [businessResults, customerResult] = await Promise.all([
    Promise.all(businessEmails.map((businessEmail) => mailer.sendMail({
      from,
      to: businessEmail,
      replyTo: record.input.email,
      subject: `New order request received - ${record.inquiryId}`,
      html: businessHtml,
    }))),
    mailer.sendMail({
      from,
      to: record.input.email,
      replyTo: replyToEmail,
      subject: `Your order request has been received - ${brand}`,
      html: customerHtml,
    }),
  ]);

  if (businessResults.some((result) => result.rejected.length) || customerResult.rejected.length) {
    throw new Error("The email provider rejected one or more recipients.");
  }
  console.info(`[Inquiry ${record.inquiryId}] Gmail SMTP accepted ${businessResults.length} business notifications and the customer confirmation.`);
}
