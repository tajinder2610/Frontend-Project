"use client";

import Movie from "./Movie";
import Pagination from "./Pagination";
import { useMovieContext } from "../context/MovieContext";
import { useAppSelector } from "../redux/hooks";

const MovieList = () => {
    const { movies, error, loading } = useAppSelector((store) => store.movieState);
    const { watchlist, addToWatchlist, removeFromWatchlist } = useMovieContext();

    const doesContain = (movie: (typeof watchlist)[number]) =>
        watchlist.some((item) => item.id === movie.id);

    return (
        <div className="movie-list-page">
            <h1 className="mb-2 text-center text-sm font-bold sm:text-3xl">Trending Movies</h1>

            {loading && <p className="py-6 text-center" role="status">Loading movies...</p>}
            {error && <p className="py-6 text-center text-red-400" role="alert">{error}</p>}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8 p-4">
                {movies.map(movie => (
                    <Movie key={movie.id} movie={movie} addToWatchlist={addToWatchlist} removeFromWatchlist={removeFromWatchlist} doesContain={doesContain}/>
                ))}
            </div>

            <Pagination />
        </div>
    )
}

export default MovieList;
