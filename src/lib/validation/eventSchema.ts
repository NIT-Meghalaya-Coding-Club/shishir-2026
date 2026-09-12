import { z } from "zod";

const httpUrl = z.string().trim().url("Enter a valid URL.").refine(
  (value) => /^https?:\/\//i.test(value),
  "URL must start with http:// or https://."
);

export const EventPayloadSchema = z
  .object({
    name: z.string().trim().min(2, "Event name must be at least 2 characters.").max(120, "Event name must be 120 characters or fewer."),
    category: z.string().trim().min(1, "Select or create a category."),
    categoryId: z.string().trim().min(1, "Select or create a category."),
    location: z.string().trim().min(2, "Location is required.").max(150, "Location must be 150 characters or fewer."),
    startsAt: z.string().min(1, "Start date and time are required."),
    endsAt: z.string().min(1, "End date and time are required."),
    description: z.string().trim().min(10, "Description must be at least 10 characters.").max(2000, "Description must be 2000 characters or fewer."),
    eventType: z.enum(["individual", "team", "performance"]),
    minParticipants: z.number().int().min(1, "Minimum participants must be at least 1."),
    maxParticipants: z.number().int().min(1, "Maximum participants must be at least 1."),
    allowPerformanceTypes: z.boolean(),
    paymentRequired: z.object({
      amount: z.number().finite().min(0, "Payment amount cannot be negative."),
      qrCodeUrl: z.string().trim().refine((value) => !value || /^https?:\/\//i.test(value), "Payment QR URL must start with http:// or https://."),
    }).nullable(),
    rulebookLink: httpUrl,
    posterLink: z.string().trim(),
  })
  .superRefine((data, context) => {
    const startsAt = new Date(data.startsAt);
    const endsAt = new Date(data.endsAt);
    if (Number.isNaN(startsAt.getTime())) {
      context.addIssue({ code: "custom", path: ["startsAt"], message: "Enter a valid start date and time." });
    }
    if (Number.isNaN(endsAt.getTime())) {
      context.addIssue({ code: "custom", path: ["endsAt"], message: "Enter a valid end date and time." });
    }
    if (!Number.isNaN(startsAt.getTime()) && !Number.isNaN(endsAt.getTime()) && endsAt <= startsAt) {
      context.addIssue({ code: "custom", path: ["endsAt"], message: "End time must be after start time." });
    }
    if (data.maxParticipants < data.minParticipants) {
      context.addIssue({ code: "custom", path: ["maxParticipants"], message: "Maximum participants must be at least the minimum." });
    }
    if (!data.posterLink) {
      context.addIssue({ code: "custom", path: ["posterLink"], message: "Choose a poster image." });
    }
  });
