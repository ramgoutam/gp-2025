import { FormBuilderCanvasContent } from "./FormBuilderCanvasContent";
import { Card } from "@/components/ui/card";
import { FormComponent } from "@/types/formBuilder";

interface FormBuilderCanvasProps {
  components: FormComponent[];
  onSelectComponent: (component: FormComponent) => void;
  onUpdateComponents: (components: FormComponent[]) => void;
}

export const FormBuilderCanvas = ({
  components,
  onSelectComponent,
  onUpdateComponents,
}: FormBuilderCanvasProps) => {
  return (
    <Card className="p-6 min-h-[600px] bg-white shadow-md">
      <FormBuilderCanvasContent
        components={components}
        onSelectComponent={onSelectComponent}
        onUpdateComponents={onUpdateComponents}
      />
    </Card>
  );
};