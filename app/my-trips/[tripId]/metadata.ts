import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trip Details | Trip Genie",
  description:
    "View your detailed AI-generated travel itinerary with day-by-day schedule, recommended activities, and travel tips.",
  keywords:
    "travel itinerary, trip details, travel schedule, AI recommendations, travel tips",
  openGraph: {
    title: "Trip Details | Trip Genie",
    description: "View your detailed Trip Genie-generated travel itinerary.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Trip Details | Trip Genie",
    description: "View your detailed AI-generated travel itinerary.",
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};
