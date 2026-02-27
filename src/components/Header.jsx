import { Link } from "react-router-dom"; // use react-router-dom for Vite
import { useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false); // mobile menu toggle

  return (
    <div className="header w-full fixed top-0 z-10 bg-black/60 backdrop-blur-md px-4 sm:px-10 py-4 flex items-center justify-between">
      
      {/* Logo */}
      <Link to="/" className="neon-logo text-2xl sm:text-3xl font-extrabold">
        D<span className="play-o">▶</span>PE MOVIEZ
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex gap-6 text-white font-medium">
        <li>
          <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
        </li>
        <li>
          <Link to="/watchlist" className="hover:text-yellow-400 transition">WatchList</Link>
        </li>
      </ul>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button
          className="text-white text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="absolute top-full left-0 w-full bg-black/90 flex flex-col text-white text-center py-4 space-y-2 md:hidden">
          <li>
            <Link
              to="/"
              className="block py-2 hover:text-yellow-400 transition"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/watchlist"
              className="block py-2 hover:text-yellow-400 transition"
              onClick={() => setIsOpen(false)}
            >
              WatchList
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Header;