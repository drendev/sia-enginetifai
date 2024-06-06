    "use client";
    import React, { useEffect, useRef } from "react";
    import mapboxgl, { GeoJSONSourceRaw, Layer, Map } from "mapbox-gl";

    interface Vessel {
    id: number;
    name: string;
    coordinates: number[];
    path: VesselFeature[];
    }

    interface VesselFeatureProperties {
    name: string;
    }

    interface VesselFeature
    extends GeoJSON.Feature<GeoJSON.Point, VesselFeatureProperties> {}

    const MapComponent: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const vessels: Vessel[] = [
        {
        id: 1,
        name: "Vessel 1",
        coordinates: [120.970665, 14.613915],
        path: [],
        },

    ];

    useEffect(() => {
        mapboxgl.accessToken = "pk.eyJ1IjoiZHJlbmRldiIsImEiOiJjbHgwa2t6YjIwMWNzMmtzYTBiZnIzNG53In0.frLf9qdvpp34baFqC_ObCQ";

        if (mapContainer.current) {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [120.970665, 14.613915],
            zoom: 20,
            maxZoom: 30,
            attributionControl: false,
        });
        

        map.addControl(new mapboxgl.NavigationControl(), "top-left");

        map.on("style.load", () => {
            map.loadImage(
            "https://res.cloudinary.com/hnqdnvduj/image/upload/v1716195724/profile-pictures/llwdpvszpresxczvxp5b.jpg",
            (error, image) => {
                if (error) throw error;

                if (image) {
                map.addImage("custom-marker", image);

                vessels.forEach((vessel) => {
                    map.addSource(`vessel-source-${vessel.id}`, {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: [],
                    },
                    });

                    map.addLayer({
                    id: `vessel-layer-${vessel.id}`,
                    type: "symbol",
                    source: `vessel-source-${vessel.id}`,
                    layout: {
                        "icon-image": "custom-marker",
                        "icon-size": 0.3, 
                        "icon-allow-overlap": true,
                    },
                    });

                    map.addSource(`vessel-line-source-${vessel.id}`, {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: [],
                    },
                    });

                    map.addLayer({
                    id: `vessel-line-layer-${vessel.id}`,
                    type: "line",
                    source: `vessel-line-source-${vessel.id}`,
                    paint: {
                        "line-color": "#ff0000",
                        "line-width": 2,
                    },
                    });
                    
                    map.on('load', function () {

                        map.addLayer({
                          id: '3d-buildings',
                          source: 'composite',
                          'source-layer': 'building',
                          filter: ['==', 'extrude', 'true'],
                          type: 'fill-extrusion',
                          minzoom: 15,
                          paint: {
                            'fill-extrusion-color': '#aaa',
                            'fill-extrusion-height': [
                              'interpolate',
                              ['linear'],
                              ['zoom'],
                              15,
                              0,
                              15.05,
                              ['get', 'height']
                            ],
                            'fill-extrusion-base': [
                              'interpolate',
                              ['linear'],
                              ['zoom'],
                              15,
                              0,
                              15.05,
                              ['get', 'min_height']
                            ],
                            'fill-extrusion-opacity': 0.5
                          }
                        });
                      });

                    vessel.path = [
                    {
                        type: "Feature",
                        geometry: {
                        type: "Point",
                        coordinates: vessel.coordinates,
                        },
                        properties: {
                        name: vessel.name,
                        },
                    },
                    ];
                });
                } else {
                console.error("Failed to load the custom image.");
                }
            }
            );

            setInterval(() => {
            vessels.forEach((vessel) => {
                vessel.coordinates = [
                vessel.coordinates[0] + 0.00001 * Math.random(),
                vessel.coordinates[1] + 0.00001 * Math.random(),
                ];

                const source = map.getSource(`vessel-source-${vessel.id}`);

                if (source && source.type === "geojson") {
                const newFeature: VesselFeature = {
                    type: "Feature",
                    geometry: {
                    type: "Point",
                    coordinates: vessel.coordinates,
                    },
                    properties: {
                    name: vessel.name,
                    },
                };

                source.setData({
                    type: "FeatureCollection",
                    features: [newFeature],
                });

                const lineSource = map.getSource(
                    `vessel-line-source-${vessel.id}`
                );
                if (lineSource && lineSource.type === "geojson") {

                    vessel.path.push(newFeature);

                    const lineStringFeature: GeoJSON.Feature<
                    GeoJSON.LineString,
                    {}
                    > = {
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: vessel.path.map((f) => f.geometry.coordinates),
                    },
                    properties: {},
                    };

                    lineSource.setData({
                    type: "FeatureCollection",
                    features: vessel.path.length > 1 ? [lineStringFeature] : [],
                    });
                }
                }
            });
            }, 1000); // Update every 20 seconds
        });

        return () => map.remove();
        }
    }, []);

    return (
        <div className="flex h-[20rem] md:w-[30rem] p-4 w-full">
        <div
        ref={mapContainer}
        style={{ width: "100%", height: "100%"}}
        />
        </div>
    );
    };

    export default MapComponent;