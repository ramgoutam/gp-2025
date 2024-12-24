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
  <Card className="p-4 col-span-full hover:shadow-lg transition-all duration-300 group bg-gradient-to-br from-white to-purple-50/30 border border-purple-100/50">
    <div className="flex items-start space-x-4">
      <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary group-hover:scale-110 transition-transform duration-300">
        <AlignVerticalSpaceBetween className="w-5 h-5" />
      </div>
      <div className="space-y-3 flex-1">
        <p className="text-sm font-medium text-gray-500">Latest Appliance</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Upper</p>
            <p className="font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {upperTreatment || "None"}
            </p>
            {upperDesignName && (
              <p className="text-sm text-gray-500">Design: {upperDesignName}</p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Lower</p>
            <p className="font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {lowerTreatment || "None"}
            </p>
            {lowerDesignName && (
              <p className="text-sm text-gray-500">Design: {lowerDesignName}</p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Nightguard</p>
            <p className="font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {nightguard || "None"}
            </p>
          </div>
        </div>
      </div>
    </div>
  </Card>
);