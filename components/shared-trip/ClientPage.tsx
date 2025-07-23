"use client";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/service/FirebaseConfig";
import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import InfoSection from "@/components/trip/InfoSection";
import Hotels from "@/components/trip/Hotels";
import PlacesToVisit from "@/components/trip/PlacesToVisit";
import SignInRequired from "@/components/ui/SignInRequired";
import { syncUserAuth } from "@/lib/auth-utils";

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

export interface ClientPageProps {
  tripId: string;
}

export default function ClientPage({ tripId }: ClientPageProps) {
  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresAuth, setRequiresAuth] = useState(false);
  const fetchTrip = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const tripRef = doc(db, "AITrips", tripId);
      const tripSnap = await getDoc(tripRef);

      if (!tripSnap.exists()) {
        setError("Trip not found");
        return;
      }

      const tripData = tripSnap.data() as Omit<TripData, "id">;
      const tripOwnerRef = doc(db, "users", tripData.userEmail);
      const tripOwnerSnap = await getDoc(tripOwnerRef);

      // Check if owner is PRO/PREMIUM for public access
      const isPublic =
        tripOwnerSnap.exists() &&
        ["PRO", "PREMIUM"].includes(tripOwnerSnap.data().plan);

      const userData = syncUserAuth();
      if (!isPublic && !userData) {
        setRequiresAuth(true);
        return;
      }

      setTrip({
        ...tripData,
        id: tripSnap.id,
      });
      setRequiresAuth(false);
    } catch (err) {
      setError("Failed to load trip");
      console.error("Error fetching trip:", err);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  // Initial load and check for auth changes
  useEffect(() => {
    fetchTrip();

    // Listen for auth changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        fetchTrip();
      }
    };

    const handleAuthChange = () => {
      fetchTrip();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [fetchTrip]);

  // Authentication required state - show this first
  if (requiresAuth) {
    return (
      <div className="min-h-screen bg-background">
        <SignInRequired
          message="This trip requires authentication to view. Please sign in to continue."
          onSignIn={fetchTrip}
        />
      </div>
    );
  }

  // Loading state
  if (loading && !error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
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
          <p className="text-lg text-red-500">
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
        <div className="absolute inset-0 bg-gradient-to-b from-background via-indigo-500/5 to-background -z-10" />
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
