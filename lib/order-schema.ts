import { z } from "zod";

export const inquiryItemSchema = z.object({
  productId: z.string().trim().min(1).max(80),
  productName: z.string().trim().min(2).max(120),
  variant: z.string().trim().min(1).max(100),
  quantity: z.coerce.number().positive().max(1_000_000),
  unit: z.string().trim().min(1).max(40),
});

export const orderSchema = z.object({
  requestToken: z.string().uuid(),
  fullName: z.string().trim().min(2, "Please enter your full name.").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(24)
    .regex(/^[+\d][\d\s()-]+$/, "Please enter a valid phone number."),
  email: z.string().trim().email("Please enter a valid email address.").max(160),
  location: z.string().trim().min(5, "Kindly share your exact location.").max(500),
  notes: z.string().trim().max(1000).optional().default(""),
  company: z.string().max(100).optional().default(""),
  items: z.array(inquiryItemSchema).min(1, "Select at least one product.").max(20),
  consent: z.literal(true, { error: "Please confirm that the sales team may contact you." }),
});

export type OrderInput = z.infer<typeof orderSchema>;
