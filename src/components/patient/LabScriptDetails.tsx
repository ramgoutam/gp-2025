import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize, Printer } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabScript } from "@/types/labScript";
import { LabScriptForm } from "../LabScriptForm";
import { useState, useEffect } from "react";
import { FilePreviewDialog } from "../lab-script/FilePreviewDialog";
import { LabScriptContent } from "./lab-script-details/LabScriptContent";
import { format } from "date-fns";

interface LabScriptDetailsProps {
  script: LabScript | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (updatedScript: LabScript) => void;
  isEditing?: boolean;
}

export const LabScriptDetails = ({ 
  script, 
  open, 
  onOpenChange, 
  onEdit, 
  isEditing = false 
}: LabScriptDetailsProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, []);

  const handleEdit = (updatedData: LabScript) => {
    console.log("Handling edit with updated data:", updatedData);
    onEdit(updatedData);
  };

  const handlePreview = (file: File) => {
    console.log("Opening preview for file:", file.name);
    
    if (file.name.toLowerCase().endsWith('.stl')) {
      setPreviewFile(file);
      setImagePreviewUrl(null);
    } else if (file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreviewUrl(imageUrl);
      setPreviewFile(null);
    }
    setShowPreview(true);
  };

  const closePreview = () => {
    console.log("Closing preview");
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    setPreviewFile(null);
    setShowPreview(false);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !script) return;

    const treatments = script.treatments || {
      upper: script.upperTreatment ? [script.upperTreatment] : [],
      lower: script.lowerTreatment ? [script.lowerTreatment] : []
    };

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lab Script Details</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .section { margin-bottom: 15px; }
            .section-title { font-weight: bold; margin-bottom: 5px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            @media print {
              @page { size: A4; margin: 20mm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Lab Script Details</h1>
            <p>Generated on ${format(new Date(), "MMM dd, yyyy")}</p>
          </div>
          <div class="section">
            <div class="grid">
              <div>
                <div class="section-title">Doctor Name:</div>
                <div>${script.doctorName}</div>
              </div>
              <div>
                <div class="section-title">Clinic Name:</div>
                <div>${script.clinicName}</div>
              </div>
              <div>
                <div class="section-title">Request Date:</div>
                <div>${format(new Date(script.requestDate), "MMM dd, yyyy")}</div>
              </div>
              <div>
                <div class="section-title">Due Date:</div>
                <div>${format(new Date(script.dueDate), "MMM dd, yyyy")}</div>
              </div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">Appliance Type:</div>
            <div>${script.applianceType || "N/A"}</div>
          </div>
          <div class="section">
            <div class="section-title">Treatments:</div>
            <div>Upper: ${treatments.upper.join(", ") || "None"}</div>
            <div>Lower: ${treatments.lower.join(", ") || "None"}</div>
          </div>
          ${script.specificInstructions ? `
            <div class="section">
              <div class="section-title">Specific Instructions:</div>
              <div>${script.specificInstructions}</div>
            </div>
          ` : ''}
          <div class="section">
            <div class="section-title">Status:</div>
            <div>${script.status?.replace("_", " ") || "pending"}</div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  if (!script) return null;

  const dialogContentClass = isMaximized 
    ? "max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh]" 
    : "max-w-4xl";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`${dialogContentClass} overflow-hidden`}>
          <DialogHeader className="flex flex-row justify-between items-center">
            <DialogTitle>{isEditing ? 'Edit Lab Script' : 'Lab Script Details'}</DialogTitle>
            <div className="flex gap-2">
              {!isEditing && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrint}
                  className="h-8 w-8"
                >
                  <Printer className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMaximized(!isMaximized)}
                className="h-8 w-8"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <ScrollArea className="flex-1 h-full max-h-[calc(90vh-120px)]">
            {isEditing ? (
              <LabScriptForm
                initialData={script}
                onSubmit={handleEdit}
                isEditing={true}
              />
            ) : (
              <LabScriptContent script={script} handlePreview={handlePreview} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <FilePreviewDialog
        file={previewFile}
        imageUrl={imagePreviewUrl}
        isOpen={showPreview}
        onClose={closePreview}
      />
    </>
  );
};

