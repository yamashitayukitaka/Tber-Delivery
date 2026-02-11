
import { GooglePlacesAutoDetailsApiResponse, GooglePlacesSearchApiResponse, placeDetailsAll } from "@/types";
import { transformPlaceResults } from "./utils";
import { createClient } from "@/utils/supabase/server";


// 近くのレストランを取得
export async function fetchRestaurants(lat: number, lng: number) {
  const url = "https://places.googleapis.com/v1/places:searchNearby";
  const apiKey = process.env.GOOGLE_API_KEY!;
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": "places.id,places.displayName,places.types,places.primaryType,places.photos",
  };


  const desiredTypes = [
    "japanese_restaurant",
    "cafe",
    "cafeteria",
    "coffee_shop",
    "chinese_restaurant",
    "fast_food_restaurant",
    "hamburger_restaurant",
    "french_restaurant",
    "italian_restaurant",
    "pizza_restaurant",
    "ramen_restaurant",
    "sushi_restaurant",
    "korean_restaurant",
    "indian_restaurant",
  ];

  const requestBody = {
    includedTypes: desiredTypes,
    maxResultCount: 10,
    // 取得するデータの件数
    locationRestriction: {
      // 取得するデータの地点
      circle: {
        center: {
          latitude: lat,
          // 緯度
          longitude: lng,
          // 経度
        },
        radius: 1000.0
        // 半径500メートル
      }
    },
    languageCode: "ja",
    // 日本語でデータを取得する
    rankPreference: "DISTANCE",
  }
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: header,
    next: { revalidate: 86400 }
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error(errorData)
    return { error: `NearbySearchリクエスト失敗:${response.status}` }
  }

  const data: GooglePlacesSearchApiResponse = await response.json();

  if (!data.places) {
    return { data: [] }
  }

  const nearbyPlaces = data.places
  const matchingPlaces = nearbyPlaces.filter(
    (place) => place.primaryType && desiredTypes.includes(place.primaryType)
  );
  const Restaurants = await transformPlaceResults(matchingPlaces);
  return { data: Restaurants }
}

// 近くのラーメン店を取得
export async function fetchRamenRestaurants(lat: number, lng: number) {
  const url = "https://places.googleapis.com/v1/places:searchNearby";
  const apiKey = process.env.GOOGLE_API_KEY!;
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": "places.id,places.displayName,places.primaryType,places.photos",
  };
  const requestBody = {
    includedPrimaryTypes: ["ramen_restaurant"],
    // primaryTypeがramen_restaurantの箇所のみを取得する
    maxResultCount: 10,
    // 取得するデータの件数
    locationRestriction: {
      // 取得するデータの地点
      circle: {
        center: {
          latitude: lat,//渋谷
          // 緯度
          longitude: lng,//渋谷
          // 経度
        },
        radius: 1000.0
        // 半径500メートル
      }
    },
    languageCode: "ja",
    // 日本語でデータを取得する
    rankPreference: "DISTANCE",
  }
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: header,
    next: { revalidate: 86400 }
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error(errorData)
    return { error: `NearbySearchリクエスト失敗:${response.status}` }
  }

  const data: GooglePlacesSearchApiResponse = await response.json();
  console.log(data)

  if (!data.places) {
    return { data: [] }
  }

  const nearbyRamenPlaces = data.places

  const RamenRestaurants = await transformPlaceResults(nearbyRamenPlaces)
  return { data: RamenRestaurants }
}


//カテゴリ検索機能
export async function fetchCategoryRestaurants(category: string, lat: number, lng: number) {
  const url = "https://places.googleapis.com/v1/places:searchNearby";
  const apiKey = process.env.GOOGLE_API_KEY!;
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": "places.id,places.displayName,places.primaryType,places.photos",
  };
  const requestBody = {
    includedPrimaryTypes: [category],
    maxResultCount: 10,
    // 取得するデータの件数
    locationRestriction: {
      // 取得するデータの地点
      circle: {
        center: {
          latitude: lat,//渋谷
          // 緯度
          longitude: lng,//渋谷
          // 経度
        },
        radius: 1000.0
        // 半径500メートル
      }
    },
    languageCode: "ja",
    // 日本語でデータを取得する
    rankPreference: "DISTANCE",
  }
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: header,
    next: { revalidate: 86400 }
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error(errorData)
    return { error: `NearbySearchリクエスト失敗:${response.status}` }
  }

  const data: GooglePlacesSearchApiResponse = await response.json();
  console.log(data)

  if (!data.places) {
    return { data: [] }
  }

  const nearbyCategoryPlaces = data.places

  const CategoryRestaurants = await transformPlaceResults(nearbyCategoryPlaces)
  return { data: CategoryRestaurants }
}


