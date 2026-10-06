export interface Movie {
  id: number;
  title: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  vote_average: number;
  vote_count?: number;
  popularity: number;
}

export interface MovieState {
  movies: Movie[];
  error: string | null;
  loading: boolean;
}