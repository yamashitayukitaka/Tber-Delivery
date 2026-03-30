import { CategoryType } from "@/components/categories";

export const categories: CategoryType[] = [
  {
    categoryName: "ファーストフード",
    type: "fast_food_restaurant",
    imageUrl: "/images/categories/ファーストフード.png",
    // ✅Nextjsではpublicフォルダがルート直下にある場合、パスにpublic/を明示する必要はない
  },
  {
    categoryName: "日本料理",
    type: "japanese_restaurant",
    imageUrl: "/images/categories/日本料理.png",
  },
  {
    categoryName: "ラーメン",
    type: "ramen_restaurant",
    imageUrl: "/images/categories/ラーメン.png",
  },
  {
    categoryName: "寿司",
    type: "sushi_restaurant",
    imageUrl: "/images/categories/寿司.png",
  },
  {
    categoryName: "中華料理",
    type: "chinese_restaurant",

    imageUrl: "/images/categories/中華料理.png",
  },
  {
    categoryName: "コーヒ-",
    type: "cafe",
    imageUrl: "/images/categories/コーヒー.png",
  },
  {
    categoryName: "イタリアン",
    type: "italian_restaurant",
    imageUrl: "/images/categories/イタリアン.png",
  },
  {
    categoryName: "フランス料理",
    type: "french_restaurant",
    imageUrl: "/images/categories/フレンチ.png",
  },

  {
    categoryName: "ピザ",
    type: "pizza_restaurant",
    imageUrl: "/images/categories/ピザ.png",
  },

  {
    categoryName: "韓国料理",
    type: "korean_restaurant",
    imageUrl: "/images/categories/韓国料理.png",
  },
  {
    categoryName: "インド料理",
    type: "indian_restaurant",
    imageUrl: "/images/categories/インド料理.png",
  },

]