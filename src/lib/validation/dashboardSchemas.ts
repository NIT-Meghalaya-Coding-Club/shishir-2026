import { z } from "zod";

export const CommitteePayloadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Committee name must be at least 2 characters.")
    .max(100, "Committee name must be 100 characters or fewer."),
  code: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Code may contain lowercase letters, numbers, and single hyphens only."),
  committeeHeadCollegeIDs: z.array(z.string().trim().min(1)).min(1, "Add at least one committee head."),
  coordinatorCollegeIDs: z.array(z.string().trim().min(1)),
  coCoordinatorCollegeIDs: z.array(z.string().trim().min(1)),
});
