// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import Layout from '@/components/Layout';

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
    <html lang="en">
      <body className="font-sans">
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
