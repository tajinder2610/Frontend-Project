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
        mt-24
        h-[30vh] sm:h-[45vh] md:h-[75vh]
        bg-center bg-cover flex items-end
      "
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      <div className="w-full text-center px-2 pb-6">
        <div
          className="
            inline-block 
            bg-black/60 text-white 
            text-sm sm:text-xl md:text-3xl
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
