import { z } from "zod";

export const NIT_COLLEGE = "National Institute of Technology, Meghalaya";
export const COLLEGE_ID_PATTERN = /[A-Za-z]\d{2}[A-Za-z]{2}\d{3}/;

export function collegeIdFromEmail(email: string) {
  return email.split("@")[0].match(COLLEGE_ID_PATTERN)?.[0].toLowerCase() || "";
}

export function isNITEmail(email: string) {
  return email.trim().toLowerCase().endsWith("@nitm.ac.in");
}

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9]{10,15}$/, "Phone number must contain 10 to 15 digits.");

export const ProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Full name is required.")
      .max(100, "Full name must be 100 characters or fewer.")
      .regex(/^[A-Za-z][A-Za-z .'-]*$/, "Full name contains invalid characters."),
    gender: z.string().min(1, "Please select your gender."),
    dob: z.string().min(1, "Date of birth is required.").refine((value) => {
      const date = new Date(`${value}T00:00:00`);
      return !Number.isNaN(date.getTime()) && date <= new Date();
    }, "Please enter a valid date of birth that is not in the future."),
    college: z.string().min(1, "Please select your college."),
    collegeID: z
      .string()
      .trim()
      .min(1, "College ID is required.")
      .regex(/^[A-Za-z0-9-]{3,30}$/, "College ID contains invalid characters."),
    yearOfStudy: z.string().regex(/^[1-5]$/, "Year of study must be between 1 and 5."),
    dept: z
      .string()
      .trim()
      .min(1, "Department is required.")
      .max(100, "Department must be 100 characters or fewer."),
    email: z.string().trim().email("Please enter a valid email address."),
    phone: phoneSchema,
    alternateNumber: z
      .string()
      .trim()
      .refine(
        (value) => !value || /^\+?[0-9]{10,15}$/.test(value),
        "Alternate number must contain 10 to 15 digits."
      ),
    emergencyContact: phoneSchema,
    otherCollege: z.string(),
  })
  .superRefine((data, context) => {
    if (data.college === "Other" && !data.otherCollege.trim()) {
      context.addIssue({
        code: "custom",
        path: ["otherCollege"],
        message: "Please enter your college name.",
      });
    }

    if (data.college === NIT_COLLEGE && !isNITEmail(data.email)) {
      context.addIssue({
        code: "custom",
        path: ["email"],
        message: "National Institute of Technology requires an @nitm.ac.in email.",
      });
    }
  });
