import type {
  TMDBResponse,
  Movie,
  Genre,
  WatchProviderResponse,
  CreditsResponse,
  MovieImagesResponse,
  MovieVideoResponse,
} from "../Type/tmdb";

const BASE_URL = "https://api.themoviedb.org/3";

export const useTMDB = () => {
  const config = useRuntimeConfig();

  const request = async <T>(endpoint: string): Promise<T | null> => {
    try {
      return await $fetch<T>(`${BASE_URL}${endpoint}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.public.TMDB_READ_TOKEN}`,
        },
      });
    } catch (error) {
      console.error("TMDB Error:", error);
      return null;
    }
  };

  const getPopularMovies = () => request<TMDBResponse<Movie>>("/movie/popular?region=TH");
  const getTopRatedMovies = () =>
    request<TMDBResponse<Movie>>("/movie/top_rated?region=TH");
  const getNowPlaying = () =>
    request<TMDBResponse<Movie>>("/movie/now_playing?region=TH");
  const getUpcomingMovies = () =>
    request<TMDBResponse<Movie>>("/movie/upcoming?region=TH");
  const getMovieDetails = (id: number) => request<Movie>(`/movie/${id}`);
  const searchMovies = (query: string) =>
    request<TMDBResponse<Movie>>(`/search/movie?query=${query}`);
  const getGenres = () => request<{ genres: Genre[] }>("/genre/movie/list");

  const getMoviesByGenres = (genreId: string, categoryKey: string) => {
    let sortParam = "popularity.desc";

    switch (categoryKey) {
      case "top_rated":
        sortParam = "vote_average.desc";
        break;
      case "upcoming":
        sortParam = "primary_release_date.desc";
        break;
      case "now_playing":
        sortParam = "release_date.desc";
        break;
      default:
        sortParam = "popularity.desc";
    }

    return request<TMDBResponse<Movie>>(
      `/discover/movie?with_genres=${genreId}&sort_by=${sortParam}`
    );
  };

  const getWatchProviders = (movieId: number) =>
    request<WatchProviderResponse>(`/movie/${movieId}/watch/providers`);

  const getGlobalProviders = () => request("/watch/providers/movie");

  const getMovieProviders = () =>
    request(`/watch/providers/movie?language=th-TH&watch_region=TH`);

  const getMovieCredits = (id: number) =>
    request<CreditsResponse>(`/movie/${id}/credits`);

  const getMovieImages = (id: number) =>
    request<MovieImagesResponse>(`/movie/${id}/images?include_image_language=en,en-US,th,null`);

  const getMovieVideos = (id: number) =>
  request<MovieVideoResponse>(`/movie/${id}/videos?include_image_language=en,en-US,th,null`);

  return {
    getPopularMovies,
    getTopRatedMovies,
    getNowPlaying,
    getUpcomingMovies,
    getMovieDetails,
    searchMovies,
    getGenres,
    getMoviesByGenres,
    getWatchProviders,
    getGlobalProviders,
    getMovieProviders,
    getMovieImages,
    getMovieCredits,
    getMovieVideos,
  };
};
