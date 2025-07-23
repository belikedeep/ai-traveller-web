import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Travel Itineraries | Trip Genie Dashboard",
  description:
    "View and manage your AI-generated travel itineraries. Access your personalized trip plans, modify your schedules, and create new adventures.",
  keywords:
    "travel dashboard, trip management, itinerary manager, travel plans, AI travel planner",
  openGraph: {
    title: "My Travel Itineraries | Trip Genie Dashboard",
    description:
      "Manage your AI-generated travel itineraries and plan new adventures.",
    type: "website",
    locale: "en_US",
    url: "https://www.tripgenie.pro/my-trips",
  },
  twitter: {
    card: "summary",
    title: "Trip Genie Travel Dashboard",
    description:
      "Manage your AI-generated travel itineraries and plan new adventures.",
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://www.tripgenie.pro/my-trips",
  },
  verification: {
    google: "your-google-site-verification", // Add this when you have the actual verification code
  },
};
