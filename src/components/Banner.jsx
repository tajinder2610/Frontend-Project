import React, { useEffect, useState } from "react";

function Banner() {
  const [bannerImage, setBannerImage] = useState("");
  const [movieTitle, setMovieTitle] = useState("");

  useEffect(() => {
    const getData = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=3aec63790d50f3b9fc2efb4c15a8cf99&language=en-US&page=1`
      );
      const data = await res.json();
      const { backdrop_path, title } = data.results[0];
      setBannerImage(`https://image.tmdb.org/t/p/original${backdrop_path}`);
      setMovieTitle(title);
    };
    getData();
  }, []);

  return (
    <div
      className="
        pt-0 sm:pt-[6rem]     /* No padding on desktop, add padding only on mobile */
        h-[25vh] sm:h-[40vh] md:h-[75vh] 
        bg-center bg-cover flex items-end"
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      <div className="w-full text-center px-2">
        <div
          className="
            inline-block 
            bg-black/60 text-white 
            text-[0.65rem] sm:text-[0.85rem] md:text-2xl 
            px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 
            rounded
            mb-4
            truncate max-w-full
          "
          title={movieTitle}
        >
          {movieTitle}
        </div>
      </div>
    </div>
  );
}

export default Banner;