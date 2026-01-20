import { useLang } from "./useLang";

import type {
  TMDBResponse,
  Movie,
  Genre,
  WatchProviderResponse,
  CreditsResponse,
  MovieImagesResponse,
  MovieVideoResponse,
  MovieReleaseDatesResponse,
} from "../Type/tmdb";

const BASE_URL = "https://api.themoviedb.org/3";

export const useTMDB = () => {
  const { lang, region } = useLang();
  const config = useRuntimeConfig();
  const authHeaders = {
    accept: "application/json",
    Authorization: `Bearer ${config.public.TMDB_READ_TOKEN}`,
  };

  const request = async <T>(endpoint: string): Promise<T | null> => {
    try {
      return await $fetch<T>(`${BASE_URL}${endpoint}`, {
        headers: authHeaders,
        query: {
          language: lang.value,
          region: region.value,
        },
      });
    } catch (error) {
      console.error("TMDB Error:", error);
      return null;
    }
  };

  const requestWithLang = async <T>(
    endpoint: string,
    language: string
  ): Promise<T | null> => {
    try {
      return await $fetch<T>(`${BASE_URL}${endpoint}`, {
        headers: authHeaders,
        query: {
          language,
          region: region.value,
        },
      });
    } catch (error) {
      console.error("TMDB Error:", error);
      return null;
    }
  };

  const getPopularMovies = (page = 1) =>
    request<TMDBResponse<Movie>>(`/movie/popular?page=${page}`);

  const getTopRatedMovies = (page = 1) =>
    request<TMDBResponse<Movie>>(`/movie/top_rated?page=${page}`);

  const getNowPlaying = (page = 1) =>
    request<TMDBResponse<Movie>>(`/movie/now_playing?page=${page}`);

  const getUpcomingMovies = (page = 1) =>
    request<TMDBResponse<Movie>>(`/movie/upcoming?page=${page}`);
  const getMovieDetails = async (id: number) => {
    const th = await request<Movie>(`/movie/${id}`);
    if (lang.value !== "th-TH") return th;

    const en = await getMovieDetailsEN(id);

    return {
      ...(en ?? {}),
      ...(th ?? {}),
      title: th?.title || en?.title,
      overview: th?.overview || en?.overview,
      tagline: th?.tagline || en?.tagline,
    };
  };

  const getMovieDetailsEN = async (id: number) =>
    requestWithLang<Movie>(`/movie/${id}`, "en-US");

  const searchMovies = (query: string) =>
    request<TMDBResponse<Movie>>(
      `/search/movie?query=${encodeURIComponent(query)}`
    );

  const getGenres = () =>
    requestWithLang<{ genres: Genre[] }>("/genre/movie/list", "en-US");

  const getMoviesByGenres = (
    genreId: string,
    categoryKey: string,
    page = 1
  ) => {
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
      `/discover/movie?with_genres=${genreId}&sort_by=${sortParam}&page=${page}`
    );
  };

  const getMovieProviders = (movieId: number) =>
    $fetch<WatchProviderResponse>(
      `${BASE_URL}/movie/${movieId}/watch/providers`,
      {
        headers: authHeaders,
        query: {
          watch_region: "TH",
        },
      }
    );

  const getWatchProviders = async (region = "TH") => {
    return await $fetch(`${BASE_URL}/watch/providers/movie`, {
      headers: authHeaders,
      query: {
        watch_region: "TH",
      },
    });
  };

  const getMovieCreditsTH = (id: number) =>
    request<CreditsResponse>(`/movie/${id}/credits`);

  const getMovieCreditsEN = (id: number) =>
    requestWithLang<CreditsResponse>(`/movie/${id}/credits`, "en-US");

  const getMovieImages = (id: number) =>
    $fetch<MovieImagesResponse>(`${BASE_URL}/movie/${id}/images`, {
      headers: authHeaders,
      query: {
        include_image_language: `${lang.value},en,null`,
      },
    });

  const getMovieVideos = async (id: number, language: string = lang.value) => {
    try {
      let videos = await $fetch<MovieVideoResponse>(
        `${BASE_URL}/movie/${id}/videos`,
        {
          headers: authHeaders,
          query: { language },
        }
      );

      // fallback ถ้าไม่มีผลลัพธ์และภาษาไม่ใช่ en-US
      if (
        (!videos?.results || !videos.results.length) &&
        language !== "en-US"
      ) {
        videos = await $fetch<MovieVideoResponse>(
          `${BASE_URL}/movie/${id}/videos`,
          {
            headers: authHeaders,
            query: { language: "en-US" },
          }
        );
      }

      return videos;
    } catch (err) {
      console.error("Failed to fetch movie videos:", err);
      return null;
    }
  };

  const getSimilarMovies = (id: number) =>
    request<TMDBResponse<Movie>>(`/movie/${id}/similar`);

  const getRecommendedMovies = (id: number) =>
    request<TMDBResponse<Movie>>(`/movie/${id}/recommendations`);

  const discoverMoviesByGenres = (genreIds: number[]) => {
    if (!genreIds.length) return null;

    return request<TMDBResponse<Movie>>(
      `/discover/movie?with_genres=${genreIds.join(
        ","
      )}&sort_by=popularity.desc`
    );
  };

  const getMovieKeywords = (id: number) =>
    requestWithLang<{ keywords: { id: number; name: string }[] }>(
      `/movie/${id}/keywords`,
      "en-US"
    );

  async function discoverMoviesByProviders(
    providers: number[],
    genres: number[],
    sortBy = "popularity.desc",
    page = 1
  ) {
    return await $fetch<TMDBResponse<Movie>>(`${BASE_URL}/discover/movie`, {
      headers: authHeaders,
      query: {
        ...(providers.length && {
          with_watch_providers: providers.join("|"),
          watch_region: "TH",
        }),
        ...(genres.length && {
          with_genres: genres.join(","),
        }),
        sort_by: sortBy,
        page,
        language: lang.value,
        region: region.value,
      },
    });
  }

  const getMovieReleaseDates = (id: number) =>
    $fetch<MovieReleaseDatesResponse>(`${BASE_URL}/movie/${id}/release_dates`, {
      headers: authHeaders,
    });

  function extractAgeRating(data: any): string {
    if (!data?.results?.length) return "NR";

    const findCert = (country: string) => {
      const block = data.results.find((r: any) => r.iso_3166_1 === country);
      if (!block) return null;

      const cert = block.release_dates.find(
        (d: any) => d.certification && d.certification.trim() !== ""
      );

      return cert?.certification || null;
    };

    return findCert("TH") || findCert("US") || "NR";
  }

  const getMovieAgeRating = async (id: number): Promise<string> => {
    const data = await getMovieReleaseDates(id);
    return extractAgeRating(data);
  };

  const getPopularActorsEN = (page = 1) =>
    requestWithLang<TMDBResponse<any>>(`/person/popular?page=${page}`, "en-US");

  const getPersonDetailsTH = (id: number) =>
    requestWithLang<any>(`/person/${id}`, "th-TH");

  const getPersonDetailsEN = (id: number) =>
    requestWithLang<any>(`/person/${id}`, "en-US");

  const getPersonDetails = async (id: number) => {
    const en = await getPersonDetailsEN(id);
    const th = await getPersonDetailsTH(id);

    if (!en && !th) return null;

    return {
      id: en?.id ?? th?.id,
      name: en?.name ?? th?.name, // ✅ EN เสมอ
      profile_path: en?.profile_path ?? th?.profile_path,

      // ✅ รายละเอียดใช้ TH ก่อน
      biography: th?.biography || en?.biography || "",
      place_of_birth: th?.place_of_birth || en?.place_of_birth || "",
      birthday: th?.birthday || en?.birthday,
      known_for_department:
        th?.known_for_department || en?.known_for_department,
    };
  };

  return {
    getPopularMovies,
    getTopRatedMovies,
    getNowPlaying,
    getUpcomingMovies,
    getMovieDetails,
    searchMovies,
    getGenres,
    getMoviesByGenres,
    getMovieProviders,
    getMovieImages,
    getMovieCreditsTH,
    getMovieVideos,
    getSimilarMovies,
    getRecommendedMovies,
    discoverMoviesByGenres,
    getMovieDetailsEN,
    getMovieKeywords,
    getMovieCreditsEN,
    discoverMoviesByProviders,
    getWatchProviders,
    getMovieReleaseDates,
    extractAgeRating,
    getMovieAgeRating,
    getPopularActorsEN,
    getPersonDetails,
  };
};
