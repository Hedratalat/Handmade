import React, { Suspense, lazy } from "react";

// Lazy load components
const Navbar = lazy(() => import("../Navbar/Navbar"));
const Hero = lazy(() => import("../Hero/Hero"));
const HomeProducts = lazy(() => import("../HomeProducts/HomeProducts"));
const ShopWhitUs = lazy(() => import("../WhyShop/WhyShop"));
const HowItWorks = lazy(() => import("../HowItWorks/HowItWorks"));
const Feedback = lazy(() => import("../Feedback/Feedback"));
const Footer = lazy(() => import("../Footer/Footer"));

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      <Suspense fallback={null}>
        <Hero />
      </Suspense>

      <Suspense fallback={null}>
        <HomeProducts />
      </Suspense>

      <Suspense fallback={null}>
        <ShopWhitUs />
      </Suspense>

      <Suspense fallback={null}>
        <HowItWorks />
      </Suspense>

      <Suspense fallback={null}>
        <Feedback />
      </Suspense>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
