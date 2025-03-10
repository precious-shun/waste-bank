import { z } from "zod";

export const TransactionSchema = z.object({
  transactionDate: z.string().nonempty("Date is required"),
  selectedUser: z
    .object({
      id: z.string(),
      fullname: z.string(),
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "User is required",
    }),
  transactionItems: z
    .array(
      z.object({
        waste_product_id: z
          .object({
            id: z.string(),
            waste: z.string(),
            price: z.number(),
            unit: z.string().optional(),
          })
          .nullable()
          .refine((val) => val !== null, {
            message: "Product is required",
          }),
        quantity: z
          .number()
          .min(1, "Quantity must be at least 1")
          .or(z.string().transform((val) => parseInt(val) || 0)),
        subtotal: z.number().optional(),
      })
    )
    .min(1, "At least one product is required"),
});
