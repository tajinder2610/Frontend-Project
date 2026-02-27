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

  // Sort Low → High
  const handleAscendingRatings = useCallback(() => {
    const sorted = [...watchlist].sort(
      (a, b) => a.vote_average - b.vote_average
    );
    setWatchlist(sorted);
  }, [watchlist, setWatchlist]);

  // Sort High → Low
  const handleDescendingRatings = useCallback(() => {
    const sorted = [...watchlist].sort(
      (a, b) => b.vote_average - a.vote_average
    );
    setWatchlist(sorted);
  }, [watchlist, setWatchlist]);

  // Search Handler
  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  // Genre Click
  const handleGenreClick = useCallback((genre) => {
    setCurrGenre(genre);
  }, []);

  // Delete Handler
  const handleDelete = useCallback(
    (movie) => {
      removeFromWatchlist(movie);
    },
    [removeFromWatchlist]
  );

  // Load from localStorage
  useEffect(() => {
    const movies = localStorage.getItem("watchlist");
    if (!movies) return;
    setWatchlist(JSON.parse(movies));
  }, [setWatchlist]);

  // Generate Genre List
  useEffect(() => {
    const allGenres = watchlist.map((movie) => genreids[movie.genre_ids[0]]);
    const uniqueGenres = new Set(allGenres);
    setGenreList(["All Genres", ...uniqueGenres]);
  }, [watchlist]);

  // Memoized Filtering
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
    <div className="pt-20">
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

      {/* Watchlist Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] sm:min-w-full bg-white text-left text-sm text-gray-500">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 sm:px-6 py-3 font-medium text-gray-900">Name</th>
              <th className="px-2 sm:px-6 py-3">
                <div className="flex items-center gap-2 text-sm sm:text-base">
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
              <th className="px-2 sm:px-6 py-3">Popularity</th>
              <th className="px-2 sm:px-6 py-3">Genre</th>
              <th className="px-2 sm:px-6 py-3">Delete Movies</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {filteredMovies.map((movie) => (
              <tr key={movie.id} className="hover:bg-gray-50">
                <td className="flex items-center px-2 sm:px-6 py-3 font-normal text-gray-900 gap-2 sm:gap-3">
                  <img
                    className="h-[8rem] sm:h-[10rem] w-[5rem] sm:w-[6rem] object-cover rounded-xl"
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <div
                    className="font-medium text-gray-700 text-sm sm:text-xl truncate max-w-[100px] sm:max-w-full"
                    title={movie.title}
                  >
                    {movie.title}
                  </div>
                </td>

                <td className="px-2 sm:px-6 py-3">{parseFloat(movie.vote_average).toFixed(1)}</td>
                <td className="px-2 sm:px-6 py-3">{parseFloat(movie.popularity).toFixed(1)}</td>
                <td className="px-2 sm:px-6 py-3">{genreids[movie.genre_ids[0]]}</td>
                <td className="px-2 sm:px-6 py-3">
                  <button
                    onClick={() => handleDelete(movie)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
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