import type { Metadata } from 'next';

import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QueryProvider from '@/components/QueryProvider';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import PerformanceMonitor from '@/components/PerformanceMonitor';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'HiringAgent - AI-Powered Hiring Platform',
  description: 'Transform your recruitment process with intelligent resume analysis designed specifically for the Nigerian job market. Streamline hiring with AI-powered candidate evaluation.',
  keywords: 'hiring, recruitment, AI, resume analysis, Nigerian jobs, HR technology, candidate evaluation, job matching',
  authors: [{ name: 'HiringAgent Team' }],
  openGraph: {
    title: 'HiringAgent - AI-Powered Hiring Platform',
    description: 'Transform your recruitment process with intelligent resume analysis designed specifically for the Nigerian job market.',
    type: 'website',
    locale: 'en_NG',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HiringAgent - AI-Powered Hiring Platform',
    description: 'Transform your recruitment process with intelligent resume analysis designed specifically for the Nigerian job market.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Optimized font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script async src="https://js.paystack.co/v1/inline.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Paystack script load verification
              window.addEventListener('load', function() {
                if (window.PaystackPop) {
                  console.log('Paystack script loaded successfully');
                } else {
                  console.error('Paystack script failed to load');
                }
              });

              // Global error handler for third-party script warnings
              window.addEventListener('error', function(event) {
                // Suppress Datadog SDK storage warnings
                if (event.message && event.message.includes('Datadog Browser SDK')) {
                  console.warn('Datadog SDK warning suppressed:', event.message);
                  event.preventDefault();
                  return false;
                }

                // Suppress other non-critical third-party warnings
                if (event.message && (
                  event.message.includes('No storage available') ||
                  event.message.includes('Script error')
                )) {
                  console.warn('Third-party script warning suppressed:', event.message);
                  event.preventDefault();
                  return false;
                }
              });

              // Console override for Datadog warnings
              const originalWarn = console.warn;
              console.warn = function(...args) {
                const message = args.join(' ');
                if (message.includes('Datadog Browser SDK') ||
                    message.includes('No storage available for session')) {
                  // Silently ignore Datadog warnings
                  return;
                }
                originalWarn.apply(console, args);
              };
            `,
          }}
        />
      </head>
      <body className="font-sans">
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <PerformanceMonitor />
              <Navbar />
              {children}
              <Footer />
              <Toaster />
            </QueryProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}