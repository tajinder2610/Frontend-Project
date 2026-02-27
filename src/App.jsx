import "./App.css";
import { Routes, Route } from "react-router";
import { Suspense, lazy } from "react";
import Header from "./components/Header";
import Home from "./components/Home";
import MovieContextWrapper from "./context/MovieContext";
import Spinner from "./components/Spinner";

const Watchlist = lazy(() => import("./components/WatchList"));

function App() {
  return (
    <MovieContextWrapper>
      <Header />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </Suspense>
    </MovieContextWrapper>
  );
}

export default App;