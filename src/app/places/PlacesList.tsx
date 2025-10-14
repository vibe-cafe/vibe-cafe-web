'use client';

import { useState, useMemo, useEffect } from 'react';
import PlaceCard from './PlaceCard';
import MapView from './MapView';

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

type SortOption = 'name' | 'distance';

interface PlacesListProps {
  places: Place[];
}

type ViewMode = 'list' | 'map';

export default function PlacesList({ places }: PlacesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [locationRequested, setLocationRequested] = useState(false);

  // Filter places based on search query
  const filteredPlaces = useMemo(() => {
    if (!searchQuery.trim()) return places;
    
    const query = searchQuery.toLowerCase().trim();
    return places.filter((place) => {
      const title = place.title.toLowerCase();
      const description = place.description?.toLowerCase() || '';
      const address = place.address_text.toLowerCase();
      return title.includes(query) || description.includes(query) || address.includes(query);
    });
  }, [places, searchQuery]);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Sort places
  const sortedPlaces = useMemo(() => {
    const placesToSort = [...filteredPlaces];
    
    if (sortBy === 'name') {
      return placesToSort.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
    } else if (sortBy === 'distance' && userLocation) {
      return placesToSort.sort((a, b) => {
        if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) return 0;
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude);
        return distA - distB;
      });
    }
    
    return placesToSort;
  }, [filteredPlaces, sortBy, userLocation]);

  // Get user location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setSortBy('distance');
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('无法获取位置信息，请检查浏览器权限设置');
        }
      );
    } else {
      alert('您的浏览器不支持地理位置功能');
    }
  };

  // Auto-request location on component mount
  useEffect(() => {
    if (!locationRequested && navigator.geolocation) {
      setLocationRequested(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location not available:', error.message);
          // Don't show alert for automatic location request
        }
      );
    }
  }, [locationRequested]);

  return (
    <div className="space-y-6">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="搜索地点..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-white"
          />
        </div>
        
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex bg-zinc-900 border border-zinc-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 text-sm rounded transition-colors cursor-pointer ${
                viewMode === 'map' 
                  ? 'bg-white text-black' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              地图
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded transition-colors cursor-pointer ${
                viewMode === 'list' 
                  ? 'bg-white text-black' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              列表
            </button>
          </div>
          
          {viewMode === 'list' && (
            <>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-white"
              >
                <option value="distance">按距离排序</option>
                <option value="name">按名称排序</option>
              </select>
              
              {!userLocation && (
                <button
                  onClick={handleGetLocation}
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  获取位置
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Results Count - Only show when there's a search query */}
      {searchQuery.trim() && (
        <div className="text-zinc-400 text-sm">
          找到 {sortedPlaces.length} 个地点
        </div>
      )}

      {/* Content based on view mode */}
      {viewMode === 'list' ? (
        <>
          {/* Places List */}
          <div className="space-y-4">
            {sortedPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} userLocation={userLocation} />
            ))}
          </div>

          {sortedPlaces.length === 0 && (
            <div className="text-center py-12 text-zinc-400">
              <p>没有找到匹配的地点</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Map View */}
          <MapView places={filteredPlaces} userLocation={userLocation} />
          
          {filteredPlaces.length === 0 && (
            <div className="text-center py-12 text-zinc-400">
              <p>没有找到匹配的地点</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
