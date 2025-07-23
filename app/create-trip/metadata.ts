import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your AI Travel Itinerary | Trip Genie",
  description:
    "Plan your perfect trip in minutes with Trip Genie's AI-powered travel planner. Get personalized recommendations for destinations, activities, and accommodations based on your preferences.",
  keywords:
    "AI travel planner, custom itinerary, trip planning, travel recommendations, personalized travel, vacation planner",
  openGraph: {
    title: "Create Your AI Travel Itinerary | Trip Genie",
    description:
      "Plan your perfect trip in minutes with our AI travel planner. Get personalized recommendations tailored to your preferences.",
    type: "website",
    locale: "en_US",
    url: "https://www.tripgenie.pro/create-trip",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Your AI Travel Itinerary | Trip Genie",
    description:
      "Plan your perfect trip in minutes with our AI travel planner. Get personalized recommendations tailored to your preferences.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
