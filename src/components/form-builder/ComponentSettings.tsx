import React from 'react';
import { Settings, AlignLeft, AlignCenter, AlignRight, Type, Width, Height } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FormComponent } from "@/types/formBuilder";
import { Input } from "@/components/ui/input";

interface ComponentSettingsProps {
  component: FormComponent;
  onUpdateComponent: (updatedComponent: FormComponent) => void;
}

export const ComponentSettings = ({ component, onUpdateComponent }: ComponentSettingsProps) => {
  const handleRequiredToggle = () => {
    onUpdateComponent({
      ...component,
      required: !component.required,
    });
  };

  const handlePlaceholderEdit = () => {
    const newPlaceholder = prompt("Enter new placeholder text:", component.placeholder);
    if (newPlaceholder !== null) {
      onUpdateComponent({
        ...component,
        placeholder: newPlaceholder,
      });
    }
  };

  const handleLabelEdit = () => {
    const newLabel = prompt("Enter new label:", component.label);
    if (newLabel !== null) {
      onUpdateComponent({
        ...component,
        label: newLabel,
      });
    }
  };

  const handleStyleUpdate = (property: string, value: string) => {
    onUpdateComponent({
      ...component,
      style: {
        ...component.style,
        [property]: value,
      },
    });
  };

  const handleTextAlign = (align: 'left' | 'center' | 'right') => {
    handleStyleUpdate('textAlign', align);
  };

  const handleFontSize = (size: string) => {
    handleStyleUpdate('fontSize', size);
  };

  const handleCustomWidth = (width: string) => {
    handleStyleUpdate('width', width);
  };

  const handleCustomHeight = (height: string) => {
    handleStyleUpdate('height', height);
  };

  return (
    <div className="absolute top-2 right-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleLabelEdit}>
            Edit Label
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePlaceholderEdit}>
            Edit Placeholder
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRequiredToggle}>
            {component.required ? "Make Optional" : "Make Required"}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <AlignLeft className="mr-2 h-4 w-4" />
              Text Alignment
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => handleTextAlign('left')}>
                <AlignLeft className="mr-2 h-4 w-4" /> Left
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTextAlign('center')}>
                <AlignCenter className="mr-2 h-4 w-4" /> Center
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTextAlign('right')}>
                <AlignRight className="mr-2 h-4 w-4" /> Right
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Type className="mr-2 h-4 w-4" />
              Font Size
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {['sm', 'base', 'lg', 'xl', '2xl', '3xl'].map((size) => (
                <DropdownMenuItem key={size} onClick={() => handleFontSize(`text-${size}`)}>
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Width className="mr-2 h-4 w-4" />
              Custom Width
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <div className="p-2">
                <Input
                  type="text"
                  placeholder="e.g., 200px or 50%"
                  defaultValue={component.style?.width || ''}
                  onChange={(e) => handleCustomWidth(e.target.value)}
                />
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Height className="mr-2 h-4 w-4" />
              Custom Height
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <div className="p-2">
                <Input
                  type="text"
                  placeholder="e.g., 100px"
                  defaultValue={component.style?.height || ''}
                  onChange={(e) => handleCustomHeight(e.target.value)}
                />
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};