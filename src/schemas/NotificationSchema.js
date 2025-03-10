import { z } from "zod";

export const notificationSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  message: z.string().min(1, { message: "Message is required" }),
  recipients: z
    .array(z.string())
    .min(1, { message: "At least one recipient is required" }),
});
