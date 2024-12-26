import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FormComponent } from "@/types/formBuilder";
import { PopupComponent } from "./PopupComponent";

interface FormBuilderCanvasContentProps {
  components: FormComponent[];
  onSelectComponent?: (component: FormComponent) => void;
  onUpdateComponents?: (components: FormComponent[]) => void;
  isNested?: boolean;
}

export const FormBuilderCanvasContent = ({
  components,
  onSelectComponent,
  onUpdateComponents,
  isNested = false,
}: FormBuilderCanvasContentProps) => {
  const renderComponent = (component: FormComponent) => {
    const commonProps = {
      placeholder: component.placeholder,
      className: cn("w-full", component.style?.width && `w-[${component.style.width}]`),
      style: component.style,
    };

    switch (component.type) {
      case 'h1':
        return <h1 className="text-4xl font-bold mb-4">{component.placeholder}</h1>;
      case 'h2':
        return <h2 className="text-2xl font-semibold mb-3">{component.placeholder}</h2>;
      case 'paragraph':
        return <p className="text-gray-600 mb-4">{component.placeholder}</p>;
      case 'input':
        return <Input type="text" {...commonProps} />;
      case 'textarea':
        return <Textarea {...commonProps} />;
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={component.id} />
            <Label htmlFor={component.id}>{component.placeholder}</Label>
          </div>
        );
      case 'phone':
        return <Input type="tel" {...commonProps} />;
      case 'email':
        return <Input type="email" {...commonProps} />;
      case 'number':
        return <Input type="number" {...commonProps} />;
      case 'date':
        return <Calendar className="rounded-md border" />;
      case 'select':
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={component.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {component.options?.map((option: string, index: number) => (
                <SelectItem key={index} value={option.toLowerCase()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'radio':
        return (
          <RadioGroup className="flex flex-col space-y-2">
            {component.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option.toLowerCase()} id={`${component.id}-${index}`} />
                <Label htmlFor={`${component.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'file':
        return (
          <Input
            type="file"
            className="cursor-pointer"
            {...commonProps}
          />
        );
      case 'toggle':
        return (
          <div className="flex items-center space-x-2">
            <Switch id={component.id} />
            <Label htmlFor={component.id}>{component.placeholder}</Label>
          </div>
        );
      case 'link':
        return (
          <a href="#" className="text-primary hover:underline">
            {component.placeholder}
          </a>
        );
      case 'popup-sm':
      case 'popup-md':
      case 'popup-lg':
      case 'popup-xl':
      case 'popup-2xl':
      case 'popup-3xl':
      case 'popup-4xl':
      case 'popup-5xl':
      case 'popup-6xl':
      case 'popup-7xl':
      case 'popup-custom':
        return <PopupComponent component={component} onUpdateComponents={onUpdateComponents} />;
      case 'conditional':
        return (
          <div className="border p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-2">Conditional Logic Block</p>
            <div className="space-y-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="not-equals">Not equals</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || !onUpdateComponents) return;

    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onUpdateComponents(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="form-canvas">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {components.map((component, index) => (
              <Draggable
                key={component.id}
                draggableId={component.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onSelectComponent?.(component)}
                    className={cn(
                      "border p-4 rounded-lg cursor-pointer hover:border-primary transition-colors bg-white shadow-sm",
                      !isNested && "animate-fade-in"
                    )}
                  >
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      {component.label}
                      {component.required && <span className="text-destructive ml-1">*</span>}
                    </label>
                    {renderComponent(component)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {components.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {isNested ? "Add components to this popup" : "Drag and drop components here to build your form"}
              </div>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};