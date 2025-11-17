import React from "react";
import Navbar from '@/components/bars/LandingNavbar'
import HeroSection from "@/components/hero-section";
import Features from "@/components/features-1";
const LandingPage = () => {
  return (
    <div className="bg-background">

      <Navbar />
      <HeroSection />
      <Features />
      {/*How it works */}

    </div>
  );
};

export default LandingPage;
