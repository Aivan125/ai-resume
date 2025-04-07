"use server";

import openai from "@/lib/openai";
import {
  canCreateResume,
  canUseAITools,
  canUseCustomizations,
} from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  resumeSchema,
  ResumeValues,
  WorkExperience,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";

export async function saveResume(values: ResumeValues) {
  const { id } = values;

  console.log("received values:", values);

  // le estamos pasando los valores a este Schema en zod para verificar que estan correctos, en lugar de hacer una nueva validacion usamos la que creamos y por medio del método in-built de zod, parse, le pasamos estos valores al esquema de validación llamado resumeSchema
  const { photo, workExperiences, educations, ...resumeValues } =
    resumeSchema.parse(values);

  // Obtener el id del usauario loggeado, esto es para saber el CV que le pertenece a este usuario loggeado
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not Authenticated");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!id) {
    const resumeCount = await prisma.resume.count({ where: { userId } });

    if (!canCreateResume(subscriptionLevel, resumeCount)) {
      throw new Error(
        "Maximum resume count reached for this subscription level",
      );
    }
  }

  const existingResume = id
    ? await prisma.resume.findUnique({ where: { id, userId } })
    : null;

  if (id && !existingResume) {
    throw new Error("Resume not found");
  }

  let newPhotoUrl: string | undefined | null = undefined;

  const hasCustomization =
    (resumeValues.borderStyle &&
      resumeValues.borderStyle !== existingResume?.borderStyle) ||
    (resumeValues.colorHex &&
      resumeValues.colorHex !== existingResume?.colorHex);

  if (hasCustomization && !canUseCustomizations(subscriptionLevel)) {
    throw new Error("Customizations not allowed for this subscription level");
  }

  if (photo instanceof File) {
    if (existingResume?.photoUrl) {
      await del(existingResume?.photoUrl);
    }

    const blob = await put(`resume_photos/${photo.name}`, photo, {
      access: "public",
    });

    newPhotoUrl = blob.url;
  } else if (photo === null) {
    // Solo borrar la foto actual, o sea no cambiar de foto, solo borrar la existente y para eso desde el formulario enviamos el fiel de photo como null. Undefined significa que aun no hay foto peo se va a subir una, null significa que estamos enviando el campo vacío, si estipo File es que estamos cargando una foto de nuestra computadora y si es una URL es que ya tiene una imagen cargada

    if (existingResume?.photoUrl) {
      await del(existingResume?.photoUrl);
      newPhotoUrl = null;
    }
  }

  if (id) {
    return prisma.resume.update({
      where: { id },
      data: {
        ...resumeValues,
        photoUrl: newPhotoUrl,
        workExperiences: {
          deleteMany: {},
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          deleteMany: {},
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
        // updatedAt: new Date(),
      },
    });
  } else {
    return prisma.resume.create({
      data: {
        ...resumeValues,
        userId,
        photoUrl: newPhotoUrl,
        workExperiences: {
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
      },
    });
  }
}

export async function generateSummary(input: GenerateSummaryInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }
  // validar los input con zod. Podemos usar parse para pasarle la info al schema.
  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  const systemMessage = `You are a job resume generator AI. Your task is to write  a professional introduction summary for a resume given the user's provided data. Only return the summary and do not include any other infor,ation in the response. Keep it concise and professional.`;

  const userMessage = `Please generate a professional resume summary from this data:
  
  Job title: ${jobTitle || "N/A"}

  Work experience:
  ${workExperiences
    ?.map(
      (exp) => `
    
    Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

    Description: ${exp.description || "N/A"}
    `,
    )
    .join("/n/n")}

  Education:
  ${educations
    ?.map(
      (edu) => `
    
    Position: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
    `,
    )
    .join("/n/n")}

    Skills: ${skills}
  `;

  const completion = await openai.responses.create({
    model: "gpt-3.5-turbo",
    instructions: systemMessage,
    input: [
      { role: "system", content: systemMessage, type: "message" },
      { role: "user", content: userMessage, type: "message" },
    ],
  });

  console.log("RESPONSE OPEN AI", completion.output_text);

  return completion.output_text;
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade your subscription to use this feature");
  }

  const { description } = generateWorkExperienceSchema.parse(input);

  const systemMessage = `You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input. Your response must adhere here to the following structure. You can omit fields if they can't be infered from the previous data, but don't add new ones. 
  
  Job title: <job title>
  Company: <company name>
  Start date: <format: YYY-MM-DD> (only if provided)
  End Date:  <format: YYY-MM-DD> (only if provided)
  Description: <an optimized  description in bullet format, might be inferred from the job title>
  `;

  const userMessage = `
  Please provide a work experience entry from this description:
${description}
  `;

  const completion = await openai.responses.create({
    model: "gpt-3.5-turbo",
    instructions: systemMessage,
    input: [
      { role: "system", content: systemMessage, type: "message" },
      { role: "user", content: userMessage, type: "message" },
    ],
  });

  const aiResponse = completion.output_text;

  if (!aiResponse) throw new Error("Failed to generate AI response");

  console.log("RESPONSE OPEN AI", aiResponse);

  // El método match() se utiliza para buscar patrones específicos dentro de ese string utilizando expresiones regulares
  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies WorkExperience;
}
