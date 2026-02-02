import Header from "@/components/header";

export default function RestaurantPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="pt-16 max-w-7xl mx-auto px-10">
        {children}
      </main>
      {/*{children}は同一階層または下階層のpage.tsxの内容を出力する子コンポーネントタグのようなもの */}
      {/* URLがURL/下階層フォルダ名/の場合は下階層フォルダ名/page.tsxの内容がlayout.tsxのchildrenが受け取り適応される */}
    </>
  );
}