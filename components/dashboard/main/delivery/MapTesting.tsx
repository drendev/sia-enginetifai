"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl, { GeoJSONSourceRaw } from "mapbox-gl";

interface MovingObject {
  id: number;
  name: string;
  coordinates: number[];
}

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

  const movingObjects: MovingObject[] = [
    // Define your moving objects here
  ];

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoiZHJlbmRldiIsImEiOiJjbHgwa2t6YjIwMWNzMmtzYTBiZnIzNG53In0.frLf9qdvpp34baFqC_ObCQ";

    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-74.0060152, 40.7127281],
        zoom: 5,
        maxZoom: 15,
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      return () => map.remove();
    }
  }, []);

  return (
    <div className="flex w-40 h-40">
    <div
      ref={mapContainer}
      style={{ position: "relative", top: 0, bottom: 0, width: "10", height: "10"}}
    />
    </div>
  );
};

export default MapComponent;