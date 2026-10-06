"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import Header from "../components/Header";
import MovieContextWrapper from "../context/MovieContext";
import { makeStore } from "../redux/store";

export default function Providers({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);

  return (
    <Provider store={store}>
      <MovieContextWrapper>
        <Header />
        <Toaster
          position="top-right"
          containerStyle={{ top: "6.6rem", right: "2.5rem" }}
          toastOptions={{
            duration: 2500,
            style: {
              background: "rgba(12, 12, 12, 0.92)",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(10px)",
            },
          }}
        />
        {children}
      </MovieContextWrapper>
    </Provider>
  );
}