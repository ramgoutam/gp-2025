import { ReportCardData } from "@/types/reportCard";
import { ReportCardItem } from "./ReportCardItem";

interface ReportCardsListProps {
  reportCards: ReportCardData[];
  isLoading: boolean;
}

export const ReportCardsList = ({ reportCards, isLoading }: ReportCardsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="h-48 bg-gray-100 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (!reportCards.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No report cards found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reportCards.map((reportCard) => (
        <ReportCardItem key={reportCard.id} reportCard={reportCard} />
      ))}
    </div>
  );
};