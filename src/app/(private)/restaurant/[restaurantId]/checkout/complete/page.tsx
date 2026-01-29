'use client'
import { checkoutAction } from "@/app/(private)/actions/cartAction";
import DeliveryAnimation from "@/components/delivery-animation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/cart/useCart";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutCompletePage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { targetCart: cart, mutateCart } = useCart(restaurantId)
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (!cart) return;
    const StartcheckoutAction = async () => {
      try {
        if (!sessionId) {
          return;
        }
        await checkoutAction(cart.id, sessionId);
        mutateCart(
          (prevCarts) => prevCarts?.filter((c) => c.id !== cart.id),
          false
        );
      } catch (error) {
        console.error(error);
        alert('エラーが発生しました')
      } finally {
        setIsProcessing(false); // ← 完了
      }
    }
    StartcheckoutAction();
  }, [cart])

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <p>決済処理中です…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-4">
      <h1 className="font-bold text-3xl">ご注文の品を準備しています…</h1>
      <DeliveryAnimation />
      <Button size={"lg"} asChild>
        <Link href={"/orders"}>注文履歴へ</Link>
      </Button>
    </div>
  );
}
