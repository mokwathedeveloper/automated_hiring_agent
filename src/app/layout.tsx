import type { Metadata } from 'next';

import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QueryProvider from '@/components/QueryProvider';

export const metadata: Metadata = {
  title: 'HiringAgent',
  description: 'AI-powered hiring platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://js.paystack.co/v1/inline.js"></script>
      </head>
      <body className="font-sans">
        <QueryProvider>
          <Navbar />
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}