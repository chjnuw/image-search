export function getDisplayTitle(movie: any) {
  const en = movie.title_en;
  const th = movie.title_th;

  if (!en) return { main: th, sub: null };
  if (!th || th === en) return { main: en, sub: null };

  return { main: en, sub: th };
}