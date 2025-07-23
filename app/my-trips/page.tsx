"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/service/FirebaseConfig";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Loader2,
  Map,
  Plus,
  Users,
  Wallet,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { syncUserAuth } from "@/lib/auth-utils";

interface TripUserSelection {
  location: {
    label: string;
  };
  noOfDays: number;
  budget: string;
  travellingWith: string;
}

interface TripData {
  destination: string;
  totalDays: number;
  budget: string;
  travellingWith: string;
  dailySchedule: Array<{
    day: number;
    activities: Array<{
      time: string;
      activity: string;
      location: string;
      travelTips: string;
    }>;
  }>;
}

interface Trip {
  id: string;
  userSelection: TripUserSelection;
  tripData: TripData;
  userEmail: string;
}

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError(null);

    const userData = syncUserAuth();
    if (!userData) {
      router.replace("/");
      return;
    }

    try {
      const q = query(
        collection(db, "AITrips"),
        where("userEmail", "==", userData.email)
      );

      const querySnapshot = await getDocs(q);
      const tripsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Trip[];

      setTrips(tripsData);
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError("Failed to load trips");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your adventures...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-lg text-destructive">{error}</p>
        <Button
          onClick={fetchTrips}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (trips.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">No trips yet</h2>
          <p className="text-muted-foreground">
            Start planning your next adventure!
          </p>
        </div>
        <Link href="/create-trip">
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4" />
            Create New Trip
          </Button>
        </Link>
      </div>
    );
  }

  // Trips list
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
          My Trips
        </h1>
        <Link href="/create-trip">
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4" />
            New Trip
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div
            key={trip.id}
            onClick={() => router.push(`/my-trips/${trip.id}`)}
            className="rounded-xl border border-border/50 overflow-hidden backdrop-blur-sm bg-background/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 cursor-pointer group"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-lg font-medium group-hover:text-primary transition-colors">
                    <Map className="h-5 w-5" />
                    {trip.userSelection.location.label}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="space-y-1">
                  <div className="text-muted-foreground text-sm flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    Duration
                  </div>
                  <p className="font-medium">
                    {trip.userSelection.noOfDays} days
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-sm flex items-center gap-1.5">
                    <Wallet className="h-4 w-4" />
                    Budget
                  </div>
                  <p className="font-medium">{trip.userSelection.budget}</p>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-sm flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    Group
                  </div>
                  <p className="font-medium">
                    {trip.userSelection.travellingWith}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
