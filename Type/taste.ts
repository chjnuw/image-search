export type TasteScore = {
  tagId: number
  tagName: string
  score: number
}

export type PieChartData = {
  labels: string[]
  datasets: {
    data: number[]
  }[]
}