'use client';
import { MapPlace } from '@/types';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';



interface MapContentProps {
  lat: number;
  lng: number;
  places?: MapPlace[]; // 配列を optional にする場合
}


export default function MapContent({ lat, lng, places }: MapContentProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
  });
  const router = useRouter();
  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '500px' }}
      center={{ lat, lng }}
      zoom={16}
    >
      <Marker position={{ lat, lng }} title="現在地" />
      {places
        ?.filter((place): place is { id: string; restaurantName: string; lat: number; lng: number } =>
          place.lat != null && place.lng != null
        )
        .map((place) => (
          <Marker
            key={place.id}
            position={{
              lat: place.lat,
              lng: place.lng,
            }}
            title={place.restaurantName}
            onClick={() => router.push(`/restaurant/${place.id}`)}
          />
        ))
      }
    </GoogleMap>
  );
}