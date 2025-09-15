'use client';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

import Hero from '@/components/Hero';
import Reviews from '@/components/Reviews';
import Pricing from '@/components/Pricing';
import { generatePageMetadata } from '@/components/PageWrapper';

// Note: metadata export doesn't work in client components,
// so we'll handle this in the root layout

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Reviews />
      <Pricing />
    </main>
  );
}