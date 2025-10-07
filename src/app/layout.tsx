/**
 * Root Layout Component
 * 
 * This is the main layout for the entire Next.js application using the App Router.
 * Every page in the app will be wrapped with this layout.
 * 
 * Key responsibilities:
 * - Sets up HTML structure (<html>, <body>)
 * - Defines metadata (title, description, favicon)
 * - Loads Chau Philomene One font (Greenhouse brand font)
 * - Includes global CSS styles with Greenhouse design system
 * - Renders the navigation bar on every page
 * - Provides the {children} slot where page content renders
 */
import type { Metadata } from "next";
import "./globals.css";
import TopHeader from "@/components/Nav/navbar";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {/* Navigation bar appears on every page */}
        <TopHeader />
        
        {/* Page-specific content renders here */}
        {children}
      </body>
    </html>
  );
}
