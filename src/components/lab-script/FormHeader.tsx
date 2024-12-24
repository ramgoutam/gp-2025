import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormHeaderProps {
  requestDate: string;
  dueDate: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormHeader = ({ requestDate, dueDate, onChange }: FormHeaderProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="requestDate">Request Date</Label>
        <Input
          id="requestDate"
          name="requestDate"
          type="date"
          value={requestDate}
          onChange={onChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          value={dueDate}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
};