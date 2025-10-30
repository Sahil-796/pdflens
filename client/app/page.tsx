import React from "react";
import Navbar from '@/components/bars/LandingNavbar'
import { redirect } from "next/navigation";
const LandingPage = () => {
  redirect('/tools')
  return (
    <div className="bg-background">

      <Navbar />

    </div>
  );
};

export default LandingPage;
