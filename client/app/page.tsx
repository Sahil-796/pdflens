import React from "react";
import Navbar from '@/components/bars/LandingNavbar'
import HeroSection from "@/components/hero-section";
import Features from "@/components/features-1";
import Features4 from "@/components/features-4";
import { HowItWorks } from "@/components/ui/how-it-works";
import FAQsFour from "@/components/faqs-4";
import TeamSection from "@/components/landingPage/team";
const LandingPage = () => {
  return (
    <div className="bg-background">

      <Navbar />
      <HeroSection />
      <Features />
      <HowItWorks />
      {/* Use cases */}
      <Features4 />
      <FAQsFour />


    </div>
  );
};

export default LandingPage;
