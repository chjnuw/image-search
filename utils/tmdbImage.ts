type ImageSize =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780";

export function tmdbImage(
  path?: string | null,
  size: ImageSize = "w342",
) {
  if (!path) return "/img/no-image.jpg";

  return `https://image.tmdb.org/t/p/${size}${path}`;
}