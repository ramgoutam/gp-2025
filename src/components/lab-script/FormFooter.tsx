import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface FormFooterProps {
  specificInstructions: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isSubmitting: boolean;
  isEditing: boolean;
}

export const FormFooter = ({ 
  specificInstructions, 
  onChange, 
  isSubmitting,
  isEditing 
}: FormFooterProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="specificInstructions">Specific Instructions</Label>
        <Textarea
          id="specificInstructions"
          name="specificInstructions"
          value={specificInstructions}
          onChange={onChange}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : isEditing ? 'Save' : 'Submit Lab Script'}
        </Button>
      </div>
    </>
  );
};