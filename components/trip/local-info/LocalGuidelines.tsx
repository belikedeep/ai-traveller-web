"use client";

import { AlertCircle, Bus, CloudSun, Building } from "lucide-react";

interface GuidelinesProps {
  transportation: string[];
  safety: string[];
  weather: string[];
  business: string[];
}

export default function LocalGuidelines({
  transportation,
  safety,
  weather,
  business,
}: GuidelinesProps) {
  const sections = [
    {
      title: "Transportation",
      icon: <Bus className="h-5 w-5 text-primary" />,
      items: transportation,
    },
    {
      title: "Safety Guidelines",
      icon: <AlertCircle className="h-5 w-5 text-primary" />,
      items: safety,
    },
    {
      title: "Weather Considerations",
      icon: <CloudSun className="h-5 w-5 text-primary" />,
      items: weather,
    },
    {
      title: "Business & Hours",
      icon: <Building className="h-5 w-5 text-primary" />,
      items: business,
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-primary" />
        Local Guidelines
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className="rounded-xl border border-border/50 overflow-hidden backdrop-blur-sm bg-background/50 p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                {section.icon}
              </div>
              <h4 className="font-medium">{section.title}</h4>
            </div>

            <ul className="space-y-3">
              {section.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {section.items.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No guidelines available.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}