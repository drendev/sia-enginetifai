import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapboxExample: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userPath = useRef<GeoJSON.Position[]>([]);

  // Define the type for geolocation result
  interface GeolocateResult {
    coords: {
      latitude: number;
      longitude: number;
      altitude?: number;
      accuracy: number;
      altitudeAccuracy?: number;
      heading?: number;
      speed?: number;
    };
    timestamp: number;
  }

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZHJlbmRldiIsImEiOiJjbG9yY2s4cHkwcGdkMmpuMHQwdDR0M2NuIn0.tcSIczUaEaDGwm_SA6gh_w';

    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-24, 42],
        zoom: 1
      });

      // Add geolocate control to the map.
      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      });

      mapRef.current.addControl(geolocateControl);

      // Add a source and layer for the user's path
      mapRef.current.on('load', () => {
        if (mapRef.current) {
          mapRef.current.addSource('user-path', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: []
            }
          });

          mapRef.current.addLayer({
            id: 'user-path-layer',
            type: 'line',
            source: 'user-path',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#007cbf',
              'line-width': 4
            }
          });
        }
      });

      // Update the user's location and path
      geolocateControl.on('geolocate', (event) => {
        const e = event as unknown as { coords: GeolocateResult['coords'] };
        if (!e.coords) return; // handle the case where coords might be undefined

        const { longitude, latitude } = e.coords;
        const newCoords: GeoJSON.Position = [longitude, latitude];
        userPath.current.push(newCoords);

        const lineStringFeature: GeoJSON.Feature<GeoJSON.LineString> = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: userPath.current
          },
          properties: {}
        };

        const source = mapRef.current?.getSource('user-path') as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData({
            type: 'FeatureCollection',
            features: [lineStringFeature]
          });
        }
      });

      return () => {
        mapRef.current?.remove();
      };
    }
  }, []);

  return <div id="map" ref={mapContainerRef} style={{ height: '100vh', width: '100%' }}></div>;
};

export default MapboxExample;
