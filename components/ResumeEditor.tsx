"use client";

import Breadcrumbs from "@/app/(main)/editor/_components/Breadcrumbs";
import ResumePreviewSection from "@/app/(main)/editor/_components/ResumePreviewSection";
import { useAutoSaveResume } from "@/app/(main)/editor/_hooks/useAutoSaveResume";

import Footer from "@/app/(main)/editor/_components/Footer";
import { steps } from "@/app/(main)/editor/steps";
import { useUnloadWarning } from "@/hooks/useUnloadWarning";
import { cn, mapToResumeVales } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ResumeServerData } from "@/lib/types";

interface ResumeEditorProps {
  resumeToEdit: ResumeServerData | null;
}

export default function ResumeEditor({ resumeToEdit }: ResumeEditorProps) {
  const searchParams = useSearchParams();
  // necesitamos transformara los datos de resumeToEdit porque el tipo de las fechas que recibe son del tipo Date (objeto) pero ResumeValues acepeta las fechas en tipo strings, por lo que hay que hacer una transformación de los datos.
  const [resumeData, setResumeData] = useState<ResumeValues>(
    resumeToEdit ? mapToResumeVales(resumeToEdit) : {},
  );
  const [showSmResumePreview, setShowSmResumePreview] = useState(false);
  // podríamos usar useRouter y construir la ruta, seria otra opción
  // const router = useRouter();
  // const pathName = usePathname();

  const currentStep = searchParams.get("step") || steps[0].key;

  const setStep = (key: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set("step", key);

    // al usar window. history se cambia la url sin hacer una request al server
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);

    // al usar router.push se hace una request al server lo cual ocasiona un delay
    // router.push(`${pathName}?${newSearchParams.toString()}`);
  };

  const { isSaving, hasUnsavedChanges } = useAutoSaveResume(resumeData);

  useUnloadWarning(hasUnsavedChanges);

  const FormComponent = steps.find(
    (step) => step.key === currentStep,
  )?.component;

  return (
    <div className="flex grow flex-col">
      <header className="space-y-1.5 border-b border-slate-400/50 px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Design your resume</h1>
        <p className="text-muted-foreground text-sm">
          Follow the steps below to create your resume. Your progress will be
          saved automatically.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full grow">
          <div
            className={cn(
              "w-full space-y-6 overflow-y-auto p-3 md:block md:w-1/2",
              showSmResumePreview && "hidden",
            )}
          >
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && (
              <FormComponent
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
          </div>
          <div className="grow border-slate-400/50 md:border-r" />
          <ResumePreviewSection
            resumeData={resumeData}
            setResumeData={setResumeData}
            className={cn(showSmResumePreview && "flex")}
          />
        </div>
      </main>
      <Footer
        currentStep={currentStep}
        setCurrentStep={setStep}
        showSmResumePreview={showSmResumePreview}
        setShowSmResumePreview={setShowSmResumePreview}
        isSaving={isSaving}
      />
    </div>
  );
}
