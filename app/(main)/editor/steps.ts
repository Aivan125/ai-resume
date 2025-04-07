import { EditorFormProps } from "@/lib/types";
import GeneralInfoForm from "./_components/GeneralInfoForm";
import PersonalInfoForm from "./_components/PersonalInfoForm";
import WorkExperienceForm from "./_components/WorkExperienceForm";
import EducationForm from "./_components/EducationForm";
import SkillsForm from "./_components/SkillsForm";
import SummaryForm from "./_components/SummaryForm";

export const steps: {
  title: string;
  component: React.ComponentType<EditorFormProps>;
  key: string;
}[] = [
  { title: "General Info", component: GeneralInfoForm, key: "general-info" },
  { title: "Personal Info", component: PersonalInfoForm, key: "personal-info" },
  {
    title: "Work experience",
    component: WorkExperienceForm,
    key: "work-experience",
  },
  {
    title: "Education",
    component: EducationForm,
    key: "education",
  },
  {
    title: "Skills",
    component: SkillsForm,
    key: "skills",
  },
  {
    title: "Summary",
    component: SummaryForm,
    key: "summary",
  },
];
