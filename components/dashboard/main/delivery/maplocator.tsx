"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

const mapContainerStyle = {
    width: "100%",
    height: "100vh",
    borderRadius: "50px",
};

interface Vessel {
    id: number;
    name: string;
    coordinates: number[];
    path: number[][];
}

interface VesselFeatureProperties {
    name: string;
}

interface TrackLocation {
    longitude: number;
    latitude: number;
}

interface DeliveryProps {
    transactionId: string;
}

interface Destination {
    longloc: number;
    latloc: number;
}

interface VesselFeature extends GeoJSON.Feature<GeoJSON.Point, VesselFeatureProperties> {}

const MapComponent2: React.FC<DeliveryProps> = ({ transactionId }) => {
    const [engineData, setEngineData] = useState<TrackLocation | null>(null);
    const [destination1, setDestination] = useState<Destination | null>(null);
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    const vessels: Vessel[] = [
        {
            id: 1,
            name: "Vessel 1",
            coordinates: [120.970665, 14.613915],
            path: [],
        },
    ];

    const fetchEngineData = async () => {
        const res = await fetch(`/api/delivery/destination?transactionId=${transactionId}`, {
            method: 'POST',
        });
        const data = await res.json();
        setDestination(data);
    };

    useEffect(() => {
        fetchEngineData();
    }, [transactionId]);

    useEffect(() => {
        mapboxgl.accessToken = "pk.eyJ1IjoiZHJlbmRldiIsImEiOiJjbHgwa2t6YjIwMWNzMmtzYTBiZnIzNG53In0.frLf9qdvpp34baFqC_ObCQ";

        if (mapContainer.current && !mapRef.current) {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/streets-v12",
                center: [120.970665, 14.613915],
                zoom: 20,
                maxZoom: 30,
                attributionControl: false,
            });

            map.addControl(new mapboxgl.NavigationControl(), "top-left");
            mapRef.current = map;

            map.on("style.load", () => {
                map.loadImage("https://res.cloudinary.com/hnqdnvduj/image/upload/v1720300857/profile-pictures/xqwugharfggl4sgeqj7f.jpg", (error, image) => {
                    if (error) throw error;

                    if (image) {
                        map.addImage("vessel-marker", image);
                    } else {
                        console.error("Failed to load vessel icon.");
                    }
                });

                map.loadImage("/locationpin.png", (error, image) => {
                    if (error) throw error;

                    if (image) {
                        map.addImage("destination-marker", image);
                    } else {
                        console.error("Failed to load destination icon.");
                    }
                });

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
                            "icon-image": "vessel-marker",
                            "icon-size": 0.3,
                            "icon-allow-overlap": false,
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
                            "line-color": "#BB4747",
                            "line-width": 8,
                        },
                    });

                    vessel.path = [vessel.coordinates];
                });

                map.addSource("destination-source", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: [
                            {
                                type: "Feature",
                                geometry: {
                                    type: "Point",
                                    coordinates: [120.970665, 14.613915],
                                },
                                properties: {
                                    name: "Destination",
                                },
                            },
                        ],
                    },
                });

                map.addLayer({
                    id: "destination-layer",
                    type: "symbol",
                    source: "destination-source",
                    layout: {
                        "icon-image": "destination-marker",
                        "icon-size": 0.05,
                        "icon-allow-overlap": true,
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
            });
        }
    }, []);

    useEffect(() => {
        const fetchEngineLocation = async () => {
            const res = await fetch(`/api/delivery/gatherlocation`, {
                method: 'POST',
                body: JSON.stringify({ id: Number(transactionId) }),
            });
            const data = await res.json();
            setEngineData(data);
        };
        const interval = setInterval(fetchEngineLocation, 100);
        fetchEngineLocation();

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchRoute = async () => {
            if (engineData && destination1) {
                const { longitude, latitude } = engineData;
                const response = await fetch(
                    `https://api.mapbox.com/directions/v5/mapbox/driving/${longitude},${latitude};${destination1.longloc},${destination1.latloc}?geometries=geojson&access_token=${mapboxgl.accessToken}`
                );
                const data = await response.json();
                const route = data.routes[0].geometry;

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
            }
        };

        fetchRoute();
    }, [engineData, destination1]);

    useEffect(() => {
        if (engineData && mapRef.current) {
            const map = mapRef.current;

            vessels.forEach((vessel) => {
                vessel.coordinates = [
                    engineData.longitude,
                    engineData.latitude,
                ];

                const source = map.getSource(`vessel-source-${vessel.id}`) as mapboxgl.GeoJSONSource;

                if (source) {
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
                    ) as mapboxgl.GeoJSONSource;

                    if (lineSource) {
                        vessel.path.push(vessel.coordinates);

                        if (vessel.path.length > 1) {
                            const lineStringFeature: GeoJSON.Feature<
                                GeoJSON.LineString,
                                {}
                            > = {
                                type: "Feature",
                                geometry: {
                                    type: "LineString",
                                    coordinates: vessel.path,
                                },
                                properties: {},
                            };

                            lineSource.setData({
                                type: "FeatureCollection",
                                features: [lineStringFeature],
                            });
                        }
                    }
                }
            });
        }
    }, [engineData]);

    useEffect(() => {
        if (mapRef.current && destination1) {
            const map = mapRef.current;
            map.setCenter([destination1.longloc, destination1.latloc]);

            const source = map.getSource("destination-source") as mapboxgl.GeoJSONSource;
            if (source) {
                source.setData({
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [destination1.longloc, destination1.latloc],
                            },
                            properties: {
                                name: "Destination",
                            },
                        },
                    ],
                });
            }
        }
    }, [destination1]);

    return (
        <div className="flex h-[60rem] md:w-[60rem] pt-15 pl-8 w-full">
            <div ref={mapContainer} style={mapContainerStyle} />
        </div>
    );
};

export default MapComponent2;
