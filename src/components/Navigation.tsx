import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSession } from "@supabase/auth-helpers-react";
import { SignOutButton } from "./navigation/SignOutButton";
import { LabMenu } from "./navigation/LabMenu";
import { MainLinks } from "./navigation/MainLinks";

export function Navigation() {
  const location = useLocation();
  const session = useSession();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isInventoryActive = () => {
    return location.pathname.startsWith('/inventory');
  };

  if (!session) return null;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">
                Logo
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <MainLinks />
              
              {/* Inventory Dropdown */}
              <div className="relative inline-block text-left">
                <Link
                  to="/inventory"
                  className={cn(
                    "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2",
                    isInventoryActive()
                      ? "border-primary text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  Inventory
                </Link>
                <div className={cn(
                  "absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
                  isInventoryActive() ? "block" : "hidden"
                )}>
                  <div className="py-1">
                    <Link
                      to="/inventory/items"
                      className={cn(
                        "block px-4 py-2 text-sm",
                        isActive("/inventory/items")
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      Inventory Items
                    </Link>
                    <Link
                      to="/inventory/purchase-orders"
                      className={cn(
                        "block px-4 py-2 text-sm",
                        isActive("/inventory/purchase-orders")
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      Purchase Orders
                    </Link>
                  </div>
                </div>
              </div>

              <LabMenu />
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <SignOutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}