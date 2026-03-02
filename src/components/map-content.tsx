'use client';

import { MapPlace } from '@/types';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';

export default function MapContent({ lat, lng, places }: { lat: number, lng: number, places: MapPlace[] }) {
  console.log("MapContent rendered with lat:", lat, "lng:", lng, "places:", places);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
  });

  const router = useRouter();
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);

  // ホバー中のデータ取得を確実に
  const hoveredPlace = useMemo(() => {
    if (!hoveredPlaceId) return null;

    // 1. 検索対象の places の中身を一人ずつ点検
    console.log("--- Find Start ---");
    console.log("Looking for ID:", hoveredPlaceId);

    const found = places.find(p => {
      const isMatch = String(p.id) === String(hoveredPlaceId);
      if (isMatch) {
        console.log("✅ Match Found! Raw Object:", p);
        console.log("✅ photoUrl in Match:", p.photoUrl);
      }
      return isMatch;
    });

    if (!found) {
      console.warn("❌ No match found in places array for ID:", hoveredPlaceId);
    }

    return found;
  }, [places, hoveredPlaceId]);

  if (!isLoaded) return <div>Loading Map...</div>;

  const consoleAction = (name: string) => {
    console.log(`Hovered over: ${name}`);
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '700px' }}
      center={{ lat, lng }}
      zoom={16}
    >
      <Marker position={{ lat, lng }} title="現在地" zIndex={1} />

      {places
        .filter((p): p is MapPlace & { lat: number; lng: number } => p.lat != null && p.lng != null)
        .map(place => (
          <Marker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            zIndex={10} // レストランマーカーを前面に
            onClick={() => router.push(`/restaurant/${place.id}`)}
            // ★ 合成イベントではなく、google.maps のイベントとして確実に発火させるための調整
            onMouseOver={() => setHoveredPlaceId(place.id)}
            onMouseOut={() => setHoveredPlaceId(null)}
          />

        ))}

      {/* ★ InfoWindow を Marker の外（GoogleMapの直下）に配置していることを確認 */}
      {hoveredPlace && hoveredPlace.lat != null && hoveredPlace.lng != null && (
        <InfoWindow
          // key を ID にすることで、ホバー対象が変わるたびに DOM をリフレッシュ
          key={`info-${hoveredPlace.id}`}
          position={{ lat: hoveredPlace.lat, lng: hoveredPlace.lng }}
          options={{
            pixelOffset: new window.google.maps.Size(0, -35),
            disableAutoPan: true
          }}
          onCloseClick={() => setHoveredPlaceId(null)}
        >
          {/* ★ インラインスタイルで z-index と背景を明示 */}
          <div style={{
            width: '160px',
            minHeight: '130px',
            backgroundColor: 'white',
            padding: '8px',
            borderRadius: '8px',
            color: 'black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ width: '150px', height: '100px', overflow: 'hidden', borderRadius: '4px', marginBottom: '8px' }}>
              <img
                // ハードコーディングURLを直接指定（テスト用）
                src={hoveredPlace.photoUrl}
                alt={hoveredPlace.restaurantName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                // ロード失敗時のデバッグ
                onError={(e) => console.error("Image loading failed:", e)}
              />
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}>
              {hoveredPlace.restaurantName}
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}