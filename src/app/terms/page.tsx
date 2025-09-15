// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageWrapper, { generatePageMetadata } from '@/components/PageWrapper';

export const metadata = generatePageMetadata(
  'Terms of Service',
  'Read our terms and conditions for using the HiringAgent platform.',
  ['terms', 'conditions', 'legal', 'agreement', 'service terms']
);

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
            <p className="text-center text-gray-600 mt-2">Last updated: January 2025</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using HiringAgent, you accept and agree to be bound by the 
              terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Service Description</h2>
            <p className="mb-4">
              HiringAgent provides AI-powered resume analysis services designed for the 
              Nigerian job market. Our platform helps employers evaluate candidates efficiently.
            </p>

            <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate information when using our services</li>
              <li>Respect intellectual property rights</li>
              <li>Use the service in compliance with applicable laws</li>
              <li>Maintain the confidentiality of your account credentials</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="mb-4">
              HiringAgent shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages resulting from your use of the service.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p className="mb-4">
              These terms shall be governed by and construed in accordance with the laws 
              of the Federal Republic of Nigeria.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p>
              For questions about these Terms of Service, contact us at legal@hiringagent.ng
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}