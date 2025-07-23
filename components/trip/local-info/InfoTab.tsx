"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Phone, Languages, AlertCircle, Loader2 } from "lucide-react";
import CulturalInfo from "./CulturalInfo";
import EmergencyCard from "./EmergencyCard";
import LanguageHelper from "./LanguageHelper";
import LocalGuidelines from "./LocalGuidelines";

interface LocalInformation {
  destination: string;
  countryCode: string;
  localLanguage: string;
  emergencyContacts: {
    name: string;
    number: string;
    icon: "police" | "ambulance" | "embassy" | "touristPolice";
  }[];
  culturalTips: {
    customs: string[];
    etiquette: string[];
    diningTips: string[];
    dressCodes: string[];
  };
  languageHelper: {
    phrases: Array<{
      local: string;
      english: string;
      pronunciation: string;
      category: string;
    }>;
  };
  localGuidelines: {
    transportation: string[];
    safety: string[];
    weather: string[];
    business: string[];
  };
}

interface InfoTabProps {
  localInfo: LocalInformation | null;
  isLoading: boolean;
}

export default function InfoTab({ localInfo, isLoading }: InfoTabProps) {
  const [activeTab, setActiveTab] = useState("cultural");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading local information...</p>
      </div>
    );
  }

  if (!localInfo) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Local information not available for this destination.
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <TabsTrigger value="cultural" className="gap-2">
          <Info className="h-4 w-4" />
          <span className="hidden sm:inline">Cultural</span>
        </TabsTrigger>
        <TabsTrigger value="emergency" className="gap-2">
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">Emergency</span>
        </TabsTrigger>
        <TabsTrigger value="language" className="gap-2">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">Language</span>
        </TabsTrigger>
        <TabsTrigger value="guidelines" className="gap-2">
          <AlertCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Guidelines</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="cultural" className="space-y-6">
        <CulturalInfo
          customs={localInfo.culturalTips.customs}
          etiquette={localInfo.culturalTips.etiquette}
          diningTips={localInfo.culturalTips.diningTips}
          dressCodes={localInfo.culturalTips.dressCodes}
        />
      </TabsContent>

      <TabsContent value="emergency" className="space-y-6">
        <EmergencyCard
          contacts={localInfo.emergencyContacts}
          countryCode={localInfo.countryCode}
        />
      </TabsContent>

      <TabsContent value="language" className="space-y-6">
        <LanguageHelper
          phrases={localInfo.languageHelper.phrases}
          localLanguage={localInfo.localLanguage}
        />
      </TabsContent>

      <TabsContent value="guidelines" className="space-y-6">
        <LocalGuidelines
          transportation={localInfo.localGuidelines.transportation}
          safety={localInfo.localGuidelines.safety}
          weather={localInfo.localGuidelines.weather}
          business={localInfo.localGuidelines.business}
        />
      </TabsContent>
    </Tabs>
  );
}