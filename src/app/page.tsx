'use client';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

import { useRef } from 'react';
import Hero from '@/components/Hero';
import WatchDemo from '@/components/WatchDemo';
import Reviews from '@/components/Reviews';
import Pricing from '@/components/Pricing';
import { generatePageMetadata } from '@/components/PageWrapper';

// Note: metadata export doesn't work in client components,
// so we'll handle this in the root layout

export default function HomePage() {
  const watchDemoRef = useRef<HTMLDivElement>(null);

  const scrollToWatchDemo = () => {
    if (watchDemoRef.current) {
      watchDemoRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // YouTube demo video URL
  const youtubeUrl = 'https://www.youtube.com/watch?v=4eAUj_ZjvLw';

  return (
    <main>
      <Hero onWatchDemo={scrollToWatchDemo} />
      <div ref={watchDemoRef}>
        <WatchDemo youtubeUrl={youtubeUrl} />
      </div>
      <Reviews />
      <Pricing />
    </main>
  );
}