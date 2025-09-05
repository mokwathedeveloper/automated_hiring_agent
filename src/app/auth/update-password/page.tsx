'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicUpdatePasswordForm = dynamic(() => import('./UpdatePasswordForm'), {
  ssr: false,
});

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicUpdatePasswordForm />
    </Suspense>
  );
}