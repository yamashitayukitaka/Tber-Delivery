'use client'
import CommentsModal from "./comments-modal";
import Comments from "@/components/comments";
import { CommentItem } from "@/types";
import Link from "next/link";
import useSWR from "swr";
import CommentsAverage from "./average-star";

interface CommentsContainerProps {
  restaurantId: string;
  user: string | null;
}

export default function CommentsContainer({ restaurantId, user }: CommentsContainerProps) {

  const fetcher = async (url: string): Promise<CommentItem[]> => {
    const res = await fetch(url)
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || "コメントの取得に失敗しました")
    }
    return data.comments
  }

  const { data, error, isLoading, mutate } = useSWR<CommentItem[]>(`/api/comments/${restaurantId}`, fetcher)
  // /api/comments/${restaurantId}が const fetcher = async (url: string) => のurlに渡される

  if (isLoading) {
    return <div className="mt-8">コメントを読み込み中...</div>
  }
  if (error || !data) {
    console.log("コメントの取得に失敗", error)
    return <div className="mt-8">コメントの取得に失敗しました</div>
  }

  return (
    <>
      <div className="mt-8">
        {user ? <CommentsModal restaurantId={restaurantId} mutate={mutate} />
          : (
            <Link href="/login"
              className=" 
             inline-flex items-center justify-center gap-2 px-6 py-3 
           rounded-md  bg-green-500 text-white font-medium 
          hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer">
              コメントする
            </Link>
          )}
        <div className="ml-3.5">
          <CommentsAverage comments={data} />
        </div>

      </div>
      <Comments comments={data} user={user} mutate={mutate} />
    </>
  )
}