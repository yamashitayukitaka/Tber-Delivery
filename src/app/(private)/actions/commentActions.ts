'use server';
import { createClient } from "@/utils/supabase/server";

export const addComment = async (
  comment: string,
  rating: number,
  restaurantId: string
) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser()
  const avatar_url = user?.user_metadata?.avatar_url || '';
  const full_name = user?.user_metadata?.full_name || '';

  const { error: insertError } = await supabase
    .from("comments")
    .insert({
      comment,
      star: rating,
      user_id: user?.id!,   // ✅ Non-null assertion
      restaurant_id: restaurantId,
      updated_at: new Date().toISOString(),
      avatar_url,
      full_name,
    });

  if (insertError) {
    console.error("コメントの投稿に失敗しました", insertError);
    throw new Error("コメントの投稿に失敗しました");
  }
};


export const deleteComment = async (commentId: number) => {
  const supabase = await createClient();

  // 🔥 ログインユーザー取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("ログインしていません");
  }

  // 🔥 自分のコメントだけ削除
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error("削除に失敗しました");
  }
};


export const updateComment = async (
  commentId: number,
  editText: string,
  rating: number
) => {
  const supabase = await createClient()

  // 🔥 ログインユーザー取得
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("ログインしていません")
  }

  // 🔥 自分のコメントのみ更新
  const { error } = await supabase
    .from("comments")
    .update({
      comment: editText,
      star: rating,
      updated_at: new Date().toISOString(),
    })
    .eq("id", commentId)
    .eq("user_id", user.id)

  if (error) {
    console.error("コメント更新失敗", error)
    throw new Error("コメントの更新に失敗しました")
  }
}
