'use client';

import Image from 'next/image';
import { useMemo } from 'react';

type Place = {
  id: string;
  title: string;
  description?: string;
  address_text: string;
  latitude?: number;
  longitude?: number;
  cost_per_person?: number;
  opening_hours?: string;
  link?: string;
  image?: string;
};

interface PlaceCardProps {
  place: Place;
  userLocation?: { lat: number; lng: number } | null;
}

export default function PlaceCard({ place, userLocation }: PlaceCardProps) {
  // Calculate distance if user location is available
  const distance = useMemo(() => {
    if (!userLocation || !place.latitude || !place.longitude) return null;
    
    const R = 6371; // Earth's radius in kilometers
    const dLat = (place.latitude - userLocation.lat) * Math.PI / 180;
    const dLng = (place.longitude - userLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(place.latitude * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;
    
    return distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)}km`;
  }, [place, userLocation]);

  const imagePath = place.image ? `/images/places/${place.image}` : null;

  return (
    <div className="border border-zinc-700 rounded-lg p-6 hover:border-white transition-colors">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        {imagePath && (
          <div className="md:w-48 md:h-32 w-full h-48 relative rounded-lg overflow-hidden bg-zinc-800">
            <Image
              src={imagePath}
              alt={place.title}
              fill
              className="object-cover"
              onError={(e) => {
                // Hide image if it fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Title and Distance */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-white">{place.title}</h3>
              {place.link && (
                <a
                  href={place.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-zinc-300 transition-colors"
                  title="打开链接"
                >
                  ↗
                </a>
              )}
            </div>
            {distance && (
              <span className="text-sm text-zinc-400 bg-zinc-800 px-2 py-1 rounded">
                {distance}
              </span>
            )}
          </div>
          
          {/* Description */}
          {place.description && (
            <p className="text-zinc-300 text-sm leading-relaxed">{place.description}</p>
          )}
          
          {/* Address */}
          <div className="flex items-start gap-2">
            <span className="text-zinc-500 text-sm">📍</span>
            <p className="text-zinc-400 text-sm">{place.address_text}</p>
          </div>
          
          {/* Details Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
            {/* Cost */}
            {place.cost_per_person !== undefined && (
              <div className="flex items-center gap-1">
                <span>💰</span>
                <span>{place.cost_per_person === 0 ? '免费' : `¥${place.cost_per_person}`}</span>
              </div>
            )}
            
            {/* Opening Hours */}
            {place.opening_hours && (
              <div className="flex items-center gap-1">
                <span>🕒</span>
                <span>{place.opening_hours}</span>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
