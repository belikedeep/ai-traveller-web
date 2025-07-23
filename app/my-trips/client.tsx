"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/service/FirebaseConfig";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalendarDays, Loader2, Map, Plus, Users, Wallet } from "lucide-react";
import Link from "next/link";

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

interface User {
  email: string;
}

export default function TripsClient() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        if (!user) return;

        const q = query(
          collection(db, "AITrips"),
          where("userEmail", "==", user?.email)
        );

        const querySnapshot = await getDocs(q);
        const tripsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Trip[];

        setTrips(tripsData);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-muted-foreground">Loading your adventures...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Welcome to Trip Genie</h2>
          <p className="text-muted-foreground">
            Please sign in to view your trips
          </p>
        </div>
        <Button onClick={() => router.push("/")}>Sign In</Button>
      </div>
    );
  }

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
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Trip
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
          My Trips
        </h1>
        <Link href="/create-trip">
          <Button variant="default" size="lg" className="gap-2">
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
            className="rounded-xl border border-border/50 overflow-hidden backdrop-blur-sm bg-background/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer group"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-lg font-medium group-hover:text-indigo-400 transition-colors">
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
