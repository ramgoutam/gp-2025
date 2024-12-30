import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
      <Input
        id={id}
        name={id}
        type="file"
        onChange={handleChange}
        accept={accept}
        className="cursor-pointer"
      />
    </div>
  );
};