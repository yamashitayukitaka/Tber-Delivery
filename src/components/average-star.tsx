'use client'

import { commentFetcher } from "@/lib/comments/fetcher";
import { CommentItem } from "@/types";
import useSWR from "swr";


export default function CommentsAverage({ restaurantId }: { restaurantId: string }) {
  const { data: comments, error } = useSWR<CommentItem[]>(`/api/comments/${restaurantId}`, commentFetcher)

  if (error || !comments) {
    console.log("評価の取得に失敗", error)
    return <div className="mt-8">評価の取得に失敗しました</div>
  }
  const averageStar =
    comments.length === 0
      ? 0
      : comments.reduce((sum, c) => sum + (c.star ?? 0), 0) / comments.length
  const rounded = Math.round(averageStar * 10) / 10;// ⭐ 星表示用


  return (
    <div className="flex items-center">
      <span className="text-2xl font-bold">{rounded}</span>
      <div className="flex ml-2">
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} className={star <= rounded ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
      <span className="ml-2 text-sm text-yellow-400"> {comments.length === 0
        ? "まだ評価はありません"
        : `${comments.length} 件の評価`}</span>
    </div>
  )
}