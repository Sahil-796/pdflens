import React from "react";
import Navbar from '@/components/bars/LandingNavbar'
import { HowItWorks } from "@/components/landingPage/how-it-works";
import HeroSection from "@/components/landingPage/hero-section";
import Features from "@/components/landingPage/features-1";
import Features4 from "@/components/landingPage/features-4";
import FAQsFour from "@/components/landingPage/faqs-4";
import { CallToAction } from "@/components/landingPage/cta";
import FooterSection from "@/components/landingPage/footer";
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
