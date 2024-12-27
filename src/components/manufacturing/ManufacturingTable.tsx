import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ArrowRight } from "lucide-react";
import { LabScript } from "@/types/labScript";

interface ManufacturingTableProps {
  scripts: LabScript[];
  onStatusUpdate: (script: LabScript, newStatus: string) => void;
  onEdit: (script: LabScript) => void;
  onDelete: (script: LabScript) => void;
}

export const ManufacturingTable = ({
  scripts,
  onStatusUpdate,
  onEdit,
  onDelete,
}: ManufacturingTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'processing':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  // Filter scripts that have completed design info
  const manufacturingScripts = scripts.filter(script => 
    script.designInfo && script.status !== 'completed'
  );

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Appliance Type</TableHead>
            <TableHead>Appliance Numbers</TableHead>
            <TableHead>Material</TableHead>
            <TableHead>Shade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Update Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {manufacturingScripts.map((script) => (
            <TableRow key={script.id}>
              <TableCell>
                {script.patientFirstName} {script.patientLastName}
              </TableCell>
              <TableCell>{script.applianceType || 'N/A'}</TableCell>
              <TableCell>
                {script.upperTreatment && `Upper: ${script.upperTreatment}`}
                {script.lowerTreatment && script.upperTreatment && <br />}
                {script.lowerTreatment && `Lower: ${script.lowerTreatment}`}
              </TableCell>
              <TableCell>{script.clinicalInfo?.material || 'N/A'}</TableCell>
              <TableCell>{script.clinicalInfo?.shade || 'N/A'}</TableCell>
              <TableCell className={getStatusColor(script.status)}>
                {script.status.charAt(0).toUpperCase() + script.status.slice(1)}
              </TableCell>
              <TableCell>
                <select
                  className="border rounded p-1"
                  value={script.status}
                  onChange={(e) => onStatusUpdate(script, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                </select>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(script)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(script)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onStatusUpdate(script, 'processing')}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};