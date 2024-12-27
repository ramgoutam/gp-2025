import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status?: string; // Make status optional
}

export const StatusBadge = ({ status = 'pending' }: StatusBadgeProps) => { // Add default value
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) { // Add toLowerCase() to handle case variations
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hold':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    // First ensure we have a valid string to work with
    if (!status) return 'Unknown';
    
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'in_progress':
        return 'In Progress';
      case 'paused':
        return 'Paused';
      case 'hold':
        return 'On Hold';
      case 'completed':
        return 'Completed';
      default:
        // Safely handle string replacement
        return status.includes('_') ? 
          status.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ') : 
          status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getStatusColor(status)} px-3 py-1 uppercase text-xs font-medium`}
    >
      {getStatusText(status)}
    </Badge>
  );
};