"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/my-trips");
    }
  }, [router]);

  return (
    <main className="relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,hsl(var(--primary)),transparent)] opacity-5" />
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:grid lg:grid-cols-2 lg:h-screen lg:items-center lg:gap-8">
          {/* Left side with text */}
          {/* Left column for text */}
          <div className="mx-auto max-w-2xl text-left lg:mx-0">
            <h1 className="text-3xl font-extrabold sm:text-5xl lg:text-7xl flex flex-col items-start">
              <div className="flex items-center gap-4">
                <span className="animate-bounce">🚀</span>
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Your Perfect Trip,
                </span>
              </div>
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent sm:mt-2">
                Planned by AI
              </span>
              <span className="animate-pulse sm:mt-2">✨</span>
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-xl text-muted-foreground sm:text-2xl/relaxed">
              Create personalized travel itineraries in minutes with our
              advanced AI technology. Perfect for any destination, any budget,
              any style.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link href="/create-trip">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-full group transform hover:scale-105 transition-all duration-300 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25"
                >
                  <span>
                    Plan Your Trip <span className="inline-block">🗺️</span>
                  </span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-full transform hover:scale-105 transition-all duration-300 hover:bg-primary/10"
                >
                  Learn More <span className="inline-block">💡</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right column for hero image */}
          <div className="hidden lg:block relative mt-12 lg:mt-0">
            <div className="aspect-[4/3] w-full relative rounded-2xl overflow-hidden border border-border/50 bg-background/50 backdrop-blur-sm shadow-2xl -rotate-3">
              <Image
                src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                width={1200}
                height={900}
                alt="Hero image"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
