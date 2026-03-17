'use client';

import { useState, useEffect } from 'react';
import { MapPlace } from '@/types';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface MapContentProps {
  lat: number;
  lng: number;
  places?: MapPlace[];
}

// 地図を動かすための内部コンポーネント
const MapHandler = ({ selectedPlace }: { selectedPlace: MapPlace | null }) => {
  const map = useMap(); // これで地図のインスタンスを取得
  useEffect(() => {
    if (map && selectedPlace) {
      map.panTo({ lat: selectedPlace.lat!, lng: selectedPlace.lng! });
    }
  }, [map, selectedPlace]);
  return null;
};

export default function MapContent({ lat, lng, places = [] }: MapContentProps) {
  const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID!;
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(places[0]?.id || null);

  const selectedPlace = places.find(p => p.id === selectedPlaceId) || null;

  const handleSlideChange = (swiper: any) => {
    const currentIndex = swiper.realIndex;
    const place = places[currentIndex];
    if (place) {
      setSelectedPlaceId(place.id);
    }
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!}>
      <div className="flex flex-col gap-6">
        <div className="px-2">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={15}
            slidesPerView={1.5}      // 1.8から少し下げて、左右に「次がある感」を出す
            centeredSlides={true}    // 中央配置
            loop={true}              // ループ有効
            loopAdditionalSlides={3} // これを追加：ループ用の複製スライドを増やして欠けを防ぐ
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            onSlideChange={handleSlideChange}
            className="pb-10"
            style={{ overflow: 'visible' }} // 重要：スライダーの親でスライドが切られないようにする
          >
            {places.map((place) => (
              <SwiperSlide key={place.id}>
                <div
                  className={`p-4 rounded-2xl border-2 shadow-sm transition-all duration-500 ${selectedPlaceId === place.id ? 'border-yellow-400 bg-yellow-50 scale-105' : 'border-gray-100 bg-white'
                    }`}
                >
                  <h3 className={`font-bold transition-colors ${selectedPlaceId === place.id ? 'text-yellow-700' : 'text-gray-800'}`}>
                    {place.restaurantName}
                  </h3>
                  <div className="mt-2 text-xs text-gray-400 font-medium">
                    {selectedPlaceId === place.id ? '📍 表示中' : '店舗詳細'}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div style={{ width: '100%', height: '400px', borderRadius: '15px', overflow: 'hidden' }}>
          <Map
            defaultCenter={{ lat, lng }}
            defaultZoom={15}
            mapId={MAP_ID}
            renderingType={'RASTER'}
            disableDefaultUI={false}
          >
            {/* 地図を動かすロジックをここに配置 */}
            <MapHandler selectedPlace={selectedPlace} />

            {places.map((place) => (
              <div key={place.id}>
                <AdvancedMarker
                  position={{ lat: place.lat!, lng: place.lng! }}
                  onClick={() => setSelectedPlaceId(place.id)}
                >
                  <Pin
                    background={selectedPlaceId === place.id ? '#FFD700' : '#EA4335'}
                    scale={selectedPlaceId === place.id ? 1.3 : 1.0}
                    borderColor={selectedPlaceId === place.id ? '#000' : '#B31412'}
                  />
                </AdvancedMarker>

                {selectedPlaceId === place.id && (
                  <InfoWindow position={{ lat: place.lat!, lng: place.lng! }}>
                    <div className="p-1">
                      <p className="text-black font-bold text-sm">{place.restaurantName}</p>
                    </div>
                  </InfoWindow>
                )}
              </div>
            ))}
          </Map>
        </div>


      </div>
    </APIProvider>
  );
}