import { JsonValue } from "./section-registry";

export interface SectionComponentProps {
  data: Record<string, JsonValue>;
}

export interface GlobalStyles {
  primaryColor: string;
  textColor: string;
  backgroundColor: string;
  customCss: string;
}

export interface EditableField {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "image";
}

export interface SectionDefinition {
  label: string;
  labelAr: string;
  defaultData: Record<string, JsonValue>;
  editableFields: EditableField[];
}
