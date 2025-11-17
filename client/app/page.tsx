import React from "react";
import Navbar from '@/components/bars/LandingNavbar'
import HeroSection from "@/components/hero-section";
import Features from "@/components/features-1";
import Features4 from "@/components/features-4";
import { HowItWorks } from "@/components/ui/how-it-works";
const LandingPage = () => {
  return (
    <div className="bg-background">

      <Navbar />
      <HeroSection />
      <Features />
      <HowItWorks />
      {/* Use cases */}
      <Features4 />


    </div>
  );
};

export default LandingPage;
