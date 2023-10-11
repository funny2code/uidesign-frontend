import type { DocumentResult } from "../../../../client";
import type { Tokens } from "../../../auth/storage";

export interface DataContent {
  slot_type: string;
  message_content: string;
  system_message: string;
  pre_message: string;
}
export interface ComponentContent {
  config: string;
  markup: string;
}
export interface ConfigData extends DocumentResult {
  data: DataContent | ComponentContent;
}
export interface FormProps {
  type: string;
  category: string;
  tokens: Tokens;
  document: ConfigData;
  height: number;
  width: number;
  hasPreMessage?: boolean;
}
export interface SectionElementProps {
  category: string;
  description: string;
  tokens: Tokens;
  values: string[];
  hasPreMessage?: boolean;
}
export interface SectionComponentProps {
  category: string;
  description: string;
  tokens: Tokens;
  values: string;
  hasPreMessage?: boolean;
}
export interface ContentComponent {
  config: string;
  markup: string;
  tag?: string;
}
export interface ComponentData extends DocumentResult {
  data: ContentComponent;
}
export interface FormComponentProps {
  category: string;
  tokens: Tokens;
  doc: ComponentData;
  hasPreMessage?: boolean;
  acallback: (id: string) => Promise<void>;
  width: number;
  height: number;
}
export type ContentComponentsTypes = "content_slot" | "tailwind_component" | "mobile_component";
