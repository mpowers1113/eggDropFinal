import React, { useState, useRef, useCallback, useContext } from "react";
import EggIcon from "../UI/egg-icon";
import MapGL, { Marker, GeolocateControl } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import CreateEgg from "./createEggModal";
import { UserContext } from "../Context/userContext";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibXBvd2VyczExMTMiLCJhIjoiY2t4Mmo3MTl1MWlyNzJucDJ1d2xtZXA4aiJ9.w4OiI4e8mDRubQC-0vJs3g";

const Map = (props) => {
  const user = useContext(UserContext);
  const [eggMarkers, setEggMarkers] = useState([]);
  const [eggLocation, setEggLocation] = useState(null);

  const clearEggData = () => setEggLocation(null);

  const dropEgg = () => {
    setEggMarkers([...eggMarkers, eggLocation]);
    clearEggData();
  };

  const prepareDropHandler = (event) => {
    setEggLocation({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
    });
  };

  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [handleViewportChange]
  );

  return (
    <div className="row">
      {user && (
        <MapGL
          onDblClick={prepareDropHandler}
          ref={mapRef}
          {...viewport}
          width="100vw"
          height="100vh"
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onViewportChange={handleViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        >
          {eggMarkers.map((markers) => (
            <Marker
              key={markers.longitude}
              longitude={markers.longitude}
              latitude={markers.latitude}
            >
              <EggIcon />
            </Marker>
          ))}

          <Geocoder
            mapRef={mapRef}
            onViewportChange={handleGeocoderViewportChange}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            position="top-right"
          />
          <GeolocateControl
            style={{ position: "absolute" }}
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            auto
          />
          {eggLocation !== null && (
            <CreateEgg
              user={user}
              clear={clearEggData}
              eggLocation={eggLocation}
              drop={dropEgg}
            />
          )}
        </MapGL>
      )}
    </div>
  );
};

export default Map;
