'use client';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';
import { Suspense } from 'react';

const DynamicUpdatePasswordForm = dynamicImport(() => import('./UpdatePasswordForm'), {
  ssr: false,
});

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicUpdatePasswordForm />
    </Suspense>
  );
}