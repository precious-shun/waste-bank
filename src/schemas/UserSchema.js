import { z } from "zod";

export const userSchema = z.object({
  fullname: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email"),
  balance: z
    .number({ invalid_type_error: "Balance must be a number" })
    .min(0, "Balance cannot be negative"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender is required" }),
  }),
});
