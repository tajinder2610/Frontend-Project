const Movie = ({ movie, addToWatchlist, removeFromWatchlist, doesContain }) => {
  return (
    <div className="movie">
      <img
        className="rounded-xl w-full"
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        alt={movie.title}
      />

      {/* Title + Action Row */}
      <div className="flex items-center gap-2 mt-2">
        
        {/* Title (truncated but full title on hover) */}
        <h4
          className="flex-1 truncate font-medium cursor-default"
          title={movie.title}   // adding title will show the full movie name on hover automatically
        >
          {movie.title}
        </h4>

        {/* Action Icon */}
        {!doesContain(movie) ? (
          <div
            className="cursor-pointer text-xl hover:scale-110 transition"
            onClick={() => addToWatchlist(movie)}
          >
            💘
          </div>
        ) : (
          <div
            className="cursor-pointer text-xl hover:scale-110 transition"
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