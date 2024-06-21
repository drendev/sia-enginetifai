"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaArrowRight, FaUser, FaEnvelope } from "react-icons/fa";
import mapboxgl, { GeoJSONSource, Layer, Map } from "mapbox-gl";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [packages, setPackages] = useState<any>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [engineName, setEngineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [place, setPlace] = useState("");
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);

  const vessels: Vessel[] = [
    {
      id: 1,
      name: "Vessel 1",
      coordinates: [120.970665, 14.613915],
      path: [],
    },
  ];

  useEffect(() => {
    if (trackingNumber.trim() !== "") {
      setTransactionHistory((prevHistory) => [
        ...prevHistory,
        {
          trackingNumber,
          date: new Date().toLocaleString(),
          action: "Added",
        },
      ]);
    }
  }, [trackingNumber]);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZHJlbmRldiIsImEiOiJjbHgwa2t6YjIwMWNzMmtzYTBiZnIzNG53In0.frLf9qdvpp34baFqC_ObCQ";

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

                map.on("load", function () {
                  map.addLayer({
                    id: "3d-buildings",
                    source: "composite",
                    "source-layer": "building",
                    filter: ["==", "extrude", "true"],
                    type: "fill-extrusion",
                    minzoom: 15,
                    paint: {
                      "fill-extrusion-color": "#aaa",
                      "fill-extrusion-height": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        15,
                        0,
                        15.05,
                        ["get", "height"],
                      ],
                      "fill-extrusion-base": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        15,
                        0,
                        15.05,
                        ["get", "min_height"],
                      ],
                      "fill-extrusion-opacity": 0.5,
                    },
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

              const lineSource = map.getSource(`vessel-line-source-${vessel.id}`) as mapboxgl.GeoJSONSource;
              if (lineSource) {
                vessel.path.push(newFeature);

                const lineStringFeature: GeoJSON.Feature<
                  GeoJSON.LineString,
                  {}
                > = {
                  type: "Feature",
                  geometry: {
                    type: "LineString",
                    coordinates: vessel.path.map(
                      (f) => f.geometry.coordinates
                    ),
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
        }, 1000); 
      });

      return () => map.remove();
    }
  }, []);

  const handleSearch = () => {
    console.log("Search triggered with term:", searchTerm);

    if (searchTerm.trim() !== "") {
      const mockPackage = {
        trackingNumber: searchTerm,
        departureDate: "2024-06-21",
        arrivalDate: "2024-06-22",
        customerName: "Mr. Ryuji Mori",
        engineName: "Engine Kananamanhahaha",
        quantity: 1,
        driverName: "Kuya Roel",
      };
      setPackages(mockPackage);
    } else {
      setPackages({});
    }
  };

  const handleAddButtonClick = () => {
    setShowAddForm(true);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newPackage = {
      trackingNumber,
      departureDate: "2024-06-21",
      arrivalDate: "2024-06-22",
      customerName: "Mr. Ryuji Mori",
      engineName,
      quantity: parseInt(quantity),
      driverName: "Kuya Roel",
    };

    setPackages(newPackage);

    setTrackingNumber("");
    setEngineName("");
    setQuantity("");
    setPlace("");
    setShowAddForm(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-auto p-4 w-full">
      <div className="flex flex-col md:w-1/2 h-[20rem] p-4 w-full dark:bg-black bg-gradient-to-r from-red-300 via-red-500 to-red-700">
        <div className="relative mb-4 dark:bg-gray-800 bg-white rounded-2xl shadow-md">
          <div className="flex items-center">
            <FaSearch className="absolute left-3 top-3 text-gray-700 dark:text-gray-300 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="p-2 pl-10 pr-12 border border-gray-300 dark:border-gray-700 rounded-2xl dark:bg-gray-800 dark:text-white focus:outline-none w-full"
            />
            <button
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded-r text-gray-800 dark:text-gray-300"
              onClick={handleSearch}
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        <div className="dark:bg-gray-900 bg-red-200 rounded-lg p-4 shadow-md mb-4">
          <div className="flex items-center mb-2">
            <input
              type="text"
              placeholder="Enter tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none flex-grow mr-2"
            />
            <button
              className="flex items-center p-2 bg-black text-white rounded-lg"
              onClick={handleAddButtonClick}
            >
              <FaArrowRight className="mr-2" />
              Add
            </button>
          </div>
          <p className="text-sm text-gray-200">Add a new package</p>
        </div>

        <div className="bg-gradient-to-r from-red-100 via-red-300 to-red-500 rounded-lg p-4 shadow-md mb-4">
          <div className="mb-2">
            <p className="text-lg font-semibold">{packages.trackingNumber}</p>
            <hr className="my-2 border-gray-400 dark:border-gray-700" />
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2">
                <p>
                  <span className="font-semibold">Departure Date:</span>{" "}
                  {packages.departureDate}
                </p>
                <p>
                  <span className="font-semibold">Arrival Date:</span>{" "}
                  {packages.arrivalDate}
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <p>
                  <span className="font-semibold">Customer Name:</span>{" "}
                  {packages.customerName}
                </p>
                <p>
                  <span className="font-semibold">Engine Name:</span>{" "}
                  {packages.engineName}
                </p>
                <p>
                  <span className="font-semibold">Quantity:</span>{" "}
                  {packages.quantity}
                </p>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <FaUser className="text-gray-500 dark:text-gray-300 mr-2" />
              <p>{packages.driverName}</p>
              <button className="ml-auto flex items-center bg-black text-white p-2 rounded-lg">
                <FaEnvelope className="mr-2" />
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History card */}
      <div className="bg-gradient-to-r from-red-100 via-red-300 to-red-500 rounded-lg p-4 shadow-md mb-4">
        <div className="mb-2">
          <p className="text-lg font-semibold">Transaction History</p>
          <hr className="my-2 border-gray-400 dark:border-gray-700" />
          <div className="max-h-40 overflow-y-auto">
            {transactionHistory.length > 0 ? (
              transactionHistory.map((transaction, index) => (
                <div key={index} className="mb-2">
                  <p>
                    <span className="font-semibold">Tracking Number:</span>{" "}
                    {transaction.trackingNumber}
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {transaction.date}
                  </p>
                  <p>
                    <span className="font-semibold">Action:</span>{" "}
                    {transaction.action}
                  </p>
                  <hr className="my-2 border-gray-400 dark:border-gray-700" />
                </div>
              ))
            ) : (
              <p>No transactions found.</p>
            )}
          </div>
        </div>
      </div>

        {/*Add New package Modal */}
        {showAddForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Add a New Package</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Engine Name"
                    value={engineName}
                    onChange={(e) => setEngineName(e.target.value)}
                    className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Place"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w-full"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div ref={mapContainer} className="md:w-1/2 h-[20rem] w-full" />
    </div>
  );
};

export default MapComponent;

             
