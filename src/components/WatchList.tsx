"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import genreids from "../utility";
import { useMovieContext } from "../context/MovieContext";
import type { Movie } from "../types/movie";
import Image from "next/image";

function getMovieRating(movie: Movie): number | null {
  const rating = Number(movie.vote_average);
  if (!Number.isFinite(rating) || rating < 0) return null;
  if (rating === 0 && (movie.vote_count ?? 0) === 0) return null;
  return rating;
}

function compareRatings(movieA: Movie, movieB: Movie, direction: 1 | -1): number {
  const ratingA = getMovieRating(movieA);
  const ratingB = getMovieRating(movieB);
  if (ratingA === null) return ratingB === null ? 0 : 1;
  if (ratingB === null) return -1;
  return (ratingA - ratingB) * direction;
}

function Watchlist() {
  const { watchlist, setWatchlist, removeFromWatchlist } = useMovieContext();

  const [search, setSearch] = useState("");
  const [genreList, setGenreList] = useState<string[]>([]);
  const [currGenre, setCurrGenre] = useState("All Genres");

  // ⭐ SORT LOW → HIGH
  const handleAscendingRatings = useCallback(() => {
    const sorted = [...watchlist].sort((movieA, movieB) =>
      compareRatings(movieA, movieB, 1)
    );
    setWatchlist(sorted);
  }, [watchlist, setWatchlist]);

  // ⭐ SORT HIGH → LOW
  const handleDescendingRatings = useCallback(() => {
    const sorted = [...watchlist].sort((movieA, movieB) =>
      compareRatings(movieA, movieB, -1)
    );
    setWatchlist(sorted);
  }, [watchlist, setWatchlist]);

  const handleDelete = (movie: Movie) => removeFromWatchlist(movie);
  const handleGenreClick = (genre: string) => setCurrGenre(genre);

  // Generate Genre Buttons
  useEffect(() => {
    const allGenres = watchlist
      .map((movie) => genreids[movie.genre_ids[0]])
      .filter((genre): genre is string => Boolean(genre));
    const uniqueGenres = new Set<string>(allGenres);
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
    <div className="mt-28 px-4 sm:px-8">
      
      {/* Searchbar */}
      <div className="flex justify-center mt-8 mb-4">
        <input
          placeholder="Search Your Watchlist"
          className="rounded-xl h-[3rem] w-[12rem] bg-gray200 px-4 outline-none border border-slate-600"
          type="text"
          onChange={(event) => setSearch(event.target.value)}
          value={search}
        />
      </div>

      {/* Genres */}
      <div className="flex flex-wrap justify-center gap-2 px-2 sm:px-0 mb-4">
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
                  {movie.poster_path ? (
                    <Image
                      className="h-24 w-16 rounded-lg object-cover shadow-md sm:h-40 sm:w-28"
                      src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      alt={movie.title}
                      width={112}
                      height={160}
                      sizes="(max-width: 640px) 64px, 112px"
                    />
                  ) : (
                    <div role="img" aria-label="Poster unavailable" className="flex h-24 w-16 items-center justify-center rounded-lg bg-gray-200 text-center text-xs sm:h-40 sm:w-28">
                      No poster
                    </div>
                  )}
                  <div className="font-semibold text-gray-800 text-sm sm:text-lg truncate max-w-[120px] sm:max-w-none">
                    {movie.title}
                  </div>
                </td>

                <td className="px-2 sm:px-6 py-2 sm:py-4">
                  {getMovieRating(movie)?.toFixed(1) ?? "Not rated"}
                </td>

                {/* Hide Popularity on mobile */}
                <td className="px-2 sm:px-6 py-2 sm:py-4 hidden sm:table-cell">
                  {movie.popularity.toFixed(1)}
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
