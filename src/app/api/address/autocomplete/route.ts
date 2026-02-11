import { AddressSuggestion, GooglePlacesAutoCompleteResponse } from '@/types';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const input = searchParams.get('input')
  const sessionToken = searchParams.get('sessionToken')


  if (!sessionToken) {
    return NextResponse.json({ error: "文字を入力してください" }, { status: 400 })
  }
  if (!sessionToken) {
    return NextResponse.json({ error: "セッショントークンは必須です" }, { status: 400 })
  }
  try {
    const url = 'https://places.googleapis.com/v1/places:autocomplete';
    const apiKey = process.env.GOOGLE_API_KEY!;
    const header = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
    };

    const requestBody = {
      input: input,
      sessionToken: sessionToken,
      locationBias: {
        circle: {
          center: {
            latitude: 35.6669248,
            longitude: 139.6514163,
          },
          radius: 1000.0,
        },
      },
      languageCode: "ja",
      regionCode: "jp",
    };

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: header,
    })

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData);
      return NextResponse.json({ error: `Autocompleteリクエスト失敗:${response.status}` }, { status: 500 });
    }

    const data: GooglePlacesAutoCompleteResponse = await response.json()
    const suggestions = data.suggestions ?? []
    const results = suggestions.map((suggestion) => {
      return {
        placeId: suggestion.placePrediction?.placeId,
        placeName: suggestion.placePrediction?.structuredFormat?.mainText?.text,
        address_text: suggestion.placePrediction?.structuredFormat?.secondaryText?.text,
      }
    }).filter((suggestion): suggestion is AddressSuggestion => (!!suggestion.placeId && !!suggestion.placeName && !!suggestion.address_text))
    return NextResponse.json(results)

  } catch (error) {
    return NextResponse.json({ error: '予期せぬエラーが発生しました' },
      { status: 500 })
  }
}
