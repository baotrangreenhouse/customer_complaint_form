/**
 * Navigation Bar Component
 * 
 * This component renders the top navigation bar that appears on every page.
 * It's included in the root layout, so it's always visible.
 * 
 * Features:
 * - Fixed positioning at the top of the viewport
 * - Greenhouse olive green background matching brand identity
 * - Greenhouse icon as clickable home link
 * - "Form" link to navigate to the complaint form
 * - Responsive design with proper spacing
 * - Sharp corners matching Greenhouse design language
 * 
 * Navigation structure:
 * - Left: Greenhouse logo (links to home "/")
 * - Right: Form link (links to "/form")
 */
import Link from "next/link";
import { GreenhouseIcon } from "../Icon/icon";

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-[var(--olive-green)] shadow-md px-4 md:px-6 lg:px-8 py-3">
      <div className="flex flex-row items-center justify-between max-w-7xl mx-auto">
        
        {/* Brand/Logo - Links to home page */}
        <Link 
          href="/" 
          className="text--sub--header text-white hover:text-[var(--golden-yellow)] transition-colors duration-200 flex items-center gap-2"
        >
          <GreenhouseIcon />
          <span className="hidden sm:inline">Greenhouse</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link 
            href="/" 
            className="text-white hover:text-[var(--golden-yellow)] transition-colors duration-200 font-semibold text-sm md:text-base"
          >
            Complaints
          </Link>
          <Link 
            href="/form"
            className="bg-[var(--coral-orange)] text-white px-3 md:px-4 py-2 font-semibold hover:bg-[var(--warning-orange)] transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base"
          >
            Submit Form
          </Link>
        </div>
        
      </div>
    </nav>
  )
}

export default NavBar;
