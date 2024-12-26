import React from 'react';
import { Settings, AlignLeft, AlignCenter, AlignRight, Type, ArrowLeftRight, ArrowUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FormComponent } from "@/types/formBuilder";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ComponentSettingsProps {
  component: FormComponent;
  onUpdateComponent: (updatedComponent: FormComponent) => void;
}

export const ComponentSettings = ({
  component,
  onUpdateComponent,
}: ComponentSettingsProps) => {
  const handleStyleChange = (property: string, value: string) => {
    onUpdateComponent({
      ...component,
      style: {
        ...component.style,
        [property]: value,
      },
    });
  };

  const handleTextAlign = (alignment: 'left' | 'center' | 'right') => {
    handleStyleChange('textAlign', alignment);
  };

  const handleFontSize = (size: string) => {
    handleStyleChange('fontSize', size);
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: string) => {
    if (!value.endsWith('px') && !value.endsWith('%')) {
      value = `${value}px`;
    }
    handleStyleChange(dimension, value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Component Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="p-2">
          <Label className="text-xs">Text Alignment</Label>
          <div className="flex justify-between mt-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleTextAlign('left')}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleTextAlign('center')}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleTextAlign('right')}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="p-2">
          <Label className="text-xs">Font Size</Label>
          <div className="flex items-center mt-1">
            <Type className="h-4 w-4 mr-2" />
            <Input
              type="text"
              value={component.style?.fontSize || ''}
              onChange={(e) => handleFontSize(e.target.value)}
              className="h-8"
              placeholder="e.g., 16px"
            />
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="p-2">
          <Label className="text-xs">Dimensions</Label>
          <div className="space-y-2 mt-1">
            <div className="flex items-center">
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              <Input
                type="text"
                value={component.style?.width || ''}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                className="h-8"
                placeholder="Width (px or %)"
              />
            </div>
            <div className="flex items-center">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <Input
                type="text"
                value={component.style?.height || ''}
                onChange={(e) => handleDimensionChange('height', e.target.value)}
                className="h-8"
                placeholder="Height (px)"
              />
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};