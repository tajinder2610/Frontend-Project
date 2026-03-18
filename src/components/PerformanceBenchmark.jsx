import { Profiler, useEffect, useMemo, useRef, useState } from "react";

const GENRES = ["Action", "Comedy", "Drama", "Sci-Fi", "Thriller"];

function buildMovies(size) {
  return Array.from({ length: size }, (_, index) => ({
    id: index + 1,
    title: `Movie ${index + 1}`,
    vote_average: Number(((index % 10) + 1).toFixed(1)),
    genre: GENRES[index % GENRES.length],
  }));
}

function RunCard({ title, summary }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 shadow-lg">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {!summary ? (
        <p className="mt-2 text-sm text-slate-300">Waiting to run...</p>
      ) : (
        <div className="mt-3 space-y-2 text-sm text-slate-200">
          <p>Profiler time: {summary.actualDuration.toFixed(2)} ms</p>
          <p>Wall time: {summary.wallTime.toFixed(2)} ms</p>
          <p>Commits: {summary.commits}</p>
          <p>Filter executions: {summary.filterRuns}</p>
          <p>Visible rows: {summary.visibleRows}</p>
        </div>
      )}
    </div>
  );
}

function BenchmarkRunner({
  datasetSize,
  iterations,
  optimized,
  onComplete,
  label,
}) {
  const [tick, setTick] = useState(0);
  const [searchTerm] = useState("Movie 2");
  const [currentGenre] = useState("Action");
  const filterRuns = useRef(0);
  const commits = useRef(0);
  const actualDuration = useRef(0);
  const startedAt = useRef(performance.now());
  const movies = useMemo(() => buildMovies(datasetSize), [datasetSize]);

  const computeFilteredMovies = () => {
    filterRuns.current += 1;

    return movies
      .filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((movie) =>
        currentGenre === "All Genres" ? true : movie.genre === currentGenre
      );
  };

  const filteredMovies = optimized
    ? useMemo(computeFilteredMovies, [movies, searchTerm, currentGenre])
    : computeFilteredMovies();

  useEffect(() => {
    if (tick >= iterations) {
      const completedAt = performance.now();
      onComplete({
        label,
        actualDuration: actualDuration.current,
        wallTime: completedAt - startedAt.current,
        commits: commits.current,
        filterRuns: filterRuns.current,
        visibleRows: filteredMovies.length,
      });
      return;
    }

    const handle = window.setTimeout(() => {
      setTick((currentTick) => currentTick + 1);
    }, 0);

    return () => window.clearTimeout(handle);
  }, [filteredMovies.length, iterations, label, onComplete, tick]);

  return (
    <Profiler
      id={label}
      onRender={(_, __, duration) => {
        commits.current += 1;
        actualDuration.current += duration;
      }}
    >
      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <p className="text-sm text-slate-300">
          Running {label} benchmark... tick {tick}/{iterations}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400 sm:grid-cols-4">
          {filteredMovies.slice(0, 8).map((movie) => (
            <div key={movie.id} className="rounded-md bg-slate-800 px-2 py-3">
              {movie.title}
            </div>
          ))}
        </div>
      </div>
    </Profiler>
  );
}

function PerformanceBenchmark() {
  const [datasetSize, setDatasetSize] = useState(5000);
  const [iterations, setIterations] = useState(150);
  const [activeRun, setActiveRun] = useState(null);
  const [results, setResults] = useState({});

  const baseline = results.baseline;
  const optimized = results.optimized;
  const improvement =
    baseline && optimized
      ? ((baseline.actualDuration - optimized.actualDuration) /
          baseline.actualDuration) *
        100
      : null;

  const handleStart = () => {
    setResults({});
    setActiveRun("baseline");
  };

  const handleComplete = (summary) => {
    setResults((current) => ({
      ...current,
      [summary.label]: summary,
    }));

    if (summary.label === "baseline") {
      setActiveRun("optimized");
      return;
    }

    setActiveRun(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-24 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl">
          <h1 className="text-3xl font-bold">Watchlist Performance Benchmark</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            This route compares the watchlist filter logic without memoization
            against the current memoized approach under repeated unrelated
            re-renders. The strongest measurable signal here is from{" "}
            <code>useMemo</code>; <code>useCallback</code> has limited impact in
            the current component tree.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Dataset Size
              <input
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none"
                type="number"
                min="100"
                step="100"
                value={datasetSize}
                onChange={(event) => setDatasetSize(Number(event.target.value))}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Unrelated Re-renders
              <input
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none"
                type="number"
                min="10"
                step="10"
                value={iterations}
                onChange={(event) => setIterations(Number(event.target.value))}
              />
            </label>

            <div className="flex items-end">
              <button
                className="w-full rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400"
                onClick={handleStart}
                disabled={activeRun !== null}
              >
                {activeRun ? "Benchmark Running..." : "Run Benchmark"}
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <RunCard title="Baseline" summary={baseline} />
            <RunCard title="Optimized" summary={optimized} />
          </div>

          {improvement !== null && Number.isFinite(improvement) && (
            <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-sm text-emerald-200">
                Memoized filtering reduced profiler render time by{" "}
                <span className="font-semibold">
                  {improvement.toFixed(2)}%
                </span>{" "}
                for this synthetic workload.
              </p>
            </div>
          )}

          <div className="mt-6 text-sm leading-6 text-slate-400">
            <p>
              Read this as a directional benchmark, not a universal number. Use
              the production build for the most realistic result.
            </p>
          </div>
        </div>

        <div className="mt-8">
          {activeRun === "baseline" && (
            <BenchmarkRunner
              datasetSize={datasetSize}
              iterations={iterations}
              optimized={false}
              onComplete={handleComplete}
              label="baseline"
            />
          )}

          {activeRun === "optimized" && (
            <BenchmarkRunner
              datasetSize={datasetSize}
              iterations={iterations}
              optimized={true}
              onComplete={handleComplete}
              label="optimized"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PerformanceBenchmark;
