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
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (step: string, status: string) => {
    const formattedStatus = status.toLowerCase().replace('_', ' ');
    return `${step} ${formattedStatus}`;
  };

  const getDetailedStatus = () => {
    const type = manufacturingType === 'Milling' ? 'Milling' : 'Printing';
    
    if (!manufacturingLogs) {
      return `${type} pending`;
    }

    // Manufacturing Phase
    if (manufacturingLogs.manufacturing_status !== 'completed') {
      return formatStatus(type, manufacturingLogs.manufacturing_status);
    }

    // Sintering Phase
    if (manufacturingLogs.sintering_status !== 'completed') {
      return formatStatus('Sintering', manufacturingLogs.sintering_status);
    }

    // MIYO Phase
    if (manufacturingLogs.miyo_status !== 'completed') {
      return formatStatus('MIYO', manufacturingLogs.miyo_status);
    }

    // Inspection Phase
    if (manufacturingLogs.inspection_status !== 'completed') {
      return formatStatus('Inspection', manufacturingLogs.inspection_status);
    }

    // If everything is completed
    return 'Manufacturing Complete';
  };

  const status = getDetailedStatus();
  const colorClass = getStatusColor(
    manufacturingLogs?.[
      Object.keys(manufacturingLogs).find(
        key => manufacturingLogs[key as keyof typeof manufacturingLogs] !== 'completed'
      ) as keyof typeof manufacturingLogs
    ] || 'pending'
  );

  return (
    <Badge className={colorClass}>
      {status}
    </Badge>
  );
};