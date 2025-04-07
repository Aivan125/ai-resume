import { z } from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));

// GENERAL INFO VALIDATION
export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;

// PERSONAL INFO VALIDATION

// Create the complete schema
export const personalInfoSchema = z.object({
  photo: z
    .custom<File | undefined>()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Must be an image file",
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4,
      "File must be less than 4MB",
    ),

  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  jobTitle: z.string().trim().optional(),
  city: z.string().trim().optional(),
  country: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal("")),
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

// WORK EXPERIENCE VALIDATION
// empezamos como z.object porque esta inforamación es una propiedad de un objeto.
export const workExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        position: optionalString,
        company: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
      }),
    )
    .optional(),
});

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>;

export type WorkExperience = NonNullable<
  z.infer<typeof workExperienceSchema>["workExperiences"]
>[number];

// EDUCATION VALIDATION

export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        degree: optionalString,
        school: optionalString,
        startDate: optionalString,
        endDate: optionalString,
      }),
    )
    .optional(),
});

export type EducationValues = z.infer<typeof educationSchema>;

// SKILLS VALIDATION
export const skillsSchema = z.object({
  skills: z.array(z.string().trim()).optional(),
});

export type SkillsValues = z.infer<typeof skillsSchema>;

// SUMMARY VALIDATION

export const summarySchema = z.object({ summary: optionalString });

export type summaryValues = z.infer<typeof summarySchema>;

// juntamos los schemas de generalInfoSchema y personalInfoSchema
export const resumeSchema = z.object({
  ...generalInfoSchema.shape,
  ...personalInfoSchema.shape,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
  ...summarySchema.shape,
  colorHex: optionalString,
  borderStyle: optionalString,
});

// juntamos los tipos de los schemas generalInfoSchema y personalInfoSchema y para no repetir la propiedad photo "omitimos" la propieda photo de resumeSchema y agregamos la nueva ya que al obtener la info de la base de datos tendremos tres tipos de types.
export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string;
  photo?: File | string | null;
};

export const generateWorkExperienceSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Required")
    .min(20, "Must be at least 20 characters"),
});

export type GenerateWorkExperienceInput = z.infer<
  typeof generateWorkExperienceSchema
>;

export const generateSummarySchema = z.object({
  jobTitle: optionalString,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
});

export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>;
