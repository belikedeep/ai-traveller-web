"use client";

import { Info } from "lucide-react";

interface CulturalTipsProps {
  customs: string[];
  etiquette: string[];
  diningTips: string[];
  dressCodes: string[];
}

export default function CulturalInfo({
  customs,
  etiquette,
  diningTips,
  dressCodes,
}: CulturalTipsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <Info className="h-5 w-5 text-primary" />
        Cultural Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-primary">Customs & Traditions</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {customs.map((custom, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                {custom}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-primary">Etiquette</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {etiquette.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-primary">Dining Tips</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {diningTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-primary">Dress Code</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {dressCodes.map((code, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                {code}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}