import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Package2, Warehouse, ClipboardList, TrendingUp } from "lucide-react";

export const MainLinks = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Inventory</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[400px]">
              <Link to="/inventory/items" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                <Package2 className="h-4 w-4" />
                <div>
                  <div className="font-medium">Inventory Items</div>
                  <div className="text-sm text-gray-500">Manage your inventory master list</div>
                </div>
              </Link>
              <Link to="/inventory/stock" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                <Warehouse className="h-4 w-4" />
                <div>
                  <div className="font-medium">Stock Management</div>
                  <div className="text-sm text-gray-500">Track stock levels across locations</div>
                </div>
              </Link>
              <Link to="/inventory/movements" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                <TrendingUp className="h-4 w-4" />
                <div>
                  <div className="font-medium">Stock Movements</div>
                  <div className="text-sm text-gray-500">Track inventory movements and history</div>
                </div>
              </Link>
              <Link to="/inventory/purchase-orders" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                <ClipboardList className="h-4 w-4" />
                <div>
                  <div className="font-medium">Purchase Orders</div>
                  <div className="text-sm text-gray-500">Create and manage purchase orders</div>
                </div>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};