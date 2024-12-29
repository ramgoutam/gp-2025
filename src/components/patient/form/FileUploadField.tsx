import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface FileUploadFieldProps {
  id: string;
  label: string;
  onChange: (file: File) => void;
  accept?: string;
}

export const FileUploadField = ({
  id,
  label,
  onChange,
  accept = "image/*"
}: FileUploadFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          name={id}
          type="file"
          onChange={handleChange}
          accept={accept}
          className="cursor-pointer"
          capture="user"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => {
            const input = document.getElementById(id) as HTMLInputElement;
            if (input) {
              input.setAttribute('capture', 'user');
              input.click();
            }
          }}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};