"use client";
import { useEffect } from "react";
import Hero from "@/components/Hero";
import WhyUs from "@/components/Whyus";
import Navigation from "@/components/Navigation";
import { initializeSampleData } from "@/lib/sample-data";

export default function Home() {
  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Hero />

      {/* Why Us Section */}
      <WhyUs />
    </div>
  );
}
