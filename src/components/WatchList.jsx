import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import genreids from "../utility";
import { MovieContext } from "../context/MovieContext";

function Watchlist() {
  const { watchlist, setWatchlist, removeFromWatchlist } =
    useContext(MovieContext);

  const [search, setSearch] = useState("");
  const [genreList, setGenreList] = useState([]);
  const [currGenre, setCurrGenre] = useState("All Genres");

  // ⭐ SORT LOW → HIGH
  const handleAscendingRatings = useCallback(() => {
    const sorted = [...watchlist].sort(
      (a, b) => a.vote_average - b.vote_average
    );
    setWatchlist(sorted);
  }, [watchlist, setWatchlist]);

  // ⭐ SORT HIGH → LOW
  const handleDescendingRatings = useCallback(() => {
    const sorted = [...watchlist].sort(
      (a, b) => b.vote_average - a.vote_average
    );
    setWatchlist(sorted);
  }, [watchlist, setWatchlist]);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleDelete = (movie) => removeFromWatchlist(movie);
  const handleGenreClick = (genre) => setCurrGenre(genre);

  // Load from localStorage
  useEffect(() => {
    const movies = localStorage.getItem("watchlist");
    if (!movies) return;
    setWatchlist(JSON.parse(movies));
  }, [setWatchlist]);

  // Generate Genre Buttons
  useEffect(() => {
    const allGenres = watchlist.map(
      (movie) => genreids[movie.genre_ids[0]]
    );
    const uniqueGenres = new Set(allGenres);
    setGenreList(["All Genres", ...uniqueGenres]);
  }, [watchlist]);

  const filteredMovies = useMemo(() => {
    return watchlist
      .filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((movie) =>
        currGenre === "All Genres"
          ? true
          : genreids[movie.genre_ids[0]] === currGenre
      );
  }, [watchlist, search, currGenre]);

  return (
    <div className="mt-20 px-4 sm:px-8">
      
      {/* Searchbar */}
      <div className="flex justify-center my-10">
        <input
          placeholder="Search Your Watchlist"
          className="rounded-xl h-[3rem] w-[12rem] bg-gray200 px-4 outline-none border border-slate-600"
          type="text"
          onChange={handleSearch}
          value={search}
        />
      </div>

      {/* Genres */}
      <div className="flex flex-wrap justify-center gap-2 px-2 sm:px-0 my-4">
        {genreList.map((genre) => (
          <div
            key={genre}
            className={`
              flex justify-center items-center
              h-[2.5rem] sm:h-[3rem]
              w-[8rem] sm:w-[9rem]
              rounded-xl
              text-white cursor-pointer
              ${currGenre === genre ? "bg-blue-400" : "bg-gray-400/50"}
              text-[0.65rem] sm:text-sm
            `}
            onClick={() => handleGenreClick(genre)}
          >
            {genre}
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="flex justify-center overflow-x-auto">
        <table className="table-auto w-full max-w-6xl bg-white text-left text-sm sm:text-base text-gray-600 shadow-lg rounded-lg overflow-hidden">
          
          <thead>
            <tr className="bg-gray-100">
              
              <th className="px-2 sm:px-6 py-2 sm:py-4 font-semibold text-gray-900">
                Name
              </th>

              <th className="px-2 sm:px-6 py-2 sm:py-4">
                <div className="flex items-center gap-2">
                  <i
                    className="fa-solid fa-arrow-up cursor-pointer"
                    onClick={handleAscendingRatings}
                  ></i>
                  Ratings
                  <i
                    className="fa-solid fa-arrow-down cursor-pointer"
                    onClick={handleDescendingRatings}
                  ></i>
                </div>
              </th>

              {/* Hide Popularity on mobile */}
              <th className="px-2 sm:px-6 py-2 sm:py-4 hidden sm:table-cell">
                Popularity
              </th>

              <th className="px-2 sm:px-6 py-2 sm:py-4 hidden sm:table-cell">
                Genre
              </th>

              <th className="px-2 sm:px-6 py-2 sm:py-4 text-center">
                Delete
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredMovies.map((movie) => (
              <tr key={movie.id} className="hover:bg-gray-50">

                {/* Name Column */}
                <td className="flex items-center px-2 sm:px-6 py-2 sm:py-4 gap-3 sm:gap-5 min-w-[180px]">
                  <img
                    className="h-24 w-16 sm:h-40 sm:w-28 object-cover rounded-lg shadow-md"
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <div className="font-semibold text-gray-800 text-sm sm:text-lg truncate max-w-[120px] sm:max-w-none">
                    {movie.title}
                  </div>
                </td>

                <td className="px-2 sm:px-6 py-2 sm:py-4">
                  {parseFloat(movie.vote_average).toFixed(1)}
                </td>

                {/* Hide Popularity on mobile */}
                <td className="px-2 sm:px-6 py-2 sm:py-4 hidden sm:table-cell">
                  {parseFloat(movie.popularity).toFixed(1)}
                </td>

                <td className="px-2 sm:px-6 py-2 sm:py-4 hidden sm:table-cell">
                  {genreids[movie.genre_ids[0]]}
                </td>

                <td className="px-2 sm:px-6 py-2 sm:py-4 text-center">
                  <i
                    className="fa-solid fa-trash text-red-500 cursor-pointer hover:scale-125 transition"
                    onClick={() => handleDelete(movie)}
                  ></i>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default Watchlist;