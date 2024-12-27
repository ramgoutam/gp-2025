import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ReportCardData } from "@/types/reportCard";

interface ReportCardItemProps {
  reportCard: ReportCardData;
}

export function ReportCardItem({ reportCard }: ReportCardItemProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Invalid date";
    }
  };

  const handleViewDetails = () => {
    if (reportCard.lab_script_id) {
      navigate(`/patient/${reportCard.patient_id}`);
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold">Report #{reportCard.id.slice(0, 8)}</h3>
            <p className="text-sm text-muted-foreground">
              Created: {formatDate(reportCard.created_at)}
            </p>
          </div>
          <Badge className={getStatusColor(reportCard.status)}>
            {reportCard.status.toUpperCase()}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Design Info:</span>
            <Badge variant="outline" className={getStatusColor(reportCard.design_info_status)}>
              {reportCard.design_info_status}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span>Clinical Info:</span>
            <Badge variant="outline" className={getStatusColor(reportCard.clinical_info_status)}>
              {reportCard.clinical_info_status}
            </Badge>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleViewDetails}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </div>
    </Card>
  );
}