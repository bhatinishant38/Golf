import React from "react";
import Navbar from "../../components/ForAll/Navbar";
import Hero from "../../components/ForAll/Hero";
import HowItWorks from "../../components/ForAll/HowItWorks";
import Impact from "../../components/ForAll/Impact";
import Pricing from "../../components/ForAll/Pricing";
import CharityFields from "../../components/ForAll/ChooseFields";

const LandingPage = () => {
  return (
    <div>
      <div>
        <Navbar />
        <Hero />
        <HowItWorks />
        <CharityFields />
        <Pricing />
        <Impact />
      </div>
    </div>
  );
};

export default LandingPage;
