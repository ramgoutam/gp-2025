import { Database } from "@/integrations/supabase/types";

export type FormComponent = {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  style?: {
    width?: string;
    [key: string]: string | undefined;
  };
};

export type FormTemplateConfig = {
  components: FormComponent[];
};

export type FormTemplate = Database["public"]["Tables"]["form_templates"]["Row"] & {
  config: FormTemplateConfig;
};