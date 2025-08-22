import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProjectVerify - Trusted Project Verification for Diaspora",
  description: "Secure, transparent verification services for diaspora-funded projects in Nigeria. Get visual proof and peace of mind for your investments back home.",
  keywords: "project verification, diaspora, Nigeria, investment verification, construction verification",
  authors: [{ name: "ProjectVerify Team" }],
  openGraph: {
    title: "ProjectVerify - Trusted Project Verification",
    description: "Secure verification services for diaspora-funded projects",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
