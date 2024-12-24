import React from "react";
import { Card } from "@/components/ui/card";
import { AlignVerticalSpaceBetween } from "lucide-react";

interface ApplianceCardProps {
  upperTreatment?: string;
  lowerTreatment?: string;
  nightguard?: string;
  upperDesignName?: string;
  lowerDesignName?: string;
}

export const ApplianceCard = ({
  upperTreatment,
  lowerTreatment,
  nightguard,
  upperDesignName,
  lowerDesignName
}: ApplianceCardProps) => (
  <Card className="p-4 col-span-full hover:shadow-lg transition-all duration-300 group bg-white border-primary/10">
    <div className="flex items-start space-x-4">
      <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
        <AlignVerticalSpaceBetween className="w-5 h-5" />
      </div>
      <div className="space-y-3 flex-1">
        <p className="text-sm font-medium text-gray-500">Latest Appliance</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Upper</p>
            <p className="font-semibold text-primary">
              {upperTreatment || "None"}
            </p>
            {upperDesignName && (
              <p className="text-sm text-gray-500">Design: {upperDesignName}</p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Lower</p>
            <p className="font-semibold text-primary">
              {lowerTreatment || "None"}
            </p>
            {lowerDesignName && (
              <p className="text-sm text-gray-500">Design: {lowerDesignName}</p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Nightguard</p>
            <p className="font-semibold text-primary">
              {nightguard || "None"}
            </p>
          </div>
        </div>
      </div>
    </div>
  </Card>
);