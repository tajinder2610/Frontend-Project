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

  // ✅ Sort Low → High
  const handleAscendingRatings = useCallback(() => {
    const sorted = [...watchlist].sort(
      (a, b) => a.vote_average - b.vote_average
    );
    setWatchlist(sorted);
  }, [watchlist, setWatchlist]);

  // ✅ Sort High → Low
  const handleDescendingRatings = useCallback(() => {
    const sorted = [...watchlist].sort(
      (a, b) => b.vote_average - a.vote_average
    );
    setWatchlist(sorted);
  }, [watchlist, setWatchlist]);

  // ✅ Search Handler
  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  // ✅ Genre Click
  const handleGenreClick = useCallback((genre) => {
    setCurrGenre(genre);
  }, []);

  // ✅ Delete Handler
  const handleDelete = useCallback(
    (movie) => {
      removeFromWatchlist(movie);
    },
    [removeFromWatchlist]
  );

  // ✅ Load from localStorage
  useEffect(() => {
    const movies = localStorage.getItem("watchlist");
    if (!movies) return;
    setWatchlist(JSON.parse(movies));
  }, [setWatchlist]);

  // ✅ Generate Genre List
  useEffect(() => {
    const allGenres = watchlist.map(
      (movie) => genreids[movie.genre_ids[0]]
    );
    const uniqueGenres = new Set(allGenres);
    setGenreList(["All Genres", ...uniqueGenres]);
  }, [watchlist]);

  // ✅ Memoized Filtering (Expensive Calculation)
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
      <div className="flex justify-center gap-2">
        {genreList.map((genre) => (
          <div
            key={genre}
            className={
              currGenre === genre
                ? "flex justify-center items-center h-[3rem] w-[9rem] bg-blue-400 rounded-xl text-white cursor-pointer"
                : "flex justify-center items-center h-[3rem] w-[9rem] bg-gray-400/50 rounded-xl text-white cursor-pointer"
            }
            onClick={() => handleGenreClick(genre)}
          >
            {genre}
          </div>
        ))}
      </div>

      {/* Watchlist Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
        <table className="w-full bg-white text-left text-sm text-gray-500">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 font-medium text-gray-900">Name</th>
              <th>
                <div className="flex align-centre gap-2">
                  <i
                    className="fa-solid fa-arrow-up cursor-pointer"
                    onClick={handleAscendingRatings}
                  ></i>
                  <div>Ratings</div>
                  <i
                    className="fa-solid fa-arrow-down cursor-pointer"
                    onClick={handleDescendingRatings}
                  ></i>
                </div>
              </th>
              <th>Popularity</th>
              <th>Genre</th>
              <th>Delete Movies</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {filteredMovies.map((movie) => (
              <tr key={movie.id} className="hover:bg-gray-50">
                <td className="flex items-center px-6 py-4 font-normal text-gray-900 gap-3">
                  <img
                    className="h-[10rem] w-[6rem] object-cover"
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt=""
                  />
                  <div className="font-medium text-gray-700 text-xl">
                    {movie.title}
                  </div>
                </td>

                <td className="pl-6 py-4">
                  {parseFloat(movie.vote_average).toFixed(1)}
                </td>

                <td className="pl-6 py-4">
                  {parseFloat(movie.popularity).toFixed(1)}
                </td>

                <td className="pl-2 py-4">
                  {genreids[movie.genre_ids[0]]}
                </td>

                <td>
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