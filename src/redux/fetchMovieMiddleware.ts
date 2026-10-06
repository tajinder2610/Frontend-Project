import type { ThunkAction } from "@reduxjs/toolkit";
import type { UnknownAction } from "redux";
import type { Movie } from "../types/movie";
import type { RootState } from "./store";
import { movieData, movieError, movieLoading } from "./movieSlice";
import { getTrendingMovies } from "../lib/tmdb";

const fetchMiddleware = (page: number): ThunkAction<void, RootState, unknown, UnknownAction> =>
    async (dispatch) => {
        dispatch(movieLoading());
        try {
            dispatch(movieData(await getTrendingMovies(page)));
        } catch (error) {
            dispatch(movieError(error instanceof Error ? error.message : "Unable to load movies."));
        }
    };

export default fetchMiddleware;