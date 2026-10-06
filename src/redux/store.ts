import { configureStore } from "@reduxjs/toolkit";
import paginationSlice from "./paginationSlice";
import movieSlice from "./movieSlice";

export const makeStore = () => configureStore({
    reducer: {
        paginationState: paginationSlice.reducer,
        movieState: movieSlice.reducer
    }
});

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];