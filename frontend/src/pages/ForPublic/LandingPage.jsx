import React from "react";
import Navbar from "../../components/ForAll/Navbar";
import Hero from "../../components/ForAll/Hero";
import HowItWorks from "../../components/ForAll/HowItWorks";
import Impact from "../../components/ForAll/Impact";
import Pricing from "../ForUser/Pricing";
import ChooseCharity from "../../components/ForAll/ChooseCharity";

const LandingPage = () => {
  return (
    <div>
      <div>
        <Navbar />
        <Hero />
        <HowItWorks />
        <ChooseCharity />
        <Pricing />
        <Impact />
      </div>
    </div>
  );
};

export default LandingPage;
