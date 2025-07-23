"use client";

import { use, useEffect, useState, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/service/FirebaseConfig";
import { getDestinationDefaults, updateLocalInfo } from "@/service/LocalInfoService";
import InfoSection from "@/components/trip/InfoSection";
import Hotels from "@/components/trip/Hotels";
import PlacesToVisit from "@/components/trip/PlacesToVisit";
import InfoTab from "@/components/trip/local-info/InfoTab";
import TripMap from "@/components/trip/TripMap";
import { Loader2 } from "lucide-react";

interface TripData {
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
      hotelName: string;
      hotelAddress: string;
      price: string;
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
    localInfo?: {
      destination: string;
      countryCode: string;
      localLanguage: string;
      emergencyContacts: Array<{
        name: string;
        number: string;
        icon: "police" | "ambulance" | "embassy" | "touristPolice";
      }>;
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
    };
  };
}

export default function ViewTripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const unwrappedParams = use(params);
  const [trip, setTrip] = useState<TripData | null>(null);
  const [isLoadingLocalInfo, setIsLoadingLocalInfo] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [markersVisible, setMarkersVisible] = useState(true);

  // Handle place selection from itinerary
  const handlePlaceSelect = (place: string) => {
    console.log('Selected place:', place);
    setSelectedPlace(place);
    setMarkersVisible(true); // Ensure markers are visible when selecting
  };

  const getTripData = useCallback(async () => {
    try {
      const docRef = doc(db, "AITrips", unwrappedParams.tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const tripData = docSnap.data() as TripData;
        setTrip(tripData);

        // Check if local info exists, if not, create it
        if (!tripData.tripData.localInfo) {
          const defaultInfo = getDestinationDefaults(tripData.userSelection.location.label);
          await updateLocalInfo(unwrappedParams.tripId, defaultInfo);
          
          // Fetch updated trip data
          const updatedDoc = await getDoc(docRef);
          if (updatedDoc.exists()) {
            setTrip(updatedDoc.data() as TripData);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
    }
  }, [unwrappedParams.tripId]);

  useEffect(() => {
    if (unwrappedParams.tripId) {
      getTripData().finally(() => {
        setIsLoadingLocalInfo(false);
      });
    }
  }, [unwrappedParams.tripId, getTripData]);

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-muted-foreground">Loading your trip details...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-indigo-500/5 to-background -z-10" />
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

      <div className="grid grid-cols-2 min-h-[calc(100vh-4rem)]">
        {/* Left side: Scrollable content */}
        <div className="overflow-y-auto border-r border-border/50">
          <div className="px-6 py-8">
            <div className="space-y-12 max-w-2xl">
              <InfoSection trip={trip} />
              <Hotels trip={trip} />
              <PlacesToVisit
                trip={trip}
                onPlaceSelect={handlePlaceSelect}
                selectedPlace={selectedPlace}
              />
              <InfoTab
                localInfo={trip.tripData.localInfo || null}
                isLoading={isLoadingLocalInfo}
              />
            </div>
          </div>
        </div>

        {/* Right side: Fixed map */}
        <div className="sticky top-16 h-[calc(100vh-4rem)]">
          <TripMap
            center={trip.userSelection.location.label}
            selectedPlace={selectedPlace}
            places={Object.values(trip.tripData.itinerary).flatMap(day => day.places)}
          />
        </div>
      </div>
    </div>
  );
}
