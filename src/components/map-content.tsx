'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { MapPlace, SingleMapPlace } from '@/types';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
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

  const displayList = useMemo(
    () => (singlePlace ? [singlePlace] : places) as MapPlace[],
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

  const selectedPlace = useMemo(
    () => displayList.find(p => p.id === selectedId) || displayList[0] || null,
    [displayList, selectedId]
  );

  const handleMarkerClick = (id: string, index: number) => {
    setSelectedId(id);
    if (swiperRef.current && originalCount > 1) {
      swiperRef.current.slideToLoop(index);
    }
  };

  if (originalCount === 0) return null;

  return (
    <div className="mb-25">

      <APIProvider apiKey={API_KEY} onLoad={() => setIsApiLoaded(true)}>
        <div className="flex flex-col gap-4">
          {/* MAP */}
          <div className="w-full h-[400px] overflow-hidden shadow-inner bg-gray-100 relative max-md:h-[300px]">
            <Map
              defaultCenter={{ lat, lng }}
              defaultZoom={15}
              mapId={MAP_ID}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
            >
              <MapController selectedPlace={selectedPlace} />

              {/* 現在地 */}
              <AdvancedMarker position={{ lat, lng }}>
                <Pin background={'#4285F4'} glyphColor={'#FFF'} borderColor={'#000'} />
              </AdvancedMarker>

              {/* 店舗ピン一覧 */}
              {!singlePlace && displayList.map((place, index) => (
                <div key={place.id}>
                  <AdvancedMarker
                    position={{ lat: place.lat!, lng: place.lng! }}
                    onClick={() => handleMarkerClick(place.id, index)}
                    zIndex={selectedId === place.id ? 50 : 1}
                  >
                    <Pin
                      background={selectedId === place.id ? '#FFD700' : '#EA4335'}
                      scale={selectedId === place.id ? 1.3 : 1.0}
                      borderColor={'#FFF'}
                    />
                  </AdvancedMarker>

                  {/* InfoWindow (標準の吹き出し) */}
                  {selectedId === place.id && (
                    <AdvancedMarker position={{ lat: place.lat!, lng: place.lng! }} zIndex={100}>
                      <div className="relative">
                        <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 bg-white shadow-lg rounded px-3 py-2 text-xs whitespace-nowrap flex flex-col justify-center">
                          <p className="text-black font-bold text-sm mb-1">
                            {place.restaurantName}
                          </p>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/restaurant/${place.id}`);
                            }}
                            className="text-[10px] bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            詳細を見る
                          </button>

                          {/* 矢印 */}
                          <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-white rotate-45 -translate-x-1/2"></div>
                        </div>
                      </div>
                    </AdvancedMarker>
                  )}
                </div>
              ))}

              {/* 詳細表示用 (Single) */}
              {singlePlace && singlePlace.lat != null && singlePlace.lng != null && (
                <AdvancedMarker position={{ lat: singlePlace.lat, lng: singlePlace.lng }}>
                  <Pin background={'#FFD700'} scale={1.2} />
                </AdvancedMarker>
              )}
            </Map>
          </div>

          {/* SWIPER */}
          <div className="w-full">
            {isApiLoaded && !singlePlace && (
              <Swiper
                key={`swiper-instance-${originalCount}`}
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
                  <SwiperSlide key={`${place.id}-${index}`}>
                    <div
                      onClick={() => {
                        setSelectedId(place.id);
                        router.push(`/restaurant/${place.id}`);
                      }}
                      className={`p-3 h-[200px] cursor-pointer relative overflow-hidden transition-all duration-300 
                      ${selectedId === place.id
                        && 'border-4 border-red-900 shadow-lg'
                        }`}
                    >
                      <Image
                        className="absolute top-0 left-0 object-cover"
                        fill
                        src={place.photoUrl || "/no_image.png"}
                        alt={place.restaurantName || ""}
                      />
                      <p className="font-bold bg-black/60 text-white inset-x-0 px-2 absolute bottom-0 text-center truncate py-1">
                        {place.restaurantName}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </APIProvider>
    </div>
  );
}