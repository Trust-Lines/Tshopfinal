import React from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ConfiguratorSteps from "@/components/ConfiguratorSteps";
import FixtureCatalog from "@/components/FixtureCatalog";
import CuratedCollectionSection from "@/components/CuratedCollectionSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-red-500 selection:text-white">
      {/* Top Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenConfigurator={() => setIsConfiguratorOpen(true)}
      />

      <main className="flex-1">
        <HeroSection />
        <ConfiguratorSteps />
        <FixtureCatalog />
        <CuratedCollectionSection />
      </main>

      <Footer />
    </div>
  );
}
