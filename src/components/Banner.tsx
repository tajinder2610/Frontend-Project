"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getTrendingMovies } from "../lib/tmdb";

function Banner() {
  const [bannerImage, setBannerImage] = useState("");
  const [movieTitle, setMovieTitle] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const getData = async () => {
      try {
        const movies = await getTrendingMovies(1, controller.signal);
        const movie = movies[0];
        if (!movie?.backdrop_path) return;
        setBannerImage(
          `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        );
        setMovieTitle(movie.title ?? "Trending Movies");
      } catch {
        return;
      }
    };

    void getData();
    return () => controller.abort();
  }, []);

  return (
    <div className="relative mt-24 h-[40vh] sm:h-[56vh] md:h-[74vh] w-full overflow-hidden">
      
      {/* Image: fills width, keeps top visible */}
      {bannerImage && (
        <Image
          src={bannerImage}
          alt={movieTitle}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

      {/* Movie Title */}
      <div className="absolute bottom-6 w-full text-center px-2">
        <div
          className="
            inline-block 
            bg-black/60 text-white 
            text-xs sm:text-lg md:text-2xl
            px-4 py-2 sm:px-8 sm:py-3
            rounded
            truncate max-w-full
          "
        >
          {movieTitle}
        </div>
      </div>
    </div>
  );
}

export default Banner;
