'use client';
import { MapPlace } from '@/types';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';

interface MapContentProps {
  lat: number;
  lng: number;
  places?: MapPlace[]; // 配列を optional にする場合
  singlePlace?: MapPlace;
}

export default function MapContent({ lat, lng, places, singlePlace }: MapContentProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
  });
  const router = useRouter();

  if (!isLoaded) return <div>Loading Map...</div>;

  console.log('singleMap', singlePlace)
  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '500px' }}
      center={{ lat, lng }}
      zoom={15}
    >
      {/* 現在地 */}
      <Marker position={{ lat, lng }} title="現在地" />

      {/* 複数の場所 */}
      {places
        ?.filter(
          (place): place is { id: string; restaurantName: string; lat: number; lng: number } =>
            place.lat != null && place.lng != null
        )
        .map((place) => (
          <Marker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            title={place.restaurantName}
            onClick={() => router.push(`/restaurant/${place.id}`)}
          />
        ))}

      {/* 単体の場所 */}
      {singlePlace?.lat != null && singlePlace?.lng != null && (
        <Marker
          position={{ lat: singlePlace.lat, lng: singlePlace.lng }}
          title={singlePlace.restaurantName}
        />
      )}
    </GoogleMap>
  );
}