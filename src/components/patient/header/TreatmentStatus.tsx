import { Badge } from "@/components/ui/badge";

interface TreatmentStatusProps {
  treatmentType?: string;
  upperTreatment?: string;
  lowerTreatment?: string;
}

export const TreatmentStatus = ({ 
  treatmentType, 
  upperTreatment, 
  lowerTreatment 
}: TreatmentStatusProps) => {
  const getStatusColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'upper':
      case 'lower':
        return 'bg-primary/5 text-primary border-primary/20 shadow-sm shadow-primary/5';
      case 'dual':
        return 'bg-secondary/10 text-secondary border-secondary/20 shadow-sm shadow-secondary/5';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm shadow-yellow-100';
    }
  };

  if (!treatmentType) return null;

  return (
    <div className="flex items-center gap-8 ml-auto animate-fade-in">
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">Active Treatment Plan</p>
        <Badge 
          variant="outline" 
          className={`${getStatusColor(treatmentType)} 
            px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 
            hover:scale-105 uppercase tracking-wide`}
        >
          {treatmentType?.replace('_', ' ')}
        </Badge>
      </div>

      <div className="flex gap-6">
        {upperTreatment && (
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Upper Treatment</p>
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100 
              hover:border-primary/20 hover:shadow-md transition-all duration-300 group min-w-[180px]">
              <p className="font-medium text-gray-900">{upperTreatment}</p>
            </div>
          </div>
        )}
        {lowerTreatment && (
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Lower Treatment</p>
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100 
              hover:border-primary/20 hover:shadow-md transition-all duration-300 group min-w-[180px]">
              <p className="font-medium text-gray-900">{lowerTreatment}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};