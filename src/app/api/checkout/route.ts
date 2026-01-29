import { CartItem } from '@/types';
import { NextResponse } from 'next/server';
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const { cart_items, restaurantId }: { cart_items: CartItem[]; restaurantId: string; } = await request.json();
    if (!cart_items || cart_items.length === 0) {
      return NextResponse.json({ error: 'カートが空です' }, { status: 400 });
    }

    const line_items = [
      // 商品
      ...cart_items.map(item => ({
        price_data: {
          currency: 'jpy',
          product_data: { name: item.menus.name },
          unit_amount: Math.round(item.menus.price),
        },
        quantity: item.quantity,
      })),

      // 手数料（★追加）
      {
        price_data: {
          currency: 'jpy',
          product_data: { name: 'サービス手数料' },
          unit_amount: 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/restaurant/${restaurantId}/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    });

    return NextResponse.json({ checkout_url: session.url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
