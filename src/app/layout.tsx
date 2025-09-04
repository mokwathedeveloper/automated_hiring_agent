import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { authOptions } from '@/lib/nextauth';

import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClientSessionProvider from '@/components/ClientSessionProvider';



export const metadata: Metadata = {
  title: 'HiringAgent',
  description: 'AI-powered hiring platform',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en">
      <head>
        <script src="https://js.paystack.co/v1/inline.js"></script>
      </head>
      <body className="font-sans">
        <ClientSessionProvider session={session}>
          <Navbar />
          {children}
          <Footer />
        </ClientSessionProvider>
      </body>
    </html>
  );
}