
import { ColumnDef } from "@tanstack/react-table";
import { PostSurgeryItem } from "@/types/postSurgeryTracking";

export const columns: ColumnDef<PostSurgeryItem>[] = [{
  accessorKey: "itemName",
  header: "Item Name"
}, {
  accessorKey: "category",
  header: "Category"
}, {
  accessorKey: "quantity",
  header: "Quantity"
}, {
  accessorKey: "surgeryDate",
  header: "Surgery Date"
}, {
  accessorKey: "status",
  header: "Status",
  cell: ({
    row
  }) => <div className={`
          inline-flex px-2 py-1 rounded-full text-xs font-medium
          ${row.original.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${row.original.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
          ${row.original.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
        `}>
        {row.original.status}
      </div>
}, {
  accessorKey: "notes",
  header: "Notes"
}];
