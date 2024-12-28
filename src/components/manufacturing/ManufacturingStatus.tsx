import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ManufacturingStatusProps {
  manufacturingType: string;
  manufacturingLogs: {
    manufacturing_status: string;
    sintering_status: string;
    miyo_status: string;
    inspection_status: string;
  };
}

export const ManufacturingStatus = ({ manufacturingType, manufacturingLogs }: ManufacturingStatusProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (step: string, status: string) => {
    return `${step} ${status.replace('_', ' ')}`;
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Badge 
        variant="outline" 
        className={`${getStatusColor(manufacturingLogs.manufacturing_status)}`}
      >
        {formatStatus(manufacturingType, manufacturingLogs.manufacturing_status)}
      </Badge>

      {manufacturingLogs.manufacturing_status === 'completed' && (
        <>
          <Badge 
            variant="outline" 
            className={`${getStatusColor(manufacturingLogs.sintering_status)}`}
          >
            {formatStatus('Sintering', manufacturingLogs.sintering_status)}
          </Badge>

          {manufacturingLogs.sintering_status === 'completed' && (
            <Badge 
              variant="outline" 
              className={`${getStatusColor(manufacturingLogs.miyo_status)}`}
            >
              {formatStatus('MIYO', manufacturingLogs.miyo_status)}
            </Badge>
          )}

          {manufacturingLogs.miyo_status === 'completed' && (
            <Badge 
              variant="outline" 
              className={`${getStatusColor(manufacturingLogs.inspection_status)}`}
            >
              {formatStatus('Inspection', manufacturingLogs.inspection_status)}
            </Badge>
          )}
        </>
      )}
    </div>
  );
};