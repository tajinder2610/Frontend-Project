"use client";

import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import toast from "react-hot-toast";
import type { Movie } from "../types/movie";

interface MovieContextValue {
    watchlist: Movie[];
    setWatchlist: Dispatch<SetStateAction<Movie[]>>;
    addToWatchlist: (movie: Movie) => void;
    removeFromWatchlist: (movie: Movie) => void;
}

export const MovieContext = createContext<MovieContextValue | null>(null);

export function useMovieContext(): MovieContextValue {
    const context = useContext(MovieContext);
    if (!context) throw new Error("useMovieContext must be used within MovieContextWrapper");
    return context;
}

export default function MovieContextWrapper({ children }: { children: ReactNode }) {
    const [watchlist, setWatchlist] = useState<Movie[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const storedMovies = localStorage.getItem("watchlist");
            if (storedMovies) setWatchlist(JSON.parse(storedMovies) as Movie[]);
        } catch {
            localStorage.removeItem("watchlist");
        } finally {
            setHydrated(true);
        }
    }, []);

    useEffect(() => {
        if (hydrated) localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }, [hydrated, watchlist]);

    const addToWatchlist = (movie: Movie) => {
        setWatchlist((current) => current.some((item) => item.id === movie.id) ? current : [...current, movie]);
        toast.success(`${movie.title || movie.name || "Movie"} Added`, {
            className: "watchlist-toast-shell watchlist-toast-shell--enter",
        });
    };

    const removeFromWatchlist = (movie: Movie) => {
        setWatchlist((current) => current.filter((item) => item.id !== movie.id));
        toast.error(`${movie.title || movie.name || "Movie"} Removed`, {
            className: "watchlist-toast-shell watchlist-toast-shell--enter",
        });
    };

    return (
        <MovieContext.Provider value={{ watchlist, setWatchlist, addToWatchlist, removeFromWatchlist }}>
            {children}
        </MovieContext.Provider>
    );
}
