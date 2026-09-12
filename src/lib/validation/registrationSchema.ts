import { z } from "zod";

export const RegistrationPayloadSchema = z.object({
  eventId: z.string().trim().min(1, "Event is required."),
  teamData: z
    .array(z.object({ email: z.string().trim().email("Enter a valid registered email address.") }))
    .min(1, "Add at least one participant.")
    .superRefine((members, context) => {
      const emails = members.map((member) => member.email.toLowerCase());
      if (new Set(emails).size !== emails.length) {
        context.addIssue({
          code: "custom",
          path: ["teamData"],
          message: "Each participant email must be unique.",
        });
      }
    }),
  metadata: z.object({
    eventType: z.enum(["individual", "team", "performance"]),
    groupName: z.string().trim().optional(),
    performanceType: z.string().trim().optional(),
    dynamicEventCode: z.string().trim().optional(),
    dynamicEventType: z.string().trim().optional(),
    minParticipants: z.number().int().min(1),
    maxParticipants: z.number().int().min(1),
  }),
});
