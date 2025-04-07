import { Prisma } from "@prisma/client";
import { ResumeValues } from "./validation";

export interface EditorFormProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
}

/*
Fue introducida en TypeScript 4.9 y es muy útil para verificar tipos sin cambiar el tipo inferido de la expresión.El operador satisfies verifica que un valor cumple con un tipo específico, pero a diferencia de una aserción de tipo (usando as), mantiene el tipo original inferido para el valor.
Lo que ocurre es:

Prisma genera automáticamente el tipo Prisma.ResumeInclude basado en las relaciones que definiste en tu esquema para el modelo Resume.
Este tipo refleja exactamente las relaciones que has definido en tu modelo. En tu caso, workExperiences: WorkExperience[] y educations: Education[].
El operador satisfies verifica en tiempo de compilación que el objeto que has creado (con workExperiences: true y educations: true) es válido según estas definiciones.

En resumen, lo que hace es que las propiedades que escribas dentro del objeto de resumeDataInclude esten dentro del schema de Prisma asi por si hay un error como escribir education en lugar de educations con "s" marcará un error. 

Cuando defines tus modelos en el esquema de Prisma (en el archivo schema.prisma), el cliente de Prisma genera automáticamente una serie de tipos TypeScript para cada modelo. Estos tipos incluyen:

Resume - El tipo base para tu modelo
ResumeWhereInput - Para filtros en consultas findMany
ResumeOrderByInput - Para ordenar resultados
ResumeInclude - Para especificar qué relaciones incluir (especificar que tablas)
ResumeSelect - Para especificar qué campos seleccionar (que atributos)
Y varios más...

export const resumeDataInclude = {
  workExperiences: true,
  educations: true,
  certificates: true, // ¡Error! Esta relación no existe en el modelo Resume
} satisfies Prisma.ResumeInclude;
*/

export const resumeDataInclude = {
  workExperiences: true,
  educations: true,
} satisfies Prisma.ResumeInclude;

// aqui defino todos los tipos de Resume junto con los tipos de sus relaciones (inlcude)
export type ResumeServerData = Prisma.ResumeGetPayload<{
  include: typeof resumeDataInclude;
}>;
