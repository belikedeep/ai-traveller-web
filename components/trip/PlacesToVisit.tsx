"use client";

import { useEffect, useState, useCallback, memo, useMemo } from "react";
import { GetPlaceDetails, GetPlacePhoto } from "@/service/GlobalAPI";
import Image from "next/image";
import {
  CalendarDays,
  Clock,
  Star,
  MapPin,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { addDays, format } from "date-fns";

interface Place {
  placeName: string;
  placeDetails: string;
  rating: number;
  approximate_time: string;
}

interface DayData {
  theme: string;
  summary?: string;
  best_time_to_visit: string;
  places: Place[];
}

interface TripProps {
  trip: {
    tripData: {
      itinerary: Record<string, DayData>;
    };
    userSelection: {
      location: {
        label: string;
      };
      startDate: string;
      noOfDays: number;
    };
  };
  onPlaceSelect?: (place: string) => void;
  selectedPlace?: string | null;
}

const calculateEndDate = (startDate: string, noOfDays: number): Date => {
  const start = new Date(startDate);
  return addDays(start, noOfDays - 1);
};

function PlacesToVisit({ trip, onPlaceSelect, selectedPlace }: TripProps) {
  const [placePhotos, setPlacePhotos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const memoizedTrip = useMemo(() => trip, [trip]);
  const memoizedItinerary = useMemo(
    () => memoizedTrip?.tripData?.itinerary || {},
    [memoizedTrip?.tripData?.itinerary]
  );
  
  const memoizedDays = useMemo(() => {
    const days = Object.entries(memoizedTrip?.tripData?.itinerary || {});
    return days.sort((a, b) => {
      const dayNumA = parseInt(a[0].replace("Day ", ""));
      const dayNumB = parseInt(b[0].replace("Day ", ""));
      return dayNumA - dayNumB;
    });
  }, [memoizedTrip]);

  const getDateForDay = useCallback(
    (dayNumber: number) => {
      try {
        if (!trip?.userSelection?.startDate) return null;
        const startDate = new Date(trip.userSelection.startDate);
        if (isNaN(startDate.getTime())) return null;
        return addDays(startDate, dayNumber - 1);
      } catch (error) {
        console.error("Error calculating date:", error);
        return null;
      }
    },
    [trip?.userSelection?.startDate]
  );

  const formatDate = useCallback((date: Date | null) => {
    try {
      if (!date || isNaN(date.getTime())) return "";
      return format(date, "MMMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  }, []);

  const fetchPlacePhotos = useCallback(async () => {
    setLoading(true);
    try {
      const photos: Record<string, string> = {};
      for (const [, dayData] of memoizedDays) {
        for (const place of dayData.places) {
          const query = `${place.placeName} ${trip?.userSelection.location.label}`;
          const result = await GetPlaceDetails(query);

          if (result?.data?.results?.[0]?.photos?.[0]?.photo_reference) {
            const photoRef = result.data.results[0].photos[0].photo_reference;
            const url = GetPlacePhoto(photoRef);
            if (url) {
              photos[place.placeName] = url;
            }
          }
        }
      }
      setPlacePhotos(photos);
    } catch (error) {
      console.error("Error fetching place photos:", error);
    } finally {
      setLoading(false);
    }
  }, [trip?.userSelection.location.label, memoizedDays]);

  useEffect(() => {
    if (Object.keys(memoizedItinerary).length > 0) {
      fetchPlacePhotos();
    }
  }, [memoizedItinerary, fetchPlacePhotos]);

  const handlePlaceClick = useCallback((placeName: string) => {
    if (onPlaceSelect) {
      console.log('Selecting place:', placeName);
      onPlaceSelect(placeName);
    }
  }, [onPlaceSelect]);

  return (
    <div>
      <div className="space-y-6 mb-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text flex items-center gap-2">
            Your Travel Itinerary
            {loading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
          </h2>
          <p className="text-sm leading-relaxed">
            Welcome to {trip.userSelection.location.label}! Explore this curated {trip.userSelection.noOfDays}-day
            itinerary showcasing the finest attractions and experiences. Each destination is marked on the map -
            simply click any location to zoom in and view more details.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{trip.userSelection.location.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{trip.userSelection.noOfDays} Days Trip</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>
              {formatDate(new Date(trip.userSelection.startDate))} - {" "}
              {formatDate(calculateEndDate(trip.userSelection.startDate, trip.userSelection.noOfDays))}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {memoizedDays.map(([dayKey, dayData]) => {
          const dayNumber = parseInt(dayKey.replace("Day ", ""));
          const date = getDateForDay(dayNumber);
          const formattedDate = formatDate(date);

          return (
            <div
              key={dayKey}
              className="rounded-xl border border-border/50 overflow-hidden backdrop-blur-sm bg-background/50"
            >
              <div className="p-6 border-b border-border/50 space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">
                    {dayKey}: {dayData.theme}
                    {formattedDate ? ` (${formattedDate})` : ""}
                  </h3>
                </div>
                {dayData.summary && (
                  <p className="text-sm">{dayData.summary}</p>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Recommended Time: {dayData.best_time_to_visit}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {dayData.places.map((place, index) => (
                  <div
                    key={`${dayKey}-place-${index}`}
                    className={`group transition-all duration-300 ${
                      selectedPlace === place.placeName
                        ? "transform scale-[1.02]"
                        : "hover:transform hover:scale-[1.02]"
                    }`}
                    onClick={() => handlePlaceClick(place.placeName)}
                  >
                    <div
                      className={`rounded-xl border overflow-hidden backdrop-blur-sm bg-background/50 transition-all duration-300 ${
                        selectedPlace === place.placeName
                          ? "border-primary shadow-xl shadow-primary/10"
                          : "border-border/50 hover:shadow-xl hover:shadow-primary/10"
                      } ${onPlaceSelect ? "cursor-pointer" : ""}`}
                    >
                      <div className="relative aspect-video">
                        <div className="absolute inset-0 z-10" />
                        {loading ? (
                          <div className="absolute inset-0 bg-background animate-pulse" />
                        ) : (
                          <Image
                            src={placePhotos[place.placeName] || "/placeholder.jpg"}
                            alt={place.placeName}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-110"
                          />
                        )}
                        <div className="absolute top-3 right-3 z-20">
                          <div className="flex items-center gap-1 text-sm bg-background/90 px-2 py-1 rounded-full backdrop-blur-sm border border-border/50">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span>{place.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className={`font-semibold line-clamp-1 transition-colors ${
                              selectedPlace === place.placeName
                                ? "text-primary"
                                : "group-hover:text-primary"
                            }`}
                          >
                            {place.placeName}
                          </h4>
                          <ArrowUpRight
                            className={`h-4 w-4 transition-all ${
                              selectedPlace === place.placeName
                                ? "text-primary translate-x-0.5 -translate-y-0.5"
                                : "text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            }`}
                          />
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                          <p className="line-clamp-2 text-sm">{place.placeDetails}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm pt-2 text-primary/80">
                          <Clock className="h-4 w-4" />
                          <span>{place.approximate_time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(PlacesToVisit);
