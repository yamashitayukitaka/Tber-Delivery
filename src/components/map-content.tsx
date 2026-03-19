'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { MapPlace, SingleMapPlace } from '@/types';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow, // 追加
  useMap
} from '@vis.gl/react-google-maps';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from "next/image";

interface MapContentProps {
  lat: number;
  lng: number;
  places?: MapPlace[];
  singlePlace?: SingleMapPlace;
}

const MapController = ({ selectedPlace }: { selectedPlace: MapPlace | null }) => {
  const map = useMap();
  useEffect(() => {
    if (map && selectedPlace?.lat != null && selectedPlace?.lng != null) {
      map.panTo({ lat: selectedPlace.lat, lng: selectedPlace.lng });
    }
  }, [map, selectedPlace]);
  return null;
};

export default function MapContent({ lat, lng, places = [], singlePlace }: MapContentProps) {
  const router = useRouter();
  const swiperRef = useRef<SwiperType | null>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
  const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID || '';

  const displayList = useMemo(() =>
    (singlePlace ? [singlePlace] : places) as MapPlace[], // ここで「MapPlaceの配列だ」と言い切る
    [singlePlace, places]
  );
  const originalCount = displayList.length;

  const swiperItems = useMemo(() => {
    if (originalCount > 1 && originalCount < 10) {
      return [...displayList, ...displayList, ...displayList];
    }
    return displayList;
  }, [displayList, originalCount]);

  useEffect(() => {
    if (originalCount > 0 && !selectedId) {
      setSelectedId(displayList[0].id);
    }
  }, [displayList, originalCount, selectedId]);

  const selectedPlace = useMemo(() =>
    displayList.find(p => p.id === selectedId) || displayList[0] || null
    , [displayList, selectedId]);

  const handleMarkerClick = (id: string, index: number) => {
    setSelectedId(id);
    if (swiperRef.current && originalCount > 1) {
      swiperRef.current.slideToLoop(index);
    }
  };

  if (originalCount === 0) return null;

  return (
    <>
      <h3 className="flex justify-center items-center font-bold text-[32px] max-md:text-[24px] h-[100px]">
        {singlePlace ? "お店の場所を確認する" : "近くのお店を地図から探す"}
      </h3>

      <APIProvider apiKey={API_KEY} onLoad={() => setIsApiLoaded(true)}>
        <div className="flex flex-col gap-4">
          <div className="w-full h-[400px] rounded-[15px] overflow-hidden shadow-inner bg-gray-100">
            <Map defaultCenter={{ lat, lng }} defaultZoom={16} mapId={MAP_ID} gestureHandling={'greedy'}>
              <MapController selectedPlace={selectedPlace} />

              <AdvancedMarker position={{ lat, lng }}>
                <Pin background={'#4285F4'} glyphColor={'#FFF'} borderColor={'#000'} />
              </AdvancedMarker>

              {/* レストランマーカーとInfoWindowの連動 */}
              {!singlePlace && displayList.map((place, index) => (
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

                    {/* スライドに連動して開くInfoWindow */}
                    {selectedId === place.id && (
                      <InfoWindow
                        position={{ lat: place.lat, lng: place.lng }}
                        onCloseClick={() => setSelectedId(null)}
                      >
                        <div className="p-1 flex flex-col items-center">
                          <p className="text-black font-bold text-sm mb-1 whitespace-nowrap">{place.restaurantName}</p>
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

              {/* 詳細表示用マーカー */}
              {singlePlace && singlePlace.lat != null && singlePlace.lng != null && (
                <AdvancedMarker position={{ lat: singlePlace.lat, lng: singlePlace.lng }}>
                  <Pin background={'#FFD700'} scale={1.2} />
                </AdvancedMarker>
              )}
            </Map>
          </div>

          <div className="w-full">
            {isApiLoaded && !singlePlace && (
              <div className="px-4">
                <Swiper
                  key={`swiper-v6-${originalCount}`}
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={12}
                  slidesPerView={1.2}
                  breakpoints={{
                    640: { slidesPerView: 2.2 },
                    1024: { slidesPerView: 4 }
                  }}
                  centeredSlides={true}
                  loop={originalCount > 1}
                  autoplay={originalCount > 1 ? {
                    delay: 3000,
                    disableOnInteraction: false,
                  } : false}
                  onSwiper={(swiper) => (swiperRef.current = swiper)}
                  onSlideChange={(swiper) => {
                    const idx = swiper.realIndex % originalCount;
                    const activePlace = displayList[idx];
                    if (activePlace && selectedId !== activePlace.id) {
                      setSelectedId(activePlace.id);
                    }
                  }}
                  className="pb-8 w-full"
                >
                  {swiperItems.map((place, index) => (
                    <SwiperSlide key={`${place.id}-${index}`} className="h-auto">
                      <div
                        onClick={() => {
                          setSelectedId(place.id);
                          router.push(`/restaurant/${place.id}`);
                        }}
                        className={`p-3 h-[250px] cursor-pointer transition-all duration-300 relative z-20 overflow-hidden hover:opacity-60
                          ${selectedId === place.id
                            ? 'border-4 border-red-900 shadow-lg'
                            : 'border border-gray-200 opacity-100'}`}
                      >
                        <Image
                          className="absolute z-0 top-0 left-0 object-cover"
                          fill
                          src={place.photoUrl || "/placeholder-restaurant.jpg"}
                          priority
                          alt={place.restaurantName || ""}
                        />
                        <p className="font-bold bg-black/60 text-white w-full px-2 absolute z-20 bottom-0 left-0 text-center truncate">
                          {place.restaurantName}
                        </p>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        </div>
      </APIProvider>
    </>
  );
}