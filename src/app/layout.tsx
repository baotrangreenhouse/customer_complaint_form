/**
 * Root Layout Component
 * 
 * This is the main layout for the entire Next.js application using the App Router.
 * Every page in the app will be wrapped with this layout.
 * 
 * Key responsibilities:
 * - Sets up HTML structure (<html>, <body>)
 * - Defines metadata (title, description, favicon)
 * - Loads Google Fonts (Geist Sans and Geist Mono)
 * - Includes global CSS styles
 * - Renders the navigation bar on every page
 * - Provides the {children} slot where page content renders
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopHeader from "@/components/Nav/navbar";

// Google Fonts configuration
// Geist Sans - primary font for body text
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Geist Mono - monospace font for code/technical content
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Application metadata - appears in browser tab and search engines
export const metadata: Metadata = {
  title: "Greenhouse Customer Complaints",
  description: "Submit and track customer complaints for greenhouse products",
  icons: {
    icon: '/greenhouse-icon.svg', // Custom favicon using the greenhouse SVG
  },
};

// Root layout component that wraps all pages
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
        {/* Navigation bar appears on every page */}
        <TopHeader />
        
        {/* Page-specific content renders here */}
        {children}
      </body>
    </html>
  );
}
