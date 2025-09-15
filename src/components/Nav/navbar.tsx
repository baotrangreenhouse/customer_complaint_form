/**
 * Navigation Bar Component
 * 
 * This component renders the top navigation bar that appears on every page.
 * It's included in the root layout, so it's always visible.
 * 
 * Features:
 * - Fixed positioning at the top of the viewport
 * - Greenhouse icon as clickable home link
 * - "Form" link to navigate to the complaint form
 * - Responsive design with proper spacing
 * - Glass-morphism effect with backdrop blur and border
 * 
 * Navigation structure:
 * - Left: Greenhouse logo (links to home "/")
 * - Right: Form link (links to "/form")
 */
import Link from "next/link";
import { GreenhouseIcon } from "../Icon/icon";

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-[white] backdrop-blur-sm border-b-2 border-[#ddd] px-5 py-3">
      <div className="flex flex-row items-center justify-between">
        
        {/* Brand/Logo - Links to home page */}
        <Link 
          href="/" 
          className="text--main--header text-[var(--black-color)] hover:underline"
        >
          <GreenhouseIcon />
        </Link>
        
        {/* Navigation Links */}
        <Link href="/form">Form</Link>
        
      </div>
    </nav>
  )
}

export default NavBar;
