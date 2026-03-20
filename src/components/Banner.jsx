import React, { useEffect, useMemo, useState } from "react";

function Banner() {
  const [bannerBackdrops, setBannerBackdrops] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=3aec63790d50f3b9fc2efb4c15a8cf99&language=en-US&page=1`
      );
      const data = await res.json();
      const backdrops =
        data.results
          ?.filter((movie) => movie.backdrop_path)
          .map((movie) => ({
            id: movie.id,
            title: movie.title || movie.name || "Untitled",
            image: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
          })) ?? [];

      setBannerBackdrops(backdrops);
    };
    getData();
  }, []);

  useEffect(() => {
    if (bannerBackdrops.length <= 1) return undefined;

    const slideTimer = window.setTimeout(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % bannerBackdrops.length);
    }, 5000);

    return () => {
      window.clearTimeout(slideTimer);
    };
  }, [activeIndex, bannerBackdrops]);

  const activeBanner = useMemo(() => {
    if (bannerBackdrops.length === 0) return null;
    return bannerBackdrops[activeIndex];
  }, [activeIndex, bannerBackdrops]);

  return (
    <div className="banner-marquee mt-24 h-[40vh] sm:h-[56vh] md:h-[74vh]">
      {activeBanner && (
        <div className="banner-slide-single">
          <img
            src={activeBanner.image}
            alt={activeBanner.title}
            className="banner-slide-image"
          />
          <div className="absolute inset-x-0 bottom-0 w-full text-center px-2 pb-6">
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
              {activeBanner.title}
            </div>
          </div>
        </div>
      )}

      <div className="banner-marquee__overlay" />
    </div>
  );
}

export default Banner;
