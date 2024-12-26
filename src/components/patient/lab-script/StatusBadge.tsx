import { Badge } from "@/components/ui/badge";
import { LabScript } from "@/types/labScript";

export const getStatusBadge = (status: LabScript["status"]) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    paused: "bg-orange-100 text-orange-800",
    hold: "bg-red-100 text-red-800"
  };

  return (
    <Badge variant="secondary" className={styles[status]}>
      {status?.replace("_", " ") || "pending"}
    </Badge>
  );
};