"use client";

import { GetPlaceDetails, GetPlacePhoto } from "@/service/GlobalAPI";
import Image from "next/image";
import { useEffect, useState, useCallback, memo } from "react";
import { MapPin, Calendar, Wallet2, Users } from "lucide-react";
import { format } from "date-fns";

interface TripProps {
  trip: {
    id?: string;
    userSelection: {
      location: {
        label: string;
      };
      startDate: string;
      endDate: string;
      noOfDays: number;
      budget: string;
      travellingWith: string;
    };
  };
}

function InfoSection({ trip }: TripProps) {
  const [photoUrl, setPhotoUrl] = useState("/placeholder.jpg");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlacePhoto = useCallback(async () => {
    try {
      const locationName = trip?.userSelection.location.label;
      const result = await GetPlaceDetails(locationName);
      const place = result?.data?.results?.[0];

      if (place?.photos?.[0]?.photo_reference) {
        const photoRef = place.photos[0].photo_reference;
        const url = GetPlacePhoto(photoRef);
        if (url) {
          setPhotoUrl(url);
        }
      }
    } catch (error) {
      console.error("Error fetching place photo:", error);
    } finally {
      setIsLoading(false);
    }
  }, [trip?.userSelection.location.label]);

  useEffect(() => {
    if (trip?.userSelection.location.label) {
      fetchPlacePhoto();
    }
  }, [trip?.userSelection.location.label, fetchPlacePhoto]);

  const formatDateRange = useCallback(() => {
    try {
      if (!trip?.userSelection.startDate || !trip?.userSelection.endDate)
        return "";
      const startDate = new Date(trip.userSelection.startDate);
      const endDate = new Date(trip.userSelection.endDate);
      return `${format(startDate, "MMM d")} - ${format(
        endDate,
        "MMM d, yyyy"
      )}`;
    } catch (error) {
      console.error("Error formatting dates:", error);
      return "";
    }
  }, [trip?.userSelection.startDate, trip?.userSelection.endDate]);

  return (
    <div className="rounded-2xl border border-border/50 overflow-hidden backdrop-blur-sm bg-background/50">
      <div className="relative h-[400px] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
        {isLoading ? (
          <div className="absolute inset-0 bg-background animate-pulse" />
        ) : (
          <Image
            src={photoUrl}
            alt={trip?.userSelection.location.label || "trip"}
            fill
            className="object-cover transition-all duration-500"
            priority
          />
        )}
      </div>

      <div className="p-6 relative z-20 -mt-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{trip?.userSelection.location.label}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {formatDateRange()} ({trip?.userSelection.noOfDays}{" "}
                  {trip?.userSelection.noOfDays === 1 ? "Day" : "Days"})
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
                <Wallet2 className="h-4 w-4 text-primary" />
                <span>{trip?.userSelection.budget} Budget</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
                <Users className="h-4 w-4 text-primary" />
                <span>{trip?.userSelection.travellingWith} Travelers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(InfoSection);
