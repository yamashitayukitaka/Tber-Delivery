const nextConfig = {
  /* config options here */
  logging: {
    fetches: { fullUrl: true },
  },
  // fetch通信の内容（URLやキャッシュの有無を含む）をターミナルで確認する設定
  experimental: {
    useCache: true,
  },
  //use cache を有効にする設定
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'places.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'foeurupnttdmxitwdmce.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // 追加
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;


