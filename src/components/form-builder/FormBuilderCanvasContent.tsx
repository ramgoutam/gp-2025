import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FormComponent } from "@/types/formBuilder";
import { ComponentSettings } from "./ComponentSettings";
import { ResizableComponent } from "./ResizableComponent";
import { FormComponentRenderer } from "./FormComponent";

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
  const handleUpdateComponent = (index: number, updatedComponent: FormComponent) => {
    if (!onUpdateComponents) return;
    
    const newComponents = [...components];
    newComponents[index] = updatedComponent;
    onUpdateComponents(newComponents);
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
                    className="relative border p-4 rounded-lg cursor-pointer hover:border-primary transition-colors bg-white shadow-sm animate-fade-in"
                  >
                    <ComponentSettings 
                      component={component}
                      onUpdateComponent={(updatedComponent) => handleUpdateComponent(index, updatedComponent)}
                    />
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      {component.label}
                      {component.required && <span className="text-destructive ml-1">*</span>}
                    </label>
                    <ResizableComponent
                      component={component}
                      onUpdateComponent={(updatedComponent) => handleUpdateComponent(index, updatedComponent)}
                    >
                      <FormComponentRenderer component={component} />
                    </ResizableComponent>
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