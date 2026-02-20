
import { CommentItem } from "@/types";
export default function CommentsAverage({ comments }: { comments: CommentItem[] }) {
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
      <span className="ml-2 text-sm text-gray-500"> {comments.length === 0
        ? ""
        : `${comments.length} 件の評価`}</span>
    </div>
  )
}