import ResumeEditor from "@/components/ResumeEditor";
import { prisma } from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{ resumeId?: string }>;
}

export const metadata: Metadata = {
  title: "Design your resume",
};

export default async function Page({ searchParams }: PageProps) {
  const { resumeId } = await searchParams;

  const user = await auth();
  console.log(user);

  if (!user.userId) return null;

  // en prisma necesitas  especificar cuando quieres incluir los atributos de uan tabla que estan relacionadas a otra tabla. En este caso, workExperiences y educations son otras tablas y para incluir los valores de estas tablas hay que especificarlas.
  const resumeToEdit =
    resumeId && user.userId
      ? await prisma.resume.findUnique({
          where: { id: resumeId, userId: user.userId },
          include: resumeDataInclude,
        })
      : null;

  console.log(resumeToEdit);

  return <ResumeEditor resumeToEdit={resumeToEdit} />;
}
