'use client'
import { addComment } from "@/app/(private)/actions/commentActions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react";
import type { KeyedMutator } from 'swr'
import { CommentItem } from "@/types";


interface CommentsModalProps {
  restaurantId: string;
  mutate: KeyedMutator<CommentItem[]>
}


export default function CommentsModal({ restaurantId, mutate }: CommentsModalProps) {
  const [comment, setComment] = useState(""); // テキストエリアの値
  const [rating, setRating] = useState<number>(0)
  const [open, setOpen] = useState(false);

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (rating === 0) {
        alert('評価を入力してください');
        return;
      }
      await addComment(comment, rating, restaurantId);
      setComment("");
      setRating(0);
      await mutate();
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };


  return (

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <span className="
          inline-flex items-center justify-center gap-2 px-6 py-3 
           rounded-md  bg-green-500 text-white font-medium 
          hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer
        ">
          コメントする
        </span>
      </DialogTrigger>

      <DialogContent className="max-w-md w-full p-6 rounded-xl bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">コメント投稿</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1">
            投稿すると他のユーザーも見られるようになります。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddComment} className="flex flex-col gap-4 mt-4">
          <textarea
            className="
              border border-gray-200  rounded-md  p-3 w-full 
              bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400
            "
            placeholder="コメントを入力..."
            value={comment}                  // ← ここを state にバインド
            onChange={(e) => setComment(e.target.value)} // ← 更新
            rows={4}
          />

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-3xl transition"
              >
                <span
                  className={star <= rating ? "text-yellow-400" : "text-gray-300"}
                >
                  ★
                </span>
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="
              bg-green-500 text-white font-semibold py-3  rounded-md 
              hover:bg-green-600 transition-colors duration-150 disabled:opacity-50
            "
          >
            投稿する
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
