"use client";

import { Phone, Siren, Building2, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface EmergencyContact {
  name: string;
  number: string;
  icon: "police" | "ambulance" | "embassy" | "touristPolice";
}

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  countryCode: string;
}

export default function EmergencyCard({ contacts, countryCode }: EmergencyContactsProps) {
  const getIcon = (type: EmergencyContact["icon"]) => {
    switch (type) {
      case "police":
        return <ShieldAlert className="h-5 w-5" />;
      case "ambulance":
        return <Siren className="h-5 w-5" />;
      case "embassy":
        return <Building2 className="h-5 w-5" />;
      case "touristPolice":
        return <ShieldAlert className="h-5 w-5" />;
      default:
        return <Phone className="h-5 w-5" />;
    }
  };

  const formatPhoneNumber = (number: string) => {
    return countryCode + number.replace(/\D/g, "");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <Phone className="h-5 w-5 text-primary" />
        Emergency Contacts
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {contacts.map((contact, index) => (
          <div
            key={index}
            className="rounded-xl border border-border/50 overflow-hidden backdrop-blur-sm bg-background/50 p-4 hover:border-primary/50 transition-colors"
          >
            <Link
              href={`tel:${formatPhoneNumber(contact.number)}`}
              className="flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  {getIcon(contact.icon)}
                </div>
                <h4 className="font-medium">{contact.name}</h4>
              </div>

              <div className="mt-auto">
                <p className="text-xl font-semibold text-primary">{contact.number}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click to call immediately
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-primary/5 border border-primary/10 p-4 text-sm text-muted-foreground">
        <p>
          <strong>Important:</strong> Save these numbers in your phone before your trip.
          In case of emergency, dial the number directly or click to call.
        </p>
      </div>
    </div>
  );
}