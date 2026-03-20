import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { movies } = useSelector((store) => store.movieState);

  const marqueeBackdrops = useMemo(() => {
    const backdropItems =
      movies
        ?.filter((movie) => movie.backdrop_path)
        .map((movie) => ({
          id: movie.id,
          title: movie.title || movie.name || "Untitled",
          image: `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`,
        })) ??
      [];

    if (backdropItems.length === 0) return [];
    return [...backdropItems, ...backdropItems];
  }, [movies]);

  return (
    <div className="w-full fixed top-0 z-50 h-24 bg-black/70 backdrop-blur-md">
      {marqueeBackdrops.length > 0 && (
        <div className="header-marquee absolute inset-0">
          <div className="header-marquee__track">
            {marqueeBackdrops.map((movie, index) => (
              <div
                key={`${movie.id}-${index}`}
                className="relative h-full aspect-video shrink-0 overflow-hidden"
              >
                <img
                  src={movie.image}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-3 py-2 text-center">
                  <p className="truncate text-center text-sm font-semibold tracking-wide text-white sm:text-base">
                    {movie.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex h-full items-center justify-between px-4 sm:px-10">
        <Link
          to="/"
          className="neon-logo relative rounded-full bg-black/55 px-3 py-1 text-3xl font-extrabold whitespace-nowrap backdrop-blur-sm sm:-translate-y-3 sm:px-4 sm:py-1.5 sm:text-[8rem]"
        >
          D<span className="play-o">{"\u25B6"}</span>PE MOVIEZ
        </Link>

        <ul className="relative -translate-y-2 hidden text-lg font-semibold text-white md:flex md:gap-2">
          <li>
            <Link
              to="/"
              className="rounded-full bg-black/45 px-5 py-2 backdrop-blur-sm transition hover:text-yellow-400"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/watchlist"
              className="rounded-full bg-black/45 px-5 py-2 backdrop-blur-sm transition hover:text-yellow-400"
            >
              WatchList
            </Link>
          </li>
        </ul>

        <div className="md:hidden">
          <button
            className="relative z-20 rounded-full bg-black/50 px-3 py-1 text-2xl text-white backdrop-blur-sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
          </button>
        </div>
      </div>

      {isOpen && (
        <ul className="mobile-menu-popover absolute right-4 top-18 z-20 flex w-40 flex-col gap-2 text-white text-center text-base font-semibold md:hidden">
          <li className="overflow-hidden rounded-2xl">
            <Link
              to="/"
              className="block rounded-2xl bg-white/8 px-4 py-3 text-lg shadow-sm ring-1 ring-white/8 transition hover:bg-white/12 hover:text-yellow-400"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="overflow-hidden rounded-2xl">
            <Link
              to="/watchlist"
              className="block rounded-2xl bg-white/8 px-4 py-3 shadow-sm ring-1 ring-white/8 transition hover:bg-white/12 hover:text-yellow-400"
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
