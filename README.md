# Tber-Delivery

フードデリバリーサービスを想定した Web アプリケーションです。  
ユーザー認証・決済・店舗検索など、**実務で必要となる主要機能を一通り実装**しています。

## 🔗 Demo
https://tber-delivery.vercel.app/

---

## 🚀 概要

Tber-Deliveryは、近隣のラーメン・レストラン情報を検索・閲覧・注文できるフルスタックWebアプリです。
ユーザーは住所やカテゴリでレストランを検索し、カート・決済・履歴確認・コメント・評価まで可能です。

---

## 🛠 技術スタック

### フロントエンド
- フロントエンド: Next.js, TypeScript, TailWindCSS　SWR (データフェッチ・キャッシュ管理)
- バックエンド: Supabase (認証、DB)
- 決済: Stripe Checkout + サービス手数料反映
- API: Google Places API　Maps JavaScript API
- その他:レスポンシブデザイン対応

---

## ✨　主な機能

### フロントエンド
- トップページ: 近隣店舗カルーセル、カテゴリ検索、キーワード予測
- レストラン詳細: コメント・評価機能
- 注文フロー: カート管理、履歴確認
- ユーザー認証: メール・パスワード + OAuth

### バックエンド/API
- Supabase認証 & DB管理
- Stripe決済 + 注文データ確定
- Google Places APIによる店舗情報取得
- エラーハンドリング、レスポンス最適化

### その他
- pnpm（パッケージ管理）
- Vercel（デプロイ）

---

## 🧠 工夫した点

### ⚡️Stripe Checkout を活用したセキュアな決済フローを構築
- 動的なラインアイテム生成: カート内の商品データに基づき、バックエンド（Route Handlers）でリアルタイムに決済セッションを生成。
- 手数料などの追加項目も柔軟に統合。
- 決済完了後の自動処理: Stripe の session_id を検証キーとして、決済完了ページで注文ステータスの更新とカートのクリアを自動実行。
### ⚡️Supabase 認証状態に応じたアクセス制御
### ⚡️ Server Component / Client Component の適切な使い分け
### ⚡️ Route Handlers / Server Actions の適切な使用
### ⚡️ コンポーネント分割と責務の明確化
### ⚡️ TypeScript による適切な型定義と型エラー回避
- Supabase CLI による型生成: DBスキーマから自動で TypeScript 型定義を生成し、フロントエンドからバックエンドまで一貫した型安全性を確保。
### ⚡️ Supabase API 通信時のエラーハンドリング
### ⚡️ SWRによるデータフェッチとキャッシュ最適化
 データの取得と状態管理には **SWR** を採用し、パフォーマンスとUXの両立を図っています。
- キャッシュ共有:** 共通の `fetcher` とキャッシュキーを利用することで、異なるページやコンポーネント間でも一度取得したデータを再利用し、ネットワーク負荷を軽減しています。
- データの一貫性:** 注文確定やプロフィール更新などの操作後、特定のキーに対して再検証（revalidate）を実行。これにより、リロードなしでアプリ全体の表示を最新状態に同期させています。

---

## 🧰 セットアップ方法

### 前提条件
- Node.js 18 以上
- pnpm

### インストール・起動
   ```bash
   pnpm install
   pnpm run dev
   ```
   → `http://localhost:3000` で起動します。
   ※ 初回は `pnpm install` で依存関係インストールが必要です。

### env.localに環境変数をセット
- プロジェクト直下に .env.local を作成
- 以下を設定してください
 ```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
GOOGLE_API_KEY=
STRIPE_SECRET_KEY=
  ```

データベースER図
https://www.figma.com/board/XldurHHcUNWb07s3K0UxEs/Untitled?node-id=1-5&t=3nUXMsM4WrLPrcZx-1
<img width="1392" height="1055" alt="Image" src="https://github.com/user-attachments/assets/6461b4e6-0d39-436a-a93f-0bde5c41513b" />

## 今後の改善

- フロント・バックのパフォーマンス最適化
