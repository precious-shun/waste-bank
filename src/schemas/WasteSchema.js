import { z } from "zod";

export const wasteSchema = z.object({
  waste: z.string().min(1, "Waste name is required"),
  unit: z.string().min(1, "Unit is required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0"),
});
