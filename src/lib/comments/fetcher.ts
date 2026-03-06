import { CommentItem } from "@/types"

export const commentFetcher = async (url: string): Promise<CommentItem[]> => {
  const res = await fetch(url)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || "コメントの取得に失敗しました")
  }

  return data.comments
}