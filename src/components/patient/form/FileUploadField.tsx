import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { CameraPopup } from "./CameraPopup";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [preview, setPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCameraCapture = (file: File) => {
    onChange(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-4 flex flex-col items-center">
      <div className="relative group">
        <Avatar className="w-32 h-32 border-4 border-primary/10 group-hover:border-primary/20 transition-all">
          <AvatarImage src={preview || undefined} alt="Profile preview" />
          <AvatarFallback className="text-2xl bg-primary/5">
            {preview ? "..." : "ADD"}
          </AvatarFallback>
        </Avatar>
        
        <div className="absolute bottom-0 right-0 flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg"
            onClick={() => setShowCamera(true)}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Input
        id={id}
        name={id}
        type="file"
        onChange={handleChange}
        accept={accept}
        className="hidden"
      />
      
      {label && <Label htmlFor={id}>{label}</Label>}

      <CameraPopup
        open={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
};