import React, { useEffect, useState } from "react";

function Banner() {
  const [bannerImage, setBannerImage] = useState("");
  const [movieTitle, setMovieTitle] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(
          "https://api.themoviedb.org/3/trending/movie/day?api_key=3aec63790d50f3b9fc2efb4c15a8cf99&language=en-US&page=1"
        );
        const data = await res.json();

        const movie = data.results[0];
        setBannerImage(
          `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        );
        setMovieTitle(movie.title);
      } catch (error) {
        console.error("Error fetching banner:", error);
      }
    };

    getData();
  }, []);

  return (
    <div className="relative mt-24 h-[40vh] sm:h-[56vh] md:h-[74vh] w-full overflow-hidden">
      
      {/* Image: fills width, keeps top visible */}
      <img
        src={bannerImage}
        alt={movieTitle}
        className="w-full h-full object-cover object-top"
      />

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
