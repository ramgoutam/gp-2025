import React from "react";
import { Button } from "@/components/ui/button";

export const MedicalRecordContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button variant="outline" className="bg-white">
          Medical
        </Button>
        <Button variant="ghost">Cosmetic</Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border">
          <h3 className="font-semibold mb-4">Odontogram</h3>
          <div className="aspect-square bg-gray-100 rounded-lg"></div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm text-gray-500">MAR 03</div>
                <h4 className="font-semibold">Maxillary Left Lateral Incisor</h4>
              </div>
              <span className="text-green-500 text-sm">Done</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">CONDITION</div>
                <div>Caries</div>
              </div>
              <div>
                <div className="text-gray-500">TREATMENT</div>
                <div>Tooth filling</div>
              </div>
              <div>
                <div className="text-gray-500">DENTIST</div>
                <div>Drg.Sopi Mactavish</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};