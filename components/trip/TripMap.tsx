"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { Loader } from "lucide-react";
import { Loader as GoogleLoader, Libraries } from "@googlemaps/js-api-loader";

interface Place {
  placeName: string;
  placeDetails: string;
  rating: number;
  approximate_time: string;
}

interface TripMapProps {
  center: string;
  selectedPlace?: string | null;
  places: Place[];
  onMarkersCleared?: () => void;
}

interface MarkerInfo {
  marker: google.maps.Marker;
  infoWindow: google.maps.InfoWindow;
  placeName: string;
  placeIndex: number;
}

const LIBRARIES: Libraries = ["places"];

// Initialize Google Maps loader
const loader = new GoogleLoader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY || "",
  version: "weekly",
  libraries: LIBRARIES
});

export default function TripMap({ 
  center, 
  selectedPlace, 
  places,
  onMarkersCleared
}: TripMapProps): ReactNode {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<MarkerInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to clear all markers
  const clearAllMarkers = () => {
    markersRef.current.forEach(({ marker, infoWindow }) => {
      marker.setMap(null);
      infoWindow.close();
    });
    markersRef.current = [];
    onMarkersCleared?.();
  };

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        await loader.load();
        const { Map, Geocoder } = google.maps;

        // Clear any existing markers first
        clearAllMarkers();

        // Get city coordinates
        const geocoder = new Geocoder();
        const result = await geocoder.geocode({ 
          address: `${center}, India`,
          region: 'in'
        });

        if (!result.results?.length) {
          throw new Error("City not found");
        }

        const location = result.results[0].geometry.location;
        console.log('City location:', location.toJSON());

        const map = new Map(mapRef.current, {
          center: location,
          zoom: 12,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        });

        mapInstanceRef.current = map;
        setLoading(false);

      } catch (error) {
        console.error("Error initializing map:", error);
        setLoading(false);
      }
    };

    initializeMap();

    return () => {
      clearAllMarkers();
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [center]);

  // Add markers for places
  useEffect(() => {
    const addMarkers = async () => {
      const map = mapInstanceRef.current;
      if (!map) return;

      // Clear existing markers
      clearAllMarkers();

      const bounds = new google.maps.LatLngBounds();
      const geocoder = new google.maps.Geocoder();

      for (const [index, place] of places.entries()) {
        try {
          const searchResult = await geocoder.geocode({
            address: `${place.placeName}, ${center}, India`,
            region: 'in'
          });

          if (!searchResult.results?.length) {
            console.warn(`No location found for: ${place.placeName}`);
            continue;
          }

          const position = searchResult.results[0].geometry.location;

          // Create info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-4 max-w-[300px]">
                <h3 class="font-semibold text-base mb-3 text-gray-900">${place.placeName}</h3>
                <p class="text-sm mb-3 text-gray-700">${place.placeDetails}</p>
                <div class="text-sm flex items-center justify-between">
                  <span class="flex items-center gap-1">
                    <span class="text-yellow-500">⭐</span>
                    <span class="text-gray-600">${place.rating}</span>
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="text-blue-500">⏱️</span>
                    <span class="text-gray-600">${place.approximate_time}</span>
                  </span>
                </div>
              </div>
            `,
            pixelOffset: new google.maps.Size(0, -30)
          });

          // Create marker
          const marker = new google.maps.Marker({
            position,
            map,
            label: {
              text: String(index + 1),
              color: "white",
              className: "font-semibold text-sm"
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: selectedPlace === place.placeName ? "rgb(37 99 235)" : "rgb(22 163 74)",
              fillOpacity: 1,
              strokeColor: "white",
              strokeWeight: 2,
              scale: 15,
              labelOrigin: new google.maps.Point(0, 0)
            },
            title: place.placeName,
            optimized: false
          });

          marker.addListener("click", () => {
            markersRef.current.forEach(({ infoWindow }) => infoWindow.close());
            infoWindow.open(map, marker);
            map.panTo(position);
            map.setZoom(16);
          });

          markersRef.current.push({ 
            marker,
            infoWindow,
            placeName: place.placeName,
            placeIndex: index
          });
          bounds.extend(position);
        } catch (error) {
          console.error(`Error adding marker for ${place.placeName}:`, error);
        }
      }

      // Fit map to show all markers
      if (markersRef.current.length > 0) {
        const padding = { top: 50, right: 50, bottom: 50, left: 50 };
        map.fitBounds(bounds, padding);
      }
    };

    addMarkers();
  }, [places, center, selectedPlace]);

  // Handle selected place
  useEffect(() => {
    if (!mapInstanceRef.current || !markersRef.current.length) return;

    // If no place selected, hide all markers
    if (!selectedPlace) {
      markersRef.current.forEach(({ marker }) => {
        marker.setVisible(false);
      });
      return;
    }

    // Show and highlight selected marker
    markersRef.current.forEach(({ marker, infoWindow, placeName }) => {
      marker.setVisible(true);
      
      if (placeName === selectedPlace) {
        infoWindow.open(mapInstanceRef.current, marker);
        mapInstanceRef.current?.panTo(marker.getPosition()!);
        mapInstanceRef.current?.setZoom(16);
        
        marker.setIcon({
          ...marker.getIcon() as google.maps.Symbol,
          fillColor: "rgb(37 99 235)" // blue-600
        });
      } else {
        infoWindow.close();
        marker.setIcon({
          ...marker.getIcon() as google.maps.Symbol,
          fillColor: "rgb(22 163 74)" // green-600
        });
      }
    });
  }, [selectedPlace]);

  return (
    <div className="relative w-full h-full bg-background">
      <div ref={mapRef} className="absolute inset-0 rounded-lg border border-border/50 overflow-hidden" />
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <Loader className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
}