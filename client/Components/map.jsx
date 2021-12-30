import React, {
  useState,
  useRef,
  useCallback,
  useContext,
  useEffect,
} from "react";
import EggIcon from "../UI/egg-icon";
import MapGL, { Marker, GeolocateControl } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import CreateEgg from "./createEggModal";
import { UserContext } from "../Context/userContext";
import EggDetails from "./eggDetails";
import distanceToEgg from "../Utils/distanceToEgg";

const MAPBOXKEY = process.env.MAPBOX_API_KEY;

const Map = (props) => {
  const user = useContext(UserContext);
  console.log(user.longitude, typeof user.longitude);
  const [eggMarkers, setEggMarkers] = useState([]);
  const [eggLocation, setEggLocation] = useState(null);
  const [targetEgg, setTargetEgg] = useState(null);

  const clearEggData = () => setEggLocation(null);

  const dropEgg = () => {
    setEggMarkers([...eggMarkers, eggLocation]);
    clearEggData();
  };

  useEffect(() => {
    const getEggs = () => {
      if (!user) return;
      const req = {
        method: "GET",
      };
      fetch("/api/eggs", req)
        .then((res) => {
          if (!res.ok) throw new Error("something went wrong fetching eggs");
          console.log(res);
          return res.json();
        })
        .then((res) => {
          console.log(res);
          const eggs = res.map((egg) => ({
            id: egg.Id,
            longitude: egg.longitude,
            latitude: egg.latitude,
          }));
          setEggMarkers(eggs);
        })
        .catch((err) => console.error(err));
    };
    getEggs();
  }, []);

  const toggleEggDetails = (event, data) => {
    const egg = event.target.getAttribute("value");
    if (!egg) setTargetEgg(null);
    if (egg === "egg") {
      const eggId = Number(event.target.id);
      const req = {
        method: "GET",
        headers: {
          eggId: eggId,
        },
      };
      fetch("/api/details", req)
        .then((res) => {
          if (!res.ok) throw new Error("something went wrong with details");
          return res.json();
        })
        .then((res) => {
          const distance = distanceToEgg(
            res.latitude,
            res.longitude,
            user.latitude,
            user.longitude
          );
          res.howFar = distance.howFar;
          res.claimable = distance.claimable;
          res.metric = distance.metric;
          setTargetEgg(res);
        })
        .catch((err) => console.error(err));
    }
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
          mapboxApiAccessToken={MAPBOXKEY}
        >
          {eggMarkers.map((markers) => (
            <Marker
              key={markers.longitude}
              longitude={markers.longitude}
              latitude={markers.latitude}
            >
              <EggIcon
                id={markers.id}
                value={"egg"}
                onClick={toggleEggDetails}
              />
            </Marker>
          ))}

          <Geocoder
            mapRef={mapRef}
            onViewportChange={handleGeocoderViewportChange}
            mapboxApiAccessToken={MAPBOXKEY}
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
          {targetEgg && (
            <EggDetails targetEgg={targetEgg} toggleModal={setTargetEgg} />
          )}
        </MapGL>
      )}
    </div>
  );
};

export default Map;
