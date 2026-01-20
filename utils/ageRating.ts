export type AgeRatingResult = {
  label: string;
  class: string;
};

export function normalizeAgeRating(
  rating?: string | number | null
): AgeRatingResult {
  const r = rating?.toString().toUpperCase() ?? "NR";

  if (["G", "PG", "U", "ALL", "ท"].includes(r))
    return {
      label: "G",
      class: "border-green-400 text-green-400 bg-green-400/10",
    };

  if (["12", "12A", "PG-13", "13", "13+", "PG12", "น13+"].includes(r))
    return {
      label: "13+",
      class: "border-yellow-400 text-yellow-400 bg-yellow-400/10",
    };

  if (["15", "15+", "R15+", "TV-14", "น15+"].includes(r))
    return {
      label: "15+",
      class: "border-orange-400 text-orange-400 bg-orange-400/10",
    };

  if (["18", "18+", "R", "R18+", "NC-17", "X", "TV-MA", "น18+"].includes(r))
    return {
      label: "18+",
      class: "border-red-500 text-red-500 bg-red-500/10",
    };

  if (["20", "20+", "ฉ20+"].includes(r))
    return {
      label: "20",
      class: "border-purple-500 text-purple-500 bg-purple-500/10",
    };

  return {
    label: "NR",
    class: "border-gray-400 text-gray-400 bg-gray-400/10",
  };
}
