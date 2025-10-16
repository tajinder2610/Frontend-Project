import { useState } from "react"

const Movie = ({movie, addToWatchlist, removeFromWatchlist, doesContain}) => {
    
    return (
        <div className="movie">
            <img className="rounded-xl" src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}` } />
            <h4>{movie.title}</h4>
            {
                doesContain(movie) == false ? 
                <div className="action" onClick={() => addToWatchlist(movie)}>💘</div>:
                <div className="action" onClick={() => removeFromWatchlist(movie)}>❌</div>
            }
        </div>
    )
}

export default Movie;