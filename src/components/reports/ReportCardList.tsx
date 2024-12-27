import { ReportCardItem } from "./ReportCardItem";
import { ReportCardData } from "@/types/reportCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react"; // Add this import

interface ReportCardListProps {
  reportCards?: ReportCardData[];
  isLoading: boolean;
}

export function ReportCardList({ reportCards, isLoading }: ReportCardListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-32 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (!reportCards?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No report cards found</h3>
        <p className="text-sm text-muted-foreground">
          Report cards will appear here once they are created.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {reportCards.map((reportCard) => (
        <ReportCardItem key={reportCard.id} reportCard={reportCard} />
      ))}
    </div>
  );
}