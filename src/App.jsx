import "./App.css";
import { Routes, Route } from "react-router";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Home from "./components/Home";
import MovieContextWrapper from "./context/MovieContext";
import Spinner from "./components/Spinner";

const Watchlist = lazy(() => import("./components/WatchList"));
const PerformanceBenchmark = lazy(() =>
  import("./components/PerformanceBenchmark")
);

function App() {
  return (
    <MovieContextWrapper>
      <Header />
      <Toaster
        position="top-right"
        containerStyle={{
          top: "6.6rem",
          right: "2.5rem",
        }}
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

      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/benchmark" element={<PerformanceBenchmark />} />
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-screen">
                <h2 className="text-3xl font-bold">404 Page Not Found</h2>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </MovieContextWrapper>
  );
}

export default App;
