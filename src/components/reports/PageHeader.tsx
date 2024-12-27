import { FileText } from "lucide-react";

export function PageHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Report Cards</h2>
        <p className="text-sm text-muted-foreground">
          View and manage all report cards
        </p>
      </div>
      <FileText className="h-8 w-8 text-muted-foreground" />
    </div>
  );
}