import type { Movie } from "../types/movie";

interface TrendingMoviesResponse {
  results?: Movie[];
  status_message?: string;
}

export async function getTrendingMovies(
  page: number,
  signal?: AbortSignal,
): Promise<Movie[]> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) throw new Error("NEXT_PUBLIC_TMDB_API_KEY is not configured.");

  const url = new URL("https://api.themoviedb.org/3/trending/movie/day");
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", "en-US");
  url.searchParams.set("page", String(page));

  const response = await fetch(url, { signal });
  const payload: TrendingMoviesResponse = await response.json();
  if (!response.ok) {
    throw new Error(payload.status_message ?? "TMDB could not return movies.");
  }

  return payload.results ?? [];
}