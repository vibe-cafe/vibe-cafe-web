'use client';

import { useEffect, useState } from 'react';

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

interface MapViewProps {
  places: Place[];
  userLocation?: { lat: number; lng: number } | null;
}

export default function MapView({ places, userLocation }: MapViewProps) {
  const [isClient, setIsClient] = useState(false);
  const [MapComponent, setMapComponent] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Dynamically import the map component only on client side
    if (typeof window !== 'undefined') {
      import('react-leaflet').then(({ MapContainer, TileLayer, Marker, Popup, useMap }) => {
        import('leaflet').then((L) => {
          // Import CSS dynamically
          if (typeof window !== 'undefined') {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
          }
          
          // Create the map component
          const DynamicMap = () => {
            const validPlaces = places.filter(place => place.latitude && place.longitude);
            
            // Calculate center and bounds from places and user location
            let mapCenter: [number, number] = [39.9042, 116.4074]; // Default to Beijing
            let mapZoom = 12;
            
            // Collect all points to consider (places + user location)
            const allPoints: [number, number][] = [];
            
            // Add places
            validPlaces.forEach(place => {
              allPoints.push([place.latitude!, place.longitude!]);
            });
            
            // Add user location if available
            if (userLocation) {
              allPoints.push([userLocation.lat, userLocation.lng]);
            }
            
            if (allPoints.length > 0) {
              // Calculate center from all points (places + user location)
              const avgLat = allPoints.reduce((sum, point) => sum + point[0], 0) / allPoints.length;
              const avgLng = allPoints.reduce((sum, point) => sum + point[1], 0) / allPoints.length;
              mapCenter = [avgLat, avgLng];
              
              // Set zoom based on number of points
              if (allPoints.length === 1) {
                mapZoom = 15; // Closer zoom for single point
              } else if (allPoints.length <= 3) {
                mapZoom = 14; // Medium zoom for few points
              } else {
                mapZoom = 13; // Wider zoom for many points
              }
            }

            const createCustomIcon = (title: string) => {
              // Debug: Log title to console
              console.log('Creating icon for title:', title);
              return L.default.divIcon({
                className: 'custom-marker',
                html: `
                  <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                  ">
                    <div style="
                      background: rgba(0, 0, 0, 0.8);
                      color: white;
                      padding: 2px 6px;
                      border-radius: 4px;
                      font-size: 10px;
                      font-weight: bold;
                      white-space: nowrap;
                      max-width: 120px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                      margin-bottom: 2px;
                    ">${title || '地点'}</div>
                    <div style="
                      width: 20px;
                      height: 20px;
                      background: white;
                      border: 2px solid black;
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 10px;
                      color: black;
                      font-weight: bold;
                    ">📍</div>
                  </div>
                `,
                iconSize: [24, 40],
                iconAnchor: [12, 20],
              });
            };

            // Component to fit bounds after map loads
            const FitBounds = () => {
              const map = useMap();
              
              useEffect(() => {
                // Collect all points for bounds calculation
                const boundsPoints: [number, number][] = [];
                
                // Add places
                validPlaces.forEach(place => {
                  boundsPoints.push([place.latitude!, place.longitude!]);
                });
                
                // Add user location if available
                if (userLocation) {
                  boundsPoints.push([userLocation.lat, userLocation.lng]);
                }
                
                // Fit bounds if we have multiple points
                if (boundsPoints.length > 1) {
                  const bounds = L.default.latLngBounds(boundsPoints);
                  map.fitBounds(bounds, { padding: [20, 20] });
                }
              }, [map, validPlaces, userLocation]);
              
              return null;
            };

            return (
              <div className="w-full h-[600px] rounded-lg overflow-hidden border border-zinc-700">
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                  className="map-container"
                >
                  {/* 高德地图 - 主要图层 */}
                  <TileLayer
                    url="https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
                    attribution='&copy; <a href="https://www.amap.com/">高德地图</a>'
                    maxZoom={18}
                    subdomains={['1', '2', '3', '4']}
                    errorTileUrl="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlmYTNhNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuaXoOazleWbvueJhzwvdGV4dD48L3N2Zz4="
                  />
                  
                  {/* Auto-fit bounds for multiple points (places + user location) */}
                  {(validPlaces.length > 1 || (validPlaces.length > 0 && userLocation)) && <FitBounds />}
                  
                  {/* User location marker */}
                  {userLocation && (
                    <Marker
                      position={[userLocation.lat, userLocation.lng]}
                      icon={L.default.divIcon({
                        className: 'user-location-marker',
                        html: `
                          <div style="
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            text-align: center;
                          ">
                            <div style="
                              background: rgba(0, 0, 0, 0.8);
                              color: white;
                              padding: 2px 6px;
                              border-radius: 4px;
                              font-size: 10px;
                              font-weight: bold;
                              white-space: nowrap;
                              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                              margin-bottom: 2px;
                            ">你的位置</div>
                            <div style="
                              width: 12px;
                              height: 12px;
                              background: #ef4444;
                              border: 2px solid white;
                              border-radius: 50%;
                              box-shadow: 0 0 0 2px #ef4444;
                            "></div>
                          </div>
                        `,
                        iconSize: [24, 40],
                        iconAnchor: [12, 20],
                      })}
                    >
                      <Popup>
                        <div className="text-black">
                          <strong>您的位置</strong>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                  
                  {/* Place markers */}
                  {validPlaces.map((place) => (
                    <Marker
                      key={place.id}
                      position={[place.latitude!, place.longitude!]}
                      icon={createCustomIcon(place.title)}
                    >
                      <Popup className="custom-popup">
                        <div className="text-black p-4 min-w-64 max-w-80">
                          {/* Image */}
                          {place.image && (
                            <div className="mb-3">
                              <img
                                src={`/images/places/${place.image}`}
                                alt={place.title}
                                className="w-full h-32 object-cover rounded-lg"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          
                          {/* Title with Link Icon */}
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{place.title}</h3>
                            {place.link && (
                              <a
                                href={place.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                title="打开链接"
                              >
                                ↗
                              </a>
                            )}
                          </div>
                          
                          {/* Description */}
                          {place.description && (
                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{place.description}</p>
                          )}
                          
                          {/* Details */}
                          <div className="space-y-2 text-sm">
                            {/* Address */}
                            <div className="flex items-start gap-2">
                              <span className="text-gray-500 mt-0.5">📍</span>
                              <span className="text-gray-700">{place.address_text}</span>
                            </div>
                            
                            {/* Cost */}
                            {place.cost_per_person !== undefined && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">💰</span>
                                <span className="text-gray-700">{place.cost_per_person === 0 ? '免费' : `¥${place.cost_per_person}`}</span>
                              </div>
                            )}
                            
                            {/* Opening Hours */}
                            {place.opening_hours && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">🕒</span>
                                <span className="text-gray-700">{place.opening_hours}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
                
                <style jsx global>{`
                  .map-container {
                    /* Removed grayscale filter to show colors */
                  }
                  
                  .custom-popup .leaflet-popup-content-wrapper {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                    padding: 0;
                  }
                  
                  .custom-popup .leaflet-popup-content {
                    margin: 0;
                    padding: 0;
                  }
                  
                  .custom-popup .leaflet-popup-tip {
                    background: white;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                  }
                  
                  .custom-popup a.leaflet-popup-close-button {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    line-height: 22px;
                    text-align: center;
                    font-size: 16px;
                    font-weight: bold;
                    color: #6b7280;
                    right: 12px;
                    top: 12px;
                  }
                  
                  .custom-marker {
                    background: transparent !important;
                    border: none !important;
                  }
                  
                  .user-location-marker {
                    background: transparent !important;
                    border: none !important;
                  }
                `}</style>
              </div>
            );
          };
          
          setMapComponent(() => DynamicMap);
        });
      });
    }
  }, [places, userLocation]);

  // Show loading state during SSR and initial client load
  if (!isClient || !MapComponent) {
    return (
      <div className="w-full h-[600px] rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900 flex items-center justify-center">
        <div className="text-zinc-400">加载地图中...</div>
      </div>
    );
  }

  return <MapComponent />;
}