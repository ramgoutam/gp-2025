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
        return 'bg-gradient-to-r from-primary/20 to-blue-500/20 text-primary border-primary/20 shadow-lg shadow-primary/5';
      case 'dual':
        return 'bg-gradient-to-r from-secondary/20 to-teal-500/20 text-secondary border-secondary/20 shadow-lg shadow-secondary/5';
      default:
        return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border-yellow-200 shadow-lg shadow-yellow-100/50';
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
            hover:scale-105 uppercase tracking-wide animate-fade-in`}
        >
          {treatmentType?.replace('_', ' ')}
        </Badge>
      </div>

      <div className="flex gap-6">
        {upperTreatment && (
          <div className="animate-fade-in">
            <p className="text-sm font-medium text-gray-500 mb-1">Upper Treatment</p>
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-white to-blue-50 border border-blue-100 
              hover:border-primary/20 hover:shadow-lg transition-all duration-300 group min-w-[180px]">
              <p className="font-medium bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {upperTreatment}
              </p>
            </div>
          </div>
        )}
        {lowerTreatment && (
          <div className="animate-fade-in">
            <p className="text-sm font-medium text-gray-500 mb-1">Lower Treatment</p>
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-white to-blue-50 border border-blue-100 
              hover:border-primary/20 hover:shadow-lg transition-all duration-300 group min-w-[180px]">
              <p className="font-medium bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {lowerTreatment}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};