"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSession } from "next-auth/react";

const MapboxExample: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userPath = useRef<GeoJSON.Position[]>([]);

  const { data: session } = useSession();
  const user = session?.user?.username;

  const [coordinates, setCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);

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
        console.log(`Current coordinates: Latitude: ${latitude}, Longitude: ${longitude}`); // Log the coordinates

        setCoordinates({ latitude, longitude });

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

  useEffect(() => {
    const interval = setInterval(() => {
      // The coordinates state will automatically update every second if changed
    }, 1000);
    return () => clearInterval(interval);
  }, [coordinates]);

  return (
    <div>
      <div id="map" ref={mapContainerRef} style={{ height: '100vh', width: '100%' }}></div>
      <div className='mt-16' style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
        {coordinates ? (
          <div>
            <p>Latitude: {coordinates.latitude}</p>
            <p>Longitude: {coordinates.longitude}</p>
          </div>
        ) : (
          <p>Fetching location...</p>
        )}
      </div>
    </div>
  );
};

export default MapboxExample;
