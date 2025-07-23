import type { Metadata } from "next";
import Script from "next/script";
import {
  PHProvider,
  PostHogPageview,
} from "@/components/providers/posthog-provider";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import "./globals.css";
import Header from "@/components/header";
// import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import type { Viewport } from "next";
import Image from "next/image";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Trip Genie - Your AI-Powered Travel Planning Assistant",
  description:
    "Create personalized travel itineraries in minutes with our advanced AI technology. Get custom recommendations, save planning time, and explore destinations with confidence.",
  keywords:
    "AI travel planner, travel itinerary, trip planning, personalized travel, travel assistant, custom itinerary, travel recommendations",
  authors: [{ name: "Trip Genie" }],
  openGraph: {
    title: "Trip Genie - Your AI-Powered Travel Planning Assistant",
    description:
      "Create personalized travel itineraries in minutes with Trip Genie.",
    type: "website",
    locale: "en_US",
    url: "https://www.tripgenie.pro",
    images: [
      {
        url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0",
        width: 2070,
        height: 1380,
        alt: "Trip Genie - AI Travel Planning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trip Genie - Your AI-Powered Travel Planning Assistant",
    description:
      "Create personalized travel itineraries in minutes with Trip Genie.",
    images: ["https://images.unsplash.com/photo-1530789253388-582c481c54b0"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: { url: "/apple-touch-icon.png" },
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '529029913148583');
          fbq('track', 'PageView');
        `}
      </Script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90`}
      >
        <noscript>
          {/* Fallback tracking pixel - keeping standard img tag as it's hidden and for tracking only */}
          <img
            height="1"
            width="1"
            loading="eager"
            decoding="async"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=529029913148583&ev=PageView&noscript=1"
            alt="Facebook Tracking Pixel"
          />
        </noscript>
        <PHProvider>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy-id"}
          >
            <div className="relative flex min-h-screen">
              {/* Background gradients */}
              <div className="fixed inset-0 bg-grid-white/[0.02] -z-10" />
              <div className="fixed inset-0 bg-gradient-to-tr from-background via-primary/5 to-background -z-10" />

              <Header />

              {/* Main content area */}
              <div className="flex-1 flex flex-col min-h-screen lg:pl-64 pt-16 lg:pt-0">
                <main className="flex-1 relative z-0">{children}</main>
                {/* <Footer /> */}
              </div>

              <PostHogPageview />
              <Toaster position="bottom-right" />
            </div>
          </GoogleOAuthProvider>
        </PHProvider>
      </body>
    </html>
  );
}
