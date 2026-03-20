import React, { useState, useEffect } from 'react';
import toast from "react-hot-toast";
export const MovieContext = React.createContext();

export default function MovieContextWrapper({children}){
    const [watchlist, setWatchlist] = useState([]);
    const addToWatchlist = (movie) => {
        const updatedWatchList = [...watchlist, movie];
        console.log(updatedWatchList);
        setWatchlist(updatedWatchList);
        localStorage.setItem("watchlist", JSON.stringify(updatedWatchList));
        toast.success(`${movie.title || movie.name || "Project"} Added`, {
            className: "watchlist-toast-shell watchlist-toast-shell--enter",
        });
    }

    const removeFromWatchlist = (movie) => {
        const filteredMovies = watchlist.filter((movieObj) => {
            return movieObj.id != movie.id
        })
        console.log(filteredMovies);
        
        setWatchlist(filteredMovies);
        localStorage.setItem("watchlist", JSON.stringify(filteredMovies));
        toast.error(`${movie.title || movie.name || "Project"} Removed`, {
            className: "watchlist-toast-shell watchlist-toast-shell--enter",
        });
    }

    useEffect(() => {
        let moviesFromLocalStorage = localStorage.getItem("watchlist");
        if(!moviesFromLocalStorage) return 
        // console.log(moviesFromLocalStorage);
        // console.log(typeof moviesFromLocalStorage);
        // console.log(typeof JSON.parse(moviesFromLocalStorage));
        // console.log(JSON.parse(moviesFromLocalStorage));
        setWatchlist(JSON.parse(moviesFromLocalStorage));
        
        
        // setWatchlist(moviesFromLocalStorage)
    }, [])


    return <MovieContext.Provider value={{watchlist, setWatchlist, addToWatchlist, removeFromWatchlist}}>
        {children}
    </MovieContext.Provider>
}
