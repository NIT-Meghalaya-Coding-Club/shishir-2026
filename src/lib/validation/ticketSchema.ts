import { z } from "zod";

export const TicketCheckoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Name must be 100 characters or fewer.")
    .regex(/^[A-Za-z][A-Za-z .'-]*$/, "Name contains invalid characters."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, "Phone number must contain 10 to 15 digits."),
  quantity: z.number().int().min(1).max(10),
  termsAccepted: z.literal(true, "Please accept the terms and conditions."),
});
