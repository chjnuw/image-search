// server/api/tmdb/[...path].ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const rawPath = event.context.params?.path;
  const path = Array.isArray(rawPath)
    ? rawPath
    : typeof rawPath === "string"
    ? rawPath.split("/")
    : [];
  const query = getQuery(event);

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing TMDB path",
    });
  }

  const url = `https://api.themoviedb.org/3/${path.join("/")}`;

  try {
    return await $fetch(url, {
      headers: {
        Authorization: `Bearer ${config.TMDB_READ_TOKEN}`,
        Accept: "application/json",
      },
      query,
    });
  } catch (err: any) {
    throw createError({
      statusCode: err?.statusCode || 500,
      statusMessage: "TMDB proxy error",
    });
  }
});
