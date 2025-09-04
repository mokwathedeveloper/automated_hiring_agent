// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import Layout from '@/components/Layout';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "Automated Hiring Agent",
  description: "AI-powered resume analysis platform for the Nigerian job market",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
