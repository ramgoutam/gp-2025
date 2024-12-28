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
      case 'Ready for Insert':
        return 'bg-green-100 text-green-800';
      case 'Appliance rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-gray-100 text-gray-800';
      case 'Milling/Printing in progress':
      case 'Sintering in progress':
      case 'MIYO in Progress':
      case 'Inspection in process':
        return 'bg-blue-100 text-blue-800';
      case 'Milling/Printing is in Hold':
      case 'Sintering is in Hold':
      case 'MIYO is in Hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'Ready for Sintering':
      case 'Ready for MIYO':
      case 'Ready for Inspection':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDetailedStatus = () => {
    const type = manufacturingType === 'Milling' ? 'Milling' : 'Printing';
    
    if (!manufacturingLogs?.manufacturing_status || manufacturingLogs.manufacturing_status === 'pending') {
      return 'Pending';
    }

    // Manufacturing Phase
    if (manufacturingLogs.manufacturing_status === 'in_progress') {
      return `${type} in progress`;
    }
    if (manufacturingLogs.manufacturing_status === 'on_hold') {
      return `${type} is in Hold`;
    }
    if (manufacturingLogs.manufacturing_status === 'completed') {
      // Check Sintering Phase
      if (manufacturingLogs.sintering_status === 'pending') {
        return 'Ready for Sintering';
      }
      if (manufacturingLogs.sintering_status === 'in_progress') {
        return 'Sintering in progress';
      }
      if (manufacturingLogs.sintering_status === 'on_hold') {
        return 'Sintering is in Hold';
      }
      if (manufacturingLogs.sintering_status === 'completed') {
        // Check MIYO Phase
        if (manufacturingLogs.miyo_status === 'pending') {
          return 'Ready for MIYO';
        }
        if (manufacturingLogs.miyo_status === 'in_progress') {
          return 'MIYO in Progress';
        }
        if (manufacturingLogs.miyo_status === 'on_hold') {
          return 'MIYO is in Hold';
        }
        if (manufacturingLogs.miyo_status === 'completed') {
          // Check Inspection Phase
          if (manufacturingLogs.inspection_status === 'pending') {
            return 'Ready for Inspection';
          }
          if (manufacturingLogs.inspection_status === 'in_progress') {
            return 'Inspection in process';
          }
          if (manufacturingLogs.inspection_status === 'completed') {
            return 'Ready for Insert';
          }
          if (manufacturingLogs.inspection_status === 'on_hold') {
            return 'Appliance rejected';
          }
        }
      }
    }

    return 'Pending';
  };

  const status = getDetailedStatus();

  return (
    <Badge className={getStatusColor(status)}>
      {status}
    </Badge>
  );
};