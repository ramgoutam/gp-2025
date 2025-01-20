import React from 'react';
import { useManufacturingData } from '@/hooks/useManufacturingData';
import { LabScript } from '@/types/labScript';

export default function Manufacturing() {
  const { data: manufacturingData } = useManufacturingData();
  const scripts: LabScript[] = 'scripts' in manufacturingData ? manufacturingData.scripts : manufacturingData;

  return (
    <div>
      <h1 className="text-2xl font-bold">Manufacturing Dashboard</h1>
      <div className="mt-4">
        {scripts.map(script => (
          <div key={script.id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl">{script.requestNumber}</h2>
            <p>Patient: {script.patientFirstName} {script.patientLastName}</p>
            <p>Status: {script.status}</p>
            <p>Design Info Status: {script.designInfoStatus}</p>
            <p>Clinical Info Status: {script.clinicalInfoStatus}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
