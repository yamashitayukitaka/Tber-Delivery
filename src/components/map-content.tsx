'use client';

import { MapPlace } from '@/types';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap
} from '@vis.gl/react-google-maps';
import { useRouter } from 'next/navigation';

interface MapContentProps {
  lat: number;
  lng: number;
  places?: MapPlace[];
  singlePlace?: MapPlace;
}

export default function MapContent({ lat, lng, places, singlePlace }: MapContentProps) {
  const router = useRouter();
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;
  const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID!; // 高度なマーカーには Map ID が必須です

  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{ width: '100%', height: '500px' }}>
        <Map
          defaultCenter={{ lat, lng }}
          defaultZoom={15}
          mapId={MAP_ID} // 必須
          gestureHandling={'greedy'}
          disableDefaultUI={false}
        >
          {/* 現在地（青いドットなどで区別可能） */}
          <AdvancedMarker position={{ lat, lng }} title="現在地">
            <Pin background={'#4285F4'} glyphColor={'#000'} borderColor={'#000'} />
          </AdvancedMarker>

          {/* 複数の場所 */}
          {places?.map((place) => (
            place.lat != null && place.lng != null && (
              <AdvancedMarker
                key={place.id}
                position={{ lat: place.lat, lng: place.lng }}
                title={place.restaurantName}
                onClick={() => router.push(`/restaurant/${place.id}`)}
              >
                <Pin background={'#EA4335'} borderColor={'#B31412'} glyphColor={'#000'} />
              </AdvancedMarker>
            )
          ))}

          {/* 単体の場所 */}
          {singlePlace?.lat != null && singlePlace?.lng != null && (
            <AdvancedMarker
              position={{ lat: singlePlace.lat, lng: singlePlace.lng }}
              title={singlePlace.restaurantName}
            />
          )}
        </Map>
      </div>
    </APIProvider>
  );
}