# Tber-Delivery

フードデリバリーサービスを想定した Web アプリケーションです。  
ユーザー認証・決済・店舗検索など、**実務で必要となる主要機能を一通り実装**しています。

## 🔗 Demo
https://tber-delivery.vercel.app/

---

## 🚀 概要

Tber-Delivery は、ユーザーが現在地周辺の店舗を検索し、  
商品をカートに追加して注文・決済まで行えるフードデリバリー Web アプリです。

---

## 🛠 技術スタック

### フロントエンド
- Next.js（App Router）
- React
- TypeScript
- Tailwind CSS
- clsx

### バックエンド / BaaS
- Supabase  
  - Auth（認証）
  - Database

### 外部サービス
- Stripe（決済）

### その他
- pnpm（パッケージ管理）
- Vercel（デプロイ）

---

## ✨ 主な機能

- ユーザー認証（ログイン / 新規登録）
- Stripe を用いた決済処理（テストモード）
- 位置情報を用いた店舗検索
- カート機能（追加・削除・合計金額表示）
- 認証状態に応じた UI の出し分け
- レスポンシブ対応 UI

---

## 🧠 工夫した点

- Stripe を用いた決済機能の実装とフロー設計
- Supabase 認証状態に応じたアクセス制御
- Server Component / Client Component の適切な使い分け
- Route Handlers / Server Actions の適切な使用
- コンポーネント分割と責務の明確化
- TypeScript による適切な型定義と型エラー回避
- Supabase API 通信時のエラーハンドリング

---

## 🧰 セットアップ方法

### 前提条件
- Node.js 18 以上
- pnpm

### インストール
-pnpm install


データベースER図
https://www.figma.com/board/XldurHHcUNWb07s3K0UxEs/Untitled?node-id=1-5&t=3nUXMsM4WrLPrcZx-1
<img width="1392" height="1055" alt="Image" src="https://github.com/user-attachments/assets/6461b4e6-0d39-436a-a93f-0bde5c41513b" />



