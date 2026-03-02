'use client';

import { MapPlace } from '@/types';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';

interface MapContentProps {
  lat: number;
  lng: number;
  places?: MapPlace[];
}

export default function MapContent({ lat, lng, places = [] }: MapContentProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
  });

  const router = useRouter();
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);

  // ホバー中の場所を取得（メモ化）
  const hoveredPlace = useMemo(() => {
    if (!hoveredPlaceId) return null;
    return places.find(p => String(p.id) === String(hoveredPlaceId)) || null;
  }, [places, hoveredPlaceId]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '700px' }}
      center={{ lat, lng }}
      zoom={16}
    >
      {/* 現在地マーカー */}
      <Marker position={{ lat, lng }} title="現在地" zIndex={1} />

      {/* レストランマーカー */}
      {places
        .filter((p): p is MapPlace & { lat: number; lng: number } => p.lat != null && p.lng != null)
        .map(place => (
          <Marker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            zIndex={10}
            onClick={() => router.push(`/restaurant/${place.id}`)}
            onMouseOver={() => setHoveredPlaceId(place.id)}
            onMouseOut={() => setHoveredPlaceId(null)}
          />
        ))}

      {/* InfoWindow */}
      {hoveredPlace && hoveredPlace.lat != null && hoveredPlace.lng != null && typeof window !== 'undefined' && (
        <InfoWindow
          key={`info-${hoveredPlace.id}`}
          position={{ lat: hoveredPlace.lat, lng: hoveredPlace.lng }}
          options={{
            pixelOffset: new window.google.maps.Size(0, -35),
            disableAutoPan: true,
          }}
          onCloseClick={() => setHoveredPlaceId(null)}
        >
          <div style={{
            width: '160px',
            minHeight: '130px',
            backgroundColor: 'white',
            padding: '8px',
            borderRadius: '8px',
            color: 'black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <div style={{
              width: '150px',
              height: '100px',
              overflow: 'hidden',
              borderRadius: '4px',
              marginBottom: '8px',
            }}>
              <img
                src={hoveredPlace.photoUrl}
                alt={hoveredPlace.restaurantName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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