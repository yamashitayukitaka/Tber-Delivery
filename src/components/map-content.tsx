'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPlace } from '@/types';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface MapContentProps {
  lat: number;
  lng: number;
  places?: MapPlace[];
  singlePlace?: MapPlace;
}

const MapController = ({ selectedPlace }: { selectedPlace: MapPlace | null }) => {
  const map = useMap();
  useEffect(() => {
    if (map && selectedPlace) {
      map.panTo({ lat: selectedPlace.lat!, lng: selectedPlace.lng! });
    }
  }, [map, selectedPlace]);
  return null;
};

export default function MapContent({ lat, lng, places = [], singlePlace }: MapContentProps) {
  const router = useRouter();
  const swiperRef = useRef<SwiperType | null>(null);
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;
  const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID!;

  // singlePlaceがあればそれを初期値に、なければplacesの1番目
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (singlePlace) {
      setSelectedId(singlePlace.id);
    } else if (places.length > 0) {
      setSelectedId(places[0].id);
    }
  }, [singlePlace, places]);

  const selectedPlace = singlePlace || places.find(p => p.id === selectedId) || null;

  const handleSlideChange = (swiper: SwiperType) => {
    const activePlace = places[swiper.realIndex];
    if (activePlace) {
      setSelectedId(activePlace.id);
    }
  };

  const handleMarkerClick = (id: string, index: number) => {
    setSelectedId(id);
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(index);
    }
  };

  return (
    <>
      <h3 className="text-center font-bold text-[32px] max-md:text-[24px]">近くのお店を地図から探す</h3>
      <APIProvider apiKey={API_KEY}>
        <div className="flex flex-col gap-4">
          {/* 地図エリア */}
          <div style={{ width: '100%', height: '400px', borderRadius: '15px', overflow: 'hidden' }}>
            <Map
              defaultCenter={selectedPlace ? { lat: selectedPlace.lat!, lng: selectedPlace.lng! } : { lat, lng }}
              defaultZoom={15}
              mapId={MAP_ID}
              gestureHandling={'greedy'}
            >
              <MapController selectedPlace={selectedPlace} />

              {/* 現在地 */}
              <AdvancedMarker position={{ lat, lng }} title="現在地">
                <Pin background={'#4285F4'} glyphColor={'#FFF'} borderColor={'#000'} />
              </AdvancedMarker>

              {/* 条件分岐 A: 一覧表示の場合（複数マーカー） */}
              {!singlePlace && places.map((place, index) => (
                place.lat != null && place.lng != null && (
                  <div key={place.id}>
                    <AdvancedMarker
                      position={{ lat: place.lat, lng: place.lng }}
                      onClick={() => handleMarkerClick(place.id, index)}
                    >
                      <Pin
                        background={selectedId === place.id ? '#FFD700' : '#EA4335'}
                        scale={selectedId === place.id ? 1.3 : 1.0}
                      />
                    </AdvancedMarker>
                    {selectedId === place.id && (
                      <InfoWindow position={{ lat: place.lat, lng: place.lng }}>
                        <div className="p-1 flex flex-col items-center">
                          <p className="text-black font-bold text-sm mb-1">{place.restaurantName}</p>
                          <button
                            onClick={() => router.push(`/restaurant/${place.id}`)}
                            className="text-[10px] bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            詳細を見る
                          </button>
                        </div>
                      </InfoWindow>
                    )}
                  </div>
                )
              ))}

              {/* 条件分岐 B: 詳細表示の場合（単体マーカー） */}
              {singlePlace && singlePlace.lat != null && singlePlace.lng != null && (
                <AdvancedMarker position={{ lat: singlePlace.lat, lng: singlePlace.lng }}>
                  <Pin background={'#FFD700'} scale={1.2} />
                </AdvancedMarker>
              )}
            </Map>
          </div>

          {/* 下部パネルエリア */}
          {singlePlace ? (
            // C: singlePlace（詳細画面）の時の表示
            <div className="px-4">
              <div className="p-4 rounded-2xl border-2 border-yellow-40">
                <h3 className="font-bold text-xl text-gray-800">{singlePlace.restaurantName}</h3>
                <p className="text-sm text-gray-500 mt-1">📍 現在この店舗を表示中</p>
              </div>
            </div>
          ) : (
            // D: places（一覧画面）の時のSwiper表示
            places.length > 0 && (
              <div className="px-4">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={12}
                  slidesPerView={4}
                  centeredSlides={true}
                  loop={true}
                  onSwiper={(swiper) => (swiperRef.current = swiper)}
                  onSlideChange={handleSlideChange}
                  className="pb-8"
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                >
                  {places.map((place) => (
                    <SwiperSlide key={place.id}>
                      <div
                        onClick={() => router.push(`/restaurant/${place.id}`)}
                        className={`p-3 border  cursor-pointer transition-all duration-300 hover:opacity-60 ${selectedId === place.id ? 'border-red-900 border-4' : 'border-gray-200 bg-white'
                          }`}
                      >
                        <h3 className="font-bold text-sm text-gray-800 truncate text-center">{place.restaurantName}</h3>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )
          )}
        </div>
      </APIProvider>
    </>
  );
}