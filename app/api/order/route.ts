import { NextRequest, NextResponse } from "next/server";
import { orderSchema } from "@/lib/order-schema";
import { saveInquiryToSheet } from "@/lib/google-sheets";
import { sendInquiryEmails } from "@/lib/email";
import { productById } from "@/lib/products";

export const runtime = "nodejs";

function makeInquiryId() {
  const date = new Date();
  const stamp = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date).replaceAll("-", "");
  return `TRT-${stamp}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

function isAllowedOrigin(request: NextRequest) {
  const allowed = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_SITE_URL;
  const origin = request.headers.get("origin");
  if (!allowed || !origin) return true;
  try {
    return new URL(origin).origin === new URL(allowed).origin;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ success: false, message: "This request origin is not allowed." }, { status: 403 });
  }

  try {
    const payload = await request.json();
    const result = orderSchema.safeParse(payload);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return NextResponse.json({ success: false, message: firstIssue?.message || "Please check the form and try again." }, { status: 400 });
    }

    // Quietly acknowledge bot-filled honeypots without touching external services.
    if (result.data.company) {
      return NextResponse.json({ success: true, inquiryId: makeInquiryId() });
    }

    const hasInvalidItem = result.data.items.some((item) => {
      const product = productById(item.productId);
      return !product || !product.variants.includes(item.variant) || !product.units.includes(item.unit);
    });
    if (hasInvalidItem) {
      return NextResponse.json({ success: false, message: "One or more selected products are invalid. Please rebuild your inquiry list." }, { status: 400 });
    }

    const normalizedInput = {
      ...result.data,
      items: result.data.items.map((item) => ({
        ...item,
        productName: productById(item.productId)!.name,
      })),
    };

    const record = {
      inquiryId: makeInquiryId(),
      createdAt: new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kathmandu",
        dateStyle: "medium",
        timeStyle: "medium",
      }).format(new Date()),
      input: normalizedInput,
    };

    const sheetResult = await saveInquiryToSheet(record);
    record.inquiryId = sheetResult.inquiryId;

    let emailDelivered = true;
    try {
      await sendInquiryEmails(record);
    } catch (emailError) {
      emailDelivered = false;
      const emailReference = crypto.randomUUID().slice(0, 8).toUpperCase();
      console.error(
        `[Inquiry ${record.inquiryId}] email delivery failed (${emailReference})`,
        emailError instanceof Error ? emailError.message : emailError,
      );
    }

    return NextResponse.json({
      success: true,
      inquiryId: record.inquiryId,
      emailDelivered,
      message: emailDelivered
        ? "Your inquiry was received and the confirmation email was sent."
        : "Your inquiry was received. Email delivery is temporarily delayed.",
    }, { status: 201 });
  } catch (error) {
    const reference = crypto.randomUUID().slice(0, 8).toUpperCase();
    console.error(`[Inquiry ${reference}] submission failed`, error instanceof Error ? error.message : error);
    const isConfigurationError = error instanceof Error && error.message.startsWith("Missing required environment variable:");
    return NextResponse.json({
      success: false,
      message: isConfigurationError
        ? "The inquiry service is not fully configured yet. Please contact the business directly."
        : `We could not complete your inquiry. Please try again or contact the business. Reference: ${reference}`,
    }, { status: 500 });
  }
}
