"use client";
import { Header } from "@/components/layout/Header";
import { BenefitSection } from "@/components/sections/BenefitSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { PlatformSection } from "@/components/sections/PlatformSection";
import { ReadySection } from "@/components/sections/ReadySection";
import { useParallax } from "@/hooks/animation-hook/useParallax";
import Image from "next/image";

export default function Home() {
  const { containerRef, y, opacity, scale } = useParallax({
    y: ["0%", "50%"],
    opacity: [1, 0],
    scale: [1, 0.8],
  });
  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#fffdfb] overflow-hidden"
    >
      {/* <ParallaxBackground y={y} /> */}
      <HeroSection opacity={opacity} scale={scale} />
      <BenefitSection />
      <PlatformSection />
      <ReadySection />
      {/* <FloatingElements /> */}
      {/* <AdditionalSection /> */}
    </div>
  );
}
