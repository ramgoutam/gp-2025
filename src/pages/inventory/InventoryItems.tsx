import React from "react";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { demoInventoryItems } from "./demoData";

const InventoryItems = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Inventory Items</h1>
          <p className="text-gray-600">Manage your inventory items</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <InventoryTable items={demoInventoryItems.map((item, index) => ({
          ...item,
          id: `demo-${index + 1}`,
        }))} />
      </div>
    </div>
  );
};

export default InventoryItems;