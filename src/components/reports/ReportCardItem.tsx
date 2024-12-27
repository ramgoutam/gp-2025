import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";
import { format } from "date-fns";
import { ReportCardData } from "@/types/reportCard";
import { useNavigate } from "react-router-dom";

interface ReportCardItemProps {
  reportCard: ReportCardData;
}

export const ReportCardItem = ({ reportCard }: ReportCardItemProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const handleViewClick = () => {
    if (reportCard.lab_script) {
      navigate(`/patient/${reportCard.lab_script.patient_id}`);
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">
                Lab Request #{reportCard.lab_script?.request_number || 'N/A'}
              </h3>
              <p className="text-sm text-gray-500">
                Created on {formatDate(reportCard.created_at)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex space-x-4">
              <Badge 
                variant="outline" 
                className={getStatusColor(reportCard.design_info_status)}
              >
                Design Info: {reportCard.design_info_status}
              </Badge>
              <Badge 
                variant="outline" 
                className={getStatusColor(reportCard.clinical_info_status)}
              >
                Clinical Info: {reportCard.clinical_info_status}
              </Badge>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewClick}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      </div>
    </Card>
  );
};