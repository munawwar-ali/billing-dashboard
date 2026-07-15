import { useEffect } from "react";
import "../../styles/landing.css";

import Navbar from "../../components/landing/Navbar";
import Hero from "../../components/landing/Hero";
import TrustMarquee from "../../components/landing/TrustMarquee";
import Metrics from "../../components/landing/Metrics";
import FeatureShowcase from "../../components/landing/FeatureShowcase";
import WorkflowBanner from "../../components/landing/WorkflowBanner";
import FeatureGrid from "../../components/landing/FeatureGrid";
import Pricing from "../../components/landing/Pricing";
import Testimonials from "../../components/landing/Testimonials";
import FinalCTA from "../../components/landing/FinalCTA";
import Footer from "../../components/landing/Footer";

export default function LandingPage() {
  // Enables smooth scrolling for the in-page nav anchors (#features, #pricing, etc.)
  useEffect(() => {
    document.documentElement.classList.add("scroll-smooth");
    return () => document.documentElement.classList.remove("scroll-smooth");
  }, []);

  return (
    <div className="landing">
      <Navbar />
      <main>
        <Hero />
        <TrustMarquee />
        <Metrics />
        <FeatureShowcase />
        <WorkflowBanner />
        <FeatureGrid />
        <Pricing />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
