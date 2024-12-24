import { LabScript } from "@/types/labScript";

interface SpecificInstructionsProps {
  script: LabScript;
}

export const SpecificInstructions = ({ script }: SpecificInstructionsProps) => {
  if (!script.specificInstructions) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Specific Instructions</h3>
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="whitespace-pre-wrap">{script.specificInstructions}</p>
      </div>
    </div>
  );
};