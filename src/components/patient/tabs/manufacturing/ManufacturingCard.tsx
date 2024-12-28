import React from "react";
import { Card } from "@/components/ui/card";
import { Factory } from "lucide-react";

interface EmptyStateProps {
  firstName: string;
  lastName: string;
}

export const EmptyManufacturingState = ({ firstName, lastName }: EmptyStateProps) => (
  <Card className="p-4">
    <div className="flex flex-col items-center gap-3">
      <Factory className="w-10 h-10 text-gray-400" />
      <div className="space-y-1">
        <h3 className="font-semibold text-gray-900">No Manufacturing Data</h3>
        <p className="text-sm text-gray-500">
          There are no lab scripts with manufacturing information for {firstName} {lastName}.
        </p>
      </div>
    </div>
  </Card>
);