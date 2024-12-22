import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { LabScript } from "./LabScriptsTab";
import { LabScriptForm } from "../LabScriptForm";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Maximize, Printer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { STLViewer } from "../lab-script/STLViewer";

interface LabScriptDetailsProps {
  script: LabScript | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (updatedScript: LabScript) => void;
  isEditing?: boolean;
}

const getStatusBadge = (status: LabScript["status"]) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <Badge variant="secondary" className={styles[status]}>
      {status.replace("_", " ")}
    </Badge>
  );
};

export const LabScriptDetails = ({ script, open, onOpenChange, onEdit, isEditing = false }: LabScriptDetailsProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedSTLFile, setSelectedSTLFile] = useState<File | null>(null);
  const [showSTLPreview, setShowSTLPreview] = useState(false);

  if (!script) return null;

  const handleEdit = (updatedData: LabScript) => {
    console.log("Handling edit with updated data:", updatedData);
    onEdit(updatedData);
  };

  const handleSTLPreview = (file: File) => {
    console.log("Opening STL preview for file:", file.name);
    setSelectedSTLFile(file);
    setShowSTLPreview(true);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

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
            <div>Upper: ${script.treatments.upper.join(", ") || "None"}</div>
            <div>Lower: ${script.treatments.lower.join(", ") || "None"}</div>
          </div>
          ${script.specificInstructions ? `
            <div class="section">
              <div class="section-title">Specific Instructions:</div>
              <div>${script.specificInstructions}</div>
            </div>
          ` : ''}
          <div class="section">
            <div class="section-title">Status:</div>
            <div>${script.status.replace("_", " ")}</div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  const dialogContentClass = isMaximized 
    ? "max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh]" 
    : "max-w-4xl";

  const renderFilePreview = (fileUploads: Record<string, File[]>) => {
    return Object.entries(fileUploads).map(([key, files]) => {
      if (!files || files.length === 0) return null;

      return (
        <div key={key} className="space-y-2">
          <h4 className="font-medium text-sm text-gray-500">{key}</h4>
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm">{file.name}</span>
                {file.name.toLowerCase().endsWith('.stl') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSTLPreview(file)}
                  >
                    Preview
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

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
              <div className="space-y-6 p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-500">Doctor Name</h4>
                    <p className="text-lg">{script.doctorName}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-500">Clinic Name</h4>
                    <p className="text-lg">{script.clinicName}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-500">Request Date</h4>
                    <p className="text-lg">{format(new Date(script.requestDate), "MMM dd, yyyy")}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-500">Due Date</h4>
                    <p className="text-lg">{format(new Date(script.dueDate), "MMM dd, yyyy")}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-500">Appliance Type</h4>
                  <p className="text-lg">{script.applianceType || "N/A"}</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-gray-500">Treatments</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h5 className="font-medium">Upper</h5>
                      <p>{script.treatments.upper.join(", ") || "None"}</p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Lower</h5>
                      <p>{script.treatments.lower.join(", ") || "None"}</p>
                    </div>
                  </div>
                </div>

                {script.fileUploads && Object.keys(script.fileUploads).length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-gray-500">Uploaded Files</h4>
                      {renderFilePreview(script.fileUploads)}
                    </div>
                  </>
                )}

                {script.specificInstructions && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-500">Specific Instructions</h4>
                      <p className="whitespace-pre-wrap">{script.specificInstructions}</p>
                    </div>
                  </>
                )}

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-500">Status</h4>
                  {getStatusBadge(script.status || "pending")}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showSTLPreview} onOpenChange={setShowSTLPreview}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>STL Preview</DialogTitle>
          </DialogHeader>
          {selectedSTLFile && <STLViewer file={selectedSTLFile} />}
        </DialogContent>
      </Dialog>
    </>
  );
};