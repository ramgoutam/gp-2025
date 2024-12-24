import React from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Info, AlignVerticalSpaceBetween, Droplet, Wrench } from "lucide-react";
import { format } from "date-fns";

interface TreatmentPreviewProps {
  surgeryDate?: string;
  deliveryDate?: string;
  status?: string;
  upperAppliance?: string;
  lowerAppliance?: string;
  nightguard?: string;
  shade?: string;
  screw?: string;
}

export const TreatmentPreviewCards = ({
  surgeryDate,
  deliveryDate,
  status = "Pending",
  upperAppliance,
  lowerAppliance,
  nightguard,
  shade,
  screw,
}: TreatmentPreviewProps) => {
  const PreviewCard = ({ 
    icon: Icon, 
    title, 
    value, 
    className = "" 
  }: { 
    icon: React.ElementType; 
    title: string; 
    value?: string; 
    className?: string;
  }) => (
    <Card className={`p-4 hover:shadow-lg transition-all duration-300 group ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-5 h-5" />
        </div>
        <div className="space-y-1 flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="font-semibold text-gray-900">
            {value || "Not specified"}
          </p>
        </div>
      </div>
    </Card>
  );

  const formatDate = (date?: string) => {
    if (!date) return undefined;
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch {
      return undefined;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <PreviewCard
        icon={Calendar}
        title="Surgery Date"
        value={formatDate(surgeryDate)}
        className="bg-gradient-to-br from-white to-gray-50"
      />
      <PreviewCard
        icon={Calendar}
        title="Estimated Delivery"
        value={formatDate(deliveryDate)}
        className="bg-gradient-to-br from-white to-gray-50"
      />
      <PreviewCard
        icon={Info}
        title="Present Status"
        value={status}
        className="bg-gradient-to-br from-white to-gray-50"
      />
      <Card className="p-4 col-span-full hover:shadow-lg transition-all duration-300 group bg-gradient-to-br from-white to-gray-50">
        <div className="flex items-start space-x-4">
          <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:scale-110 transition-transform duration-300">
            <AlignVerticalSpaceBetween className="w-5 h-5" />
          </div>
          <div className="space-y-3 flex-1">
            <p className="text-sm font-medium text-gray-500">Latest Appliance</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Upper</p>
                <p className="font-semibold text-gray-900">{upperAppliance || "None"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Lower</p>
                <p className="font-semibold text-gray-900">{lowerAppliance || "None"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Nightguard</p>
                <p className="font-semibold text-gray-900">{nightguard || "None"}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <PreviewCard
        icon={Droplet}
        title="Shade"
        value={shade}
        className="bg-gradient-to-br from-white to-gray-50"
      />
      <PreviewCard
        icon={Wrench}
        title="Screw"
        value={screw}
        className="bg-gradient-to-br from-white to-gray-50"
      />
    </div>
  );
};