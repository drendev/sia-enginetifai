"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSession } from "next-auth/react";

interface DeliveryProps {
  transactionId: number;
}

interface Destination {
  longloc: number;
  latloc: number;
}

interface DirectionStep {
  distance: number;
  duration: number;
  instruction: string;
}

const MapboxExample: React.FC<DeliveryProps> = ({ transactionId }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userPath = useRef<GeoJSON.Position[]>([]);

  const { data: session } = useSession();
  const user = session?.user?.username;

  const [coordinates, setCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);
  const [destination1, setDestination] = useState<Destination | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const [directionSteps, setDirectionSteps] = useState<DirectionStep[]>([]);

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

  const fetchEngineData = async () => {
    try {
      const res = await fetch(`/api/delivery/destination?transactionId=${transactionId}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setDestination(data);
    } catch (error) {
      console.error('Failed to fetch destination:', error);
    }
  };

  useEffect(() => {
    fetchEngineData();
  }, [transactionId]);

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

        }
      });

      // Update the user's location and path
      geolocateControl.on('geolocate', (event) => {
        const e = event as unknown as { coords: GeolocateResult['coords'] };
        if (!e.coords) return; // handle the case where coords might be undefined

        const { longitude, latitude } = e.coords;

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
    const submitCoordinates = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(`/api/delivery/deliverylocation?transactionId=${transactionId}&latitude=${latitude}&longitude=${longitude}`, {
          method: 'POST',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Failed to submit coordinates:', error);
      }
    };

    const interval = setInterval(() => {
      if (coordinates) {
        submitCoordinates(coordinates.latitude, coordinates.longitude);
      }
    }, 100); // Updated interval to 5 seconds

    return () => clearInterval(interval);
  }, [coordinates, user, transactionId]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (coordinates && destination1) {
        const { latitude, longitude } = coordinates;

        try {
          const response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${longitude},${latitude};${destination1.longloc},${destination1.latloc}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
          );
          if (!response.ok) throw new Error('Failed to fetch route');
          const data = await response.json();
          const route = data.routes[0].geometry;
          const eta = data.routes[0].duration; // Duration in seconds

          setEta(eta);

          // Extracting step-by-step directions
          const steps = data.routes[0].legs[0].steps.map((step: any) => ({
            distance: step.distance,
            duration: step.duration,
            instruction: step.maneuver.instruction,
          }));
          setDirectionSteps(steps);

          if (mapRef.current && route) {
            const map = mapRef.current;
            const routeSource = map.getSource('route') as mapboxgl.GeoJSONSource;

            if (routeSource) {
              routeSource.setData({
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    geometry: route,
                    properties: {},
                  },
                ],
              });
            } else {
              map.addSource("route", {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  features: [
                    {
                      type: "Feature",
                      geometry: route,
                      properties: {},
                    },
                  ],
                },
              });

              map.addLayer({
                id: "route",
                type: "line",
                source: "route",
                layout: {
                  "line-join": "round",
                  "line-cap": "round",
                },
                paint: {
                  "line-color": "#BB4747",
                  "line-width": 6,
                },
              });
            }
          }
        } catch (error) {
          console.error('Failed to fetch route:', error);
        }
      }
    };

    fetchRoute();
  }, [coordinates, destination1]);

  const formatETA = (eta: number) => {
    const minutes = Math.floor(eta / 60);
    const seconds = Math.floor(eta % 60);
    return `${minutes} min ${seconds} sec`;
  };

  return (
    <div>
      <div id="map" ref={mapContainerRef} style={{ height: '100vh', width: '100%' }}></div>
      <div className='mt-16' style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
        <h2>Mapbox Directions</h2>
        {destination1 && (
          <p>Destination: {destination1.latloc}, {destination1.longloc}</p>
        )}
        {eta !== null && (
          <p>Estimated Time of Arrival: {formatETA(eta)}</p>
        )}
        {directionSteps.length > 0 && (
          <div>
            <h3>Directions:</h3>
            <ul>
              {directionSteps.map((step, index) => (
                <li key={index}>
                  {step.instruction} ({Math.round(step.distance)} m, {Math.round(step.duration)} sec)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapboxExample;
