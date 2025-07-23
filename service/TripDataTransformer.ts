interface Place {
  placeName: string;
  placeDetails: string;
  rating: number;
  approximate_time: string;
  image_url?: string;
}

interface Hotel {
  HotelName: string;
  HotelAddress: string;
  Price: string;
  rating: number;
  description: string;
  image_url?: string;
}

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
    hotel_options: Hotel[];
    itinerary: Record<string, {
      theme: string;
      best_time_to_visit: string;
      places: Place[];
    }>;
  };
}

export function transformTripData(tripData: TripData): TripData {
  // Simply return the data as is since all data including images should be dynamic
  return tripData;
}