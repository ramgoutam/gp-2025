import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { CameraPopup } from "./CameraPopup";

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
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowCamera(true)}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>
      
      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="Preview"
            className="max-w-[200px] rounded-lg border"
          />
        </div>
      )}

      <CameraPopup
        open={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
};