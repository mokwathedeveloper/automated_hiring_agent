'use client';

import Hero from '@/components/Hero';
import Reviews from '@/components/Reviews';
import Pricing from '@/components/Pricing';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Reviews />
      <Pricing />
    </main>
  );
}