import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Movie, MovieState } from "../types/movie";

const initialState: MovieState = {
    movies: [],
    error: null,
    loading: false
};

const movieSlice = createSlice({
    name: "movieSlice",
    initialState,
    reducers: {
        movieLoading: (state) => {
            state.error = null;
            state.loading = true;
        },
        movieError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
        movieData: (state, action: PayloadAction<Movie[]>) => {
            state.error = null;
            state.loading = false;
            state.movies = action.payload;
        }
    }
});

export const { movieLoading, movieError, movieData } = movieSlice.actions;
export default movieSlice;