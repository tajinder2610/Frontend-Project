import { Link } from "react-router-dom";
import { useState } from "react";
import monkeyLogo from "../assets/monkey_ultra_smooth_fast_clean_v3_fast.gif";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full fixed top-0 z-50 bg-black/70 backdrop-blur-md px-4 sm:px-10 h-16 flex items-center justify-between">
      <Link to="/" className="logo-with-monkey">
        <span className="neon-logo text-2xl sm:text-3xl font-extrabold">
          D
          <span className="play-o">
            <img src={monkeyLogo} alt="" className="play-o-gif" aria-hidden="true" />
          </span>
          PE MOVIEZ
        </span>
        
      </Link>

      {/* Desktop */}
      <ul className="hidden md:flex gap-10 text-white font-semibold text-lg">
        <li>
          <Link to="/" className="hover:text-yellow-400 transition">
            Home
          </Link>
        </li>
        <li>
          <Link to="/watchlist" className="hover:text-yellow-400 transition">
            WatchList
          </Link>
        </li>
      </ul>

      {/* Mobile */}
      <div className="md:hidden">
        <button
          className="text-white text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>
      </div>

      {isOpen && (
        <ul className="absolute top-16 left-0 w-full bg-black/95 flex flex-col text-white text-center py-6 space-y-4 text-lg font-semibold md:hidden">
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/watchlist" onClick={() => setIsOpen(false)}>
              WatchList
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Header;
