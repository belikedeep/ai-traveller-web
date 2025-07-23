"use client";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/service/FirebaseConfig";
import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import InfoSection from "@/components/trip/InfoSection";
import Hotels from "@/components/trip/Hotels";
import PlacesToVisit from "@/components/trip/PlacesToVisit";

interface TripData {
  id: string;
  userEmail: string;
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
  tripData: {
    hotel_options: Array<{
      HotelName: string;
      HotelAddress: string;
      Price: string;
      rating: number;
      description: string;
    }>;
    itinerary: Record<
      string,
      {
        theme: string;
        best_time_to_visit: string;
        places: Array<{
          placeName: string;
          placeDetails: string;
          rating: number;
          approximate_time: string;
        }>;
      }
    >;
  };
}

interface SharedTripPageProps {
  params: {
    tripId: string;
  };
}

export default function SharedTripPageClient({ params }: SharedTripPageProps) {
  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrip = useCallback(async () => {
    try {
      const tripRef = doc(db, "AITrips", params.tripId);
      const tripSnap = await getDoc(tripRef);

      if (!tripSnap.exists()) {
        setError("Trip not found");
        return;
      }

      const tripData = tripSnap.data() as Omit<TripData, "id">;
      setTrip({
        ...tripData,
        id: tripSnap.id,
      });
    } catch (err) {
      setError("Failed to load trip");
      console.error("Error fetching trip:", err);
    } finally {
      setLoading(false);
    }
  }, [params.tripId]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading trip details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !trip) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <p className="text-lg text-destructive">
            {error || "Something went wrong"}
          </p>
          <p className="text-muted-foreground">
            Unable to load the trip details
          </p>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background -z-10" />
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

        <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
          <div className="space-y-12">
            <InfoSection trip={trip} />
            <Hotels trip={trip} />
            <PlacesToVisit trip={trip} />
          </div>
        </div>
      </div>
    </div>
  );
}
