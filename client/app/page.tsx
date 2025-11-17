import React from "react";
import Navbar from '@/components/bars/LandingNavbar'
import HeroSection from "@/components/hero-section";
import Features from "@/components/features-1";
import Features4 from "@/components/features-4";
import { HowItWorks } from "@/components/ui/how-it-works";
import FAQsFour from "@/components/faqs-4";
import TeamSection from "@/components/landingPage/team";
import { CallToAction } from "@/components/cta";
import FooterSection from "@/components/footer";
const LandingPage = () => {
  return (
    <div className="bg-background">

      <Navbar />
      <HeroSection />
      <Features />
      <HowItWorks />
      <Features4 />
      <FAQsFour />
      <CallToAction />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
