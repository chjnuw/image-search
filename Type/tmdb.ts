export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: null | {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  };
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: { iso_3166_1: string; name: string }[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: { iso_639_1: string; name: string }[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  [key: string]: any; // เพื่อรองรับฟิลด์ที่อาจเพิ่มในอนาคต
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface WatchProviderCountry {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface WatchProviderResponse {
  results: Record<string, WatchProviderCountry>;
}

export interface Cast {
  id: number;
  name: string;
  original_name: string;
  profile_path: string | null;
  character: string;
  order: number;
}
export interface Crew {
  id: number;
  name: string;
  original_name: string;
  profile_path: string | null;
  job: string;
  department: string;
}
export interface CreditsResponse {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface MovieImage {
  aspect_ratio: number;
  height: number;
  width: number;
  file_path: string;
  vote_average: number;
  vote_count: number;
}
export interface MovieImagesResponse {
  backdrops: MovieImage[];
  posters: MovieImage[];
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: "YouTube" | string;
  type: "Trailer" | "Teaser" | string;
  official: boolean;
}

export interface MovieVideoResponse {
  id: number;
  results: MovieVideo[];
}

export interface ReleaseDateItem {
  certification: string;
  type: number;
}

export interface ReleaseDateResult {
  iso_3166_1: string;
  release_dates: ReleaseDateItem[];
}

export interface MovieReleaseDatesResponse {
  id: number;
  results: ReleaseDateResult[];
}

export interface MovieCollectionResponse {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: Movie[];
}

export interface PersonMovieCredits {
  cast: Movie[]
  crew: Movie[]
}

export interface PersonDetail {
  birthday: string | null;
  known_for_department: string;
  deathday: string | null;
  id: number;
  name: string;
  also_known_as: string[];
  gender: number;
}