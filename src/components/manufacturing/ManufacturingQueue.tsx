import { Card } from "@/components/ui/card";

export const ManufacturingQueue = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Manufacturing Queue</h2>
      <div className="text-gray-500 text-center py-8">
        No manufacturing items available.
      </div>
    </Card>
  );
};