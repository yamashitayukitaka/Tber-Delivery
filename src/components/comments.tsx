"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { CommentItem } from "@/types"
import { EllipsisVertical } from 'lucide-react';
import { deleteComment, updateComment } from "@/app/(private)/actions/commentActions";
import type { KeyedMutator } from 'swr'

type CommentsProps = {
  comments: CommentItem[];
  user: string | null;
  mutate: KeyedMutator<CommentItem[]>
}



export default function Comments({ comments, user, mutate }: CommentsProps) {
  const [showAll, setShowAll] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")
  const [newRating, setNewRating] = useState<number>(0)

  const commentsToShow = showAll ? comments : comments.slice(0, 3)

  const handleDelete = async (commentId: number) => {
    try {
      await deleteComment(commentId)
      mutate(prev => prev?.filter(c => c.id !== commentId), false)
    } catch (error) {
      console.error("削除失敗", error)
    }
  }


  const handleEditStart = (comment: CommentItem) => {
    setEditingId(comment.id)
    setEditText(comment.comment)
    setNewRating(comment.star) // 🔥 これ追加
  }

  const handleEditSave = async (commentId: number) => {
    try {
      await updateComment(commentId, editText, newRating) // ← rating後で対応

      mutate(prev =>
        prev?.map(c =>
          c.id === commentId
            ? { ...c, comment: editText, star: newRating, updated_at: new Date().toISOString() }
            : c
        ),
        false
      )
      setEditingId(null)
    } catch (e) {
      console.error("更新失敗", e)
    }
  }

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingId !== null) {
      inputRef.current?.focus()
    }
  }, [editingId])


  return (
    <div className="space-y-4 mb-10">
      {commentsToShow.map(comment => (
        <div key={comment.id} className="flex gap-4 p-4 border-b border-gray-200">

          <div className="shrink-0">
            <Image
              src={comment.avatar_url || "/no_image.png"}
              alt={comment.full_name || "匿名"}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          </div>

          <div className="w-full">
            <div className="flex items-start justify-between">
              <div className="w-[85%]">
                <p className="font-semibold text-gray-900">
                  {comment.full_name || "匿名"}
                </p>

                {editingId === comment.id ? (
                  <>
                    <div className="flex mt-2 gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="text-3xl transition"
                        >
                          <span
                            className={star <= newRating ? "text-yellow-400" : "text-gray-300"}
                          >
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-1 flex flex-col gap-2">
                      <input
                        ref={inputRef}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="p-2 text-gray-900 w-full"
                      />
                      <div className="flex gap-2 ml-auto">
                        <button
                          onClick={() => handleEditSave(comment.id)}
                          className="text-sm px-2 py-1 bg-green-500 text-white rounded"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-sm px-2 py-1 bg-gray-300 rounded"
                        >
                          キャンセル
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex mt-2 gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          className={star <= (comment.star || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="mt-1 text-gray-700">{comment.comment}</p>
                  </>
                )}
              </div>

              <div className="flex flex-col items-end gap-3">
                <span className="text-sm text-gray-400">
                  {new Date(comment.updated_at).toLocaleString()}
                </span>

                {user && user === comment.user_id && (
                  <div className="relative group inline-block">
                    <button className="p-1 rounded hover:bg-gray-100">
                      <EllipsisVertical className="cursor-pointer" />
                    </button>

                    <ul
                      className="
                        absolute right-0 top-full
                        w-24 bg-white border rounded-lg shadow-md
                        opacity-0 invisible
                        group-hover:opacity-100 group-hover:visible
                        transition
                        z-10
                      "
                    >
                      <li className="cursor-pointer hover:bg-gray-100 p-2" onClick={() => handleEditStart(comment)}>
                        編集
                      </li>
                      <li className="cursor-pointer hover:bg-gray-100 p-2" onClick={() => handleDelete(comment.id)}>
                        削除
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {comments.length > 3 && (
        showAll ? (
          <button
            onClick={() => setShowAll(false)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            閉じる
          </button>
        ) : (
          <button
            onClick={() => setShowAll(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            もっと見る
          </button>
        )
      )}
    </div>
  )
}
