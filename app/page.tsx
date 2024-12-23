"use client"
import { HeroSection } from "@/components/hero-section";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <Features />
      <Footer />
    </div>
  );
}