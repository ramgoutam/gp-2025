import { useState } from "react";
import { Command } from "cmdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type InventoryItem = {
  id: string;
  product_name: string;
  product_id: string;
};

interface ProductSelectorProps {
  items: InventoryItem[];
  value: string;
  onSelect: (value: string) => void;
}

export function ProductSelector({ items, value, onSelect }: ProductSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedItem = items?.find((item) => item.id === value);

  const filteredItems = items?.filter(
    (item) =>
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white"
        >
          {selectedItem ? `${selectedItem.product_name} (${selectedItem.product_id})` : "Select product..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-white">
        <Command>
          <div className="flex items-center border-b px-3">
            <input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="max-h-[300px] overflow-auto">
            {filteredItems?.map((item) => (
              <div
                key={item.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(item.id);
                  setOpen(false);
                }}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  value === item.id && "bg-accent text-accent-foreground"
                )}
              >
                <span>{item.product_name}</span>
                <span className="ml-2 text-muted-foreground">({item.product_id})</span>
                {value === item.id && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </div>
            ))}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}