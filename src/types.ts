export type Role =
  | "Medical Receptionist"
  | "Medical Administrative Assistant"
  | "Medical Biller"
  | "Medical Scribe"
  | "Health Educator"
  | "Dental Receptionist"
  | "Dental Biller"
  | "Executive Assistant VA"
  | "General Business VA"
  | "Other";

export type SupportRole = "CDVO and OS" | "Sales and Placement";

export type UserType = 
  | "Medical Client / Business Client"
  | "Virtual Assistant"
  | "MMM Support";

export type UserRole = "admin" | "responder";

export type QuestionType =
  | "text"
  | "textarea"
  | "radio"
  | "checkbox"
  | "scale"
  | "grid";

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  description?: string;
  variant?: "default" | "grid";
  options?: string[]; // For radio and checkbox
  optionsWithInputs?: string[]; // Options that should trigger a text input
  optionsWithCheckboxes?: Record<string, string[]>; // Options that should trigger a checkbox list
  rows?: string[]; // For grid
  rowsWithInputs?: string[]; // Grid rows that should trigger a text input
  rowsWithCheckboxes?: Record<string, string[]>; // Grid rows that should trigger a checkbox list
  columns?: string[]; // For grid
  gridInstruction?: string; // Informational text for grid questions
  required?: boolean;
  maxSelections?: number;
  min?: number; // For scale
  max?: number; // For scale
  minLabel?: string; // For scale
  maxLabel?: string; // For scale
  stepLabels?: Record<number, string>; // For scale
  dynamicRowsFrom?: string | string[]; // ID(s) of checkbox question(s) to pull rows from
  rateSubOptions?: boolean;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  role?: Role | string;
}

export interface SurveySchema {
  profile: Section;
  roleSections: Record<Role, Section[]>;
}

export interface ClientSurveySchema {
  initial: Section;
  roleSections: Record<Role, Section[]>;
}

export interface SupportSurveySchema {
  initial: Section;
  roleSections: Record<string, Section[]>;
}

export interface FullSurveySchema {
  client: ClientSurveySchema;
  va: SurveySchema;
  support: SupportSurveySchema;
}

export interface SurveyResponse {
  [questionId: string]: string | string[] | Record<string, string>;
}
