import React from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StoreTypesSection from "@/components/StoreTypesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FixtureCatalog from "@/components/FixtureCatalog";
import CuratedCollectionSection from "@/components/CuratedCollectionSection";
import NeedHelpSection from "@/components/NeedHelpSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-red-500 selection:text-white">
      {/* Top Header */}
      <Header />

      <main className="flex-1">
        <HeroSection />
        <StoreTypesSection />
        <HowItWorksSection />
        <CuratedCollectionSection />
        <FixtureCatalog />
        <NeedHelpSection />
      </main>

      <Footer />
    </div>
  );
}
