// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageWrapper, { generatePageMetadata } from '@/components/PageWrapper';

export const metadata = generatePageMetadata(
  'Privacy Policy',
  'Learn how we protect and handle your personal information and data.',
  ['privacy', 'data protection', 'security', 'GDPR', 'personal information']
);

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
            <p className="text-center text-gray-600 mt-2">Last updated: January 2025</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              upload resumes for analysis, or contact us for support.
            </p>

            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>To provide and improve our AI-powered resume analysis services</li>
              <li>To communicate with you about your account and our services</li>
              <li>To comply with legal obligations and protect our rights</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Nigerian Data Protection</h2>
            <p className="mb-4">
              We comply with the Nigeria Data Protection Regulation (NDPR) and ensure 
              your data is processed lawfully and transparently.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at 
              privacy@hiringagent.ng
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}