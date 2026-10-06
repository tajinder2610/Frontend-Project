"use client";

import type { Movie as MovieData } from "../types/movie";
import Image from "next/image";

interface MovieProps {
  movie: MovieData;
  addToWatchlist: (movie: MovieData) => void;
  removeFromWatchlist: (movie: MovieData) => void;
  doesContain: (movie: MovieData) => boolean;
}

const Movie = ({ movie, addToWatchlist, removeFromWatchlist, doesContain }: MovieProps) => {
  return (
    <div className="flex flex-col w-full items-center">

      {/* Poster Container - Rounded + Shrunk */}
      <div className="relative aspect-[2/3] w-[85%] overflow-hidden rounded-xl">
        {movie.poster_path ? (
          <Image
            className="object-contain transition duration-300 hover:scale-105"
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 42vw, (max-width: 1024px) 24vw, 17vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-neutral-800 text-sm text-neutral-300">
            Poster unavailable
          </div>
        )}
      </div>

      {/* Title + Action Row */}
      <div className="flex items-center gap-2 mt-2 w-[90%]">
        <h4
          className="flex-1 truncate font-semibold text-lg"
          title={movie.title}
        >
          {movie.title}
        </h4>

        {!doesContain(movie) ? (
          <button
            type="button"
            aria-label={`Add ${movie.title} to watchlist`}
            className="cursor-pointer text-lg hover:scale-150 transition"
            onClick={() => addToWatchlist(movie)}
          >
            💘
          </button>
        ) : (
          <button
            type="button"
            aria-label={`Remove ${movie.title} from watchlist`}
            className="cursor-pointer text-lg hover:scale-150 transition"
            onClick={() => removeFromWatchlist(movie)}
          >
            ❌
          </button>
        )}
      </div>
    </div>
  );
};

export default Movie;