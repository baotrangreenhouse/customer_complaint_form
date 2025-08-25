import Link from "next/link";
import { GreenhouseIcon } from "../Icon/icon";


const NavBar = () => {
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-[white] backdrop-blur-sm border-b-2 border-[#ddd] px-5 py-3">
      <div className="flex flex-row items-center justify-between">
        <Link href="/" className="text--main--header text-[var(--black-color)] hover:underline">
          <GreenhouseIcon />
        </Link>
        <Link href="/form">Form</Link>
      </div>
    </nav>
  )
}

export default NavBar;
