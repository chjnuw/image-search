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
  MovieCollectionResponse,
  PersonMovieCredits,
  PersonDetail,
} from "../Type/tmdb";

const BASE_URL = "/api/tmdb";

export const useTMDB = () => {
  const { lang, region } = useLang();
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  const request = async <T>(endpoint: string): Promise<T | null> => {
    try {
      return await $fetch<T>(`${BASE_URL}${endpoint}`, {
        query: {
          language: lang.value,
          region: region.value,
        },
        timeout: 15000,
        retry: 1,
      });
    } catch (error) {
      console.error("TMDB Error:", error);
      return null;
    }
  };

  const requestWithLang = async <T>(
    endpoint: string,
    language: string,
  ): Promise<T | null> => {
    try {
      return await $fetch<T>(`${BASE_URL}${endpoint}`, {
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

      // ✅ แยกชื่อชัดเจน
      title_en: en?.title || null,
      title_th: th?.title || null,

      // ✅ content ใช้ TH ก่อน fallback EN
      overview: th?.overview || en?.overview,
      tagline: th?.tagline || en?.tagline,
    };
  };

  const getMovieDetailsEN = async (id: number) =>
    requestWithLang<Movie>(`/movie/${id}`, "en-US");

  const searchMovies = (query: string, page = 1) =>
    request<TMDBResponse<Movie>>(
      `/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
    );

  const getGenres = () =>
    requestWithLang<{ genres: Genre[] }>("/genre/movie/list", "en-US");

  const getMoviesByGenres = (
    genreId: string,
    categoryKey: string,
    page = 1,
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
      `/discover/movie?with_genres=${genreId}&sort_by=${sortParam}&page=${page}`,
    );
  };

  const getMovieProviders = (movieId: number) =>
    $fetch<WatchProviderResponse>(
      `${BASE_URL}/movie/${movieId}/watch/providers`,
      {
        query: {
          watch_region: "TH",
        },
      },
    );

  const getWatchProviders = async (region = "TH") => {
    return await $fetch(`${BASE_URL}/watch/providers/movie`, {
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
      query: {
        include_image_language: `${lang.value},en,null`,
      },
    });

  const getMovieVideos = async (id: number, language: string = lang.value) => {
    try {
      let videos = await $fetch<MovieVideoResponse>(
        `${BASE_URL}/movie/${id}/videos`,
        {
          query: { language },
        },
      );

      // fallback ถ้าไม่มีผลลัพธ์และภาษาไม่ใช่ en-US
      if (
        (!videos?.results || !videos.results.length) &&
        language !== "en-US"
      ) {
        videos = await $fetch<MovieVideoResponse>(
          `${BASE_URL}/movie/${id}/videos`,
          {
            query: { language: "en-US" },
          },
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
        ",",
      )}&sort_by=popularity.desc`,
    );
  };

  const getMovieKeywords = (id: number) =>
    requestWithLang<{ keywords: { id: number; name: string }[] }>(
      `/movie/${id}/keywords`,
      "en-US",
    );

  async function discoverMoviesByProviders(
    providers: number[],
    genres: number[],
    sortBy = "popularity.desc",
    page = 1,
  ) {
    return await $fetch<TMDBResponse<Movie>>(`${BASE_URL}/discover/movie`, {
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
    $fetch<MovieReleaseDatesResponse>(`${BASE_URL}/movie/${id}/release_dates`);

  function extractAgeRating(data: any): string {
    if (!data?.results?.length) return "NR";

    const findCert = (country: string) => {
      const block = data.results.find((r: any) => r.iso_3166_1 === country);
      if (!block) return null;

      const cert = block.release_dates.find(
        (d: any) => d.certification && d.certification.trim() !== "",
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
    const [en, th] = await Promise.all([
      getPersonDetailsEN(id),
      getPersonDetailsTH(id),
    ]);

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

      gender: en?.gender ?? th?.gender,
    };
  };

  async function searchMovieByImage(file: File) {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/search-image", {
      method: "POST",
      body: form,
    });

    if (!res.ok) throw new Error("image search failed");

    return await res.json(); // { movie_ids: number[] }
  }

  const getMovieCollection = (collectionId: number) =>
    request<MovieCollectionResponse>(`/collection/${collectionId}`);

  // ==================================================================================
  // actor
  // ==================================================================================

  const getActorMovieCredits = (id: number) =>
    requestWithLang<PersonMovieCredits>(`/person/${id}/movie_credits`, "th-TH");

  const getPersonCredits = async (id: number) => {
    // 1️⃣ ดึง TH ก่อน
    const th = await requestWithLang<any>(
      `/person/${id}/combined_credits`,
      "th-TH",
    );

    if (!th) return null;

    // 2️⃣ จำกัดจำนวนก่อน (กัน CDN แตก)
    th.cast = (th.cast ?? []).slice(0, 20);
    th.crew = (th.crew ?? []).slice(0, 10);

    // 3️⃣ เช็คว่าจำเป็นต้อง fallback EN ไหม (เฉพาะ text)
    const needFallback = [...th.cast, ...th.crew].some(
      (i) => !i.title && !i.name,
    );

    if (!needFallback) {
      return th; // ✅ TH ครบ → ไม่ยิง EN
    }

    // 4️⃣ ดึง EN เฉพาะตอนจำเป็น
    const en = await requestWithLang<any>(
      `/person/${id}/combined_credits`,
      "en-US",
    );

    if (!en) return th;

    en.cast = (en.cast ?? []).slice(0, 20);
    en.crew = (en.crew ?? []).slice(0, 10);

    const merge = (thList: any[], enList: any[]) => {
      const enMap = new Map(enList.map((i) => [i.id, i]));

      return thList.map((thItem) => {
        const enItem = enMap.get(thItem.id);

        return {
          ...thItem,

          // 🏷 ภาษา TH ก่อน → EN fallback
          title: thItem.title || enItem?.title,
          name: thItem.name || enItem?.name,
          overview: thItem.overview || enItem?.overview || "",

          // 🖼 รูปใช้ EN เสมอ (กัน null)
          poster_path: enItem?.poster_path ?? thItem.poster_path ?? null,
          backdrop_path: enItem?.backdrop_path ?? thItem.backdrop_path ?? null,

          original_title: enItem?.original_title,
          original_name: enItem?.original_name,
        };
      });
    };

    return {
      ...th,
      cast: merge(th.cast ?? [], en.cast ?? []),
      crew: merge(th.crew ?? [], en.crew ?? []),
    };
  };

  const getPersonExternalIds = (id: number) =>
    $fetch(`${BASE_URL}/person/${id}/external_ids`, {});

  const getTvAggregateCredits = (tvId: number) =>
    $fetch(`${BASE_URL}/tv/${tvId}/aggregate_credits`, {});

  const searchActorsEN = (query: string, page = 1) =>
    requestWithLang<TMDBResponse<any>>(
      `/search/person?query=${encodeURIComponent(query)}&page=${page}`,
      "en-US",
    );

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
    searchMovieByImage,
    getMovieCollection,
    getActorMovieCredits,
    getPersonCredits,
    getPersonExternalIds,
    getTvAggregateCredits,
    searchActorsEN,
  };
};
