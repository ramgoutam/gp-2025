import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const DashboardProgress = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Treatment Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Lab Scripts Completed</span>
            <span className="text-sm text-gray-500">75%</span>
          </div>
          <Progress value={75} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Report Cards Submitted</span>
            <span className="text-sm text-gray-500">60%</span>
          </div>
          <Progress value={60} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Patient Consultations</span>
            <span className="text-sm text-gray-500">90%</span>
          </div>
          <Progress value={90} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};