// キーワード検索
export async function fetchRestaurantsByKeyword(query: string, lat: number, lng: number) {
  const url = "https://places.googleapis.com/v1/places:searchText";
  // ✅キーワード検索の場合は、エンドポイントが変わるので注意
  const apiKey = process.env.GOOGLE_API_KEY!;
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": "places.id,places.displayName,places.primaryType,places.photos",
  };
  const requestBody = {
    textQuery: query,
    pageSize: 10,
    // 取得するデータの件数
    // ✅キーワード検索ではmaxResultCountは非推奨なので、pageSizeを使う（公式ドキュメントより）
    locationBias: {
      circle: {
        center: {
          latitude: lat,//渋谷
          // 緯度
          longitude: lng,//渋谷
          // 経度
        },
        radius: 1000.0
        // 半径500メートル
      }
    },
    languageCode: "ja",
    // 日本語でデータを取得する
    rankPreference: "DISTANCE",
  }
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: header,
    next: { revalidate: 86400 }
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error(errorData)
    return { error: `TextSearchリクエスト失敗:${response.status}` }
  }

  const data: GooglePlacesSearchApiResponse = await response.json();
  console.log(data)

  if (!data.places) {
    return { data: [] }
  }

  const textSearchPlaces = data.places

  const restaurants = await transformPlaceResults(textSearchPlaces)
  return { data: restaurants }
}


export async function getPhotoUrl(name: string, maxWidth: number = 400): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY!;
  const url = `https://places.googleapis.com/v1/${name}/media?key=${apiKey}&maxWidthPx=${maxWidth}`;
  return url;
}


export async function getPlaceDetails(placeId: string, fields: string[], sessionToken?: string) {
  const fieldsParam = fields.join(',')
  const apiKey = process.env.GOOGLE_API_KEY!;
  let url: string;
  if (sessionToken) {
    url = `https://places.googleapis.com/v1/places/${placeId}?sessionToken=${sessionToken}&languageCode=ja`;
  } else {
    url = `https://places.googleapis.com/v1/places/${placeId}?languageCode=ja`;
  }

  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": fieldsParam,
  };

  const response = await fetch(url, {
    method: 'GET',
    headers: header,
    next: { revalidate: 86400 }
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error(errorData)
    return { error: `placeDetrailsリクエスト失敗:${response.status}` }
  }

  const data: GooglePlacesAutoDetailsApiResponse = await response.json();
  const results: placeDetailsAll = {}

  if (fields.includes('location') && data.location) {
    results.location = data.location
  }
  if (fields.includes('displayName') && data.displayName?.text) {
    results.displayName = data.displayName.text
  }

  if (fields.includes('primaryType') && data.primaryType) {
    results.primaryType = data.primaryType
  }

  if (fields.includes('photos')) {
    results.photoUrl = data.photos?.[0]?.name
      ? await getPhotoUrl(data.photos[0].name, 1200)
      : "/no_image.png";
    // results.photoUrl = "/images/header/img01.jpg";
  }
  return { data: results }
}


export async function fetchLocation() {
  const DEFAULT_LOCATION = {
    lat: 35.6669248,
    lng: 139.6514163,
  };

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng };
  }

  // 選択中の緯度と経度を取得
  const { data: selectedAddress, error: selectedAddressError } = await supabase
    .from('profiles')
    .select(`
        addresses (
          latitude,
          longitude
        )
      `)
    .eq('id', user.id)
    .single()
  if (selectedAddressError) {
    console.error('緯度と経度の取得に失敗しました', selectedAddressError);
    throw new Error('緯度と経度の取得に失敗しました');
    // ✅呼び出し元でcatchが無ければ、app routerでは対応するerror.tsxが呼び出される
  }

  const lat = selectedAddress.addresses?.latitude ?? DEFAULT_LOCATION.lat;
  const lng = selectedAddress.addresses?.longitude ?? DEFAULT_LOCATION.lng;
  return { lat, lng };
};


