// composables/useSearchState.ts
import type { Movie } from '~/Type/tmdb'

export const useSearchState = () => {
  const imageResults = useState<Movie[]>('image-results', () => [])
  const isImageSearch = useState<boolean>('is-image-search', () => false)
  const imagePreview = useState<string | null>('image-preview', () => null)
  const imageAnchor = useState<Movie | null>('image-anchor', () => null)

  return {
    imageResults,
    isImageSearch,
    imagePreview,
    imageAnchor,
  }
}
