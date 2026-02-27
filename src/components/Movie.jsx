const Movie = ({ movie, addToWatchlist, removeFromWatchlist, doesContain }) => {
  return (
    <div className="flex flex-col w-full items-center">

      {/* Poster Container - Rounded + Shrunk */}
      <div className="w-[85%] overflow-hidden rounded-xl">
        <img
          className="w-full h-auto object-contain hover:scale-105 transition duration-300"
          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
          alt={movie.title}
        />
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
          <div
            className="cursor-pointer text-lg hover:scale-150 transition"
            onClick={() => addToWatchlist(movie)}
          >
            💘
          </div>
        ) : (
          <div
            className="cursor-pointer text-lg hover:scale-150 transition"
            onClick={() => removeFromWatchlist(movie)}
          >
            ❌
          </div>
        )}
      </div>
    </div>
  );
};

export default Movie;