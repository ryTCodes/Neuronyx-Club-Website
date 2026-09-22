export type FieldType =
  | "text"
  | "email"
  | "phone"
  | "dropdown"
  | "single-choice"
  | "multiple-choice"
  | "checkbox"
  | "paragraph"
  | "file"
  | "image"
  | "section";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  imageUrl?: string;
}

export interface FormStructure {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt: number;
  createdBy: string;
  slug: string;
  headerImage?: string;
  successMessage?: string;
  ctaLinkUrl?: string;
  ctaButtonText?: string;
  ctaDescription?: string;
  isOpen: boolean;
  limitOneResponse?: boolean;
  restrictToDomain?: boolean;
  theme?: {
    fontFamily: string;
    accentColor: string;
    backgroundColor: string;
  };
  updatedAt?: number;
}

export interface FormResponse {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  submittedAt: number;
  userEmail?: string;
}
