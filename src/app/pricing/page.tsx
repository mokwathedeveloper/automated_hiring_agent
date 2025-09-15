// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

import Pricing from '@/components/Pricing';
import { generatePageMetadata } from '@/components/PageWrapper';

export const metadata = generatePageMetadata(
  'Pricing Plans',
  'Choose the perfect plan for your hiring needs. Flexible pricing for businesses of all sizes.',
  ['pricing', 'plans', 'subscription', 'cost', 'packages']
);

export default function PricingPage() {
  return <Pricing />;
}