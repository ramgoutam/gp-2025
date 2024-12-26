import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Save } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { availableComponents } from '@/config/formBuilder';

interface FormBuilderToolbarProps {
  onNavigateBack: () => void;
  onSave: () => void;
  onAddComponent: (type: string, label: string) => void;
}

export const FormBuilderToolbar = ({
  onNavigateBack,
  onSave,
  onAddComponent,
}: FormBuilderToolbarProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={onNavigateBack}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Form Builder</h1>
          <p className="text-muted-foreground">Design your form layout</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-64 bg-white shadow-lg border rounded-lg p-2"
            style={{ maxHeight: '500px', overflowY: 'auto' }}
          >
            {['Text', 'Input', 'Selection', 'Popups', 'Advanced'].map((category) => (
              <div key={category} className="mb-2">
                <DropdownMenuLabel className="text-sm font-semibold text-gray-700 px-2 py-1">
                  {category}
                </DropdownMenuLabel>
                <DropdownMenuGroup className="bg-gray-50 rounded-md p-1">
                  {availableComponents
                    .filter(component => component.category === category)
                    .map((component) => (
                      <DropdownMenuItem
                        key={component.type}
                        onClick={() => onAddComponent(component.type, component.label)}
                        className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                      >
                        <component.icon className="mr-2 h-4 w-4 text-primary" />
                        <span className="text-sm">{component.label}</span>
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-2" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={onSave} className="bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};