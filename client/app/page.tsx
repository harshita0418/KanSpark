'use client';

import { CTA, Features, Footer, Hero, HowItWorks, Navbar, Pricing } from '../components/Landing';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}