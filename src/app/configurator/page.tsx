import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConfiguratorFlow from "@/components/configurator/ConfiguratorFlow";

export const metadata: Metadata = {
  title: "Build Your Store — Zone Configurator | T Shop",
  description:
    "Pick your store zones, size each run, and get a recommended fixture package rendered in 3D.",
};

export default function ConfiguratorPage() {
  return (
    <div className="min-h-screen lg:h-[100dvh] flex flex-col bg-[#F2F1EF] font-sans overflow-y-auto lg:overflow-hidden">
      <Header />
      <main className="flex-1 relative overflow-y-auto lg:overflow-hidden bg-[#F2F1EF]">
        <ConfiguratorFlow />
      </main>
    </div>
  );
}
