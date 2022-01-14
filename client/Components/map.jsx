import React, {
  useState,
  useRef,
  useCallback,
  useContext,
  useEffect,
} from "react";
import EggIcon from "../UI/egg-icon";
import { isMobile } from "react-device-detect";
import MapInstructionsButton from "../UI/mapInstructionsButton";
import Instructions from "./instructions";
import FollowerEggIcon from "../UI/followers-egg-icon";
import PrivateEggIcon from "../UI/private-egg-icon";
import MapGL, {
  Marker,
  GeolocateControl,
  AttributionControl,
} from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import CreateEgg from "./createEggModal";
import { UserContext } from "../Context/userContext";
import EggDetails from "./eggDetails";
import distanceToEgg from "../Utils/distanceToEgg";
import Navbar from "./navbar";
import { useNavigate } from "react-router";
import LoadingSpinner from "../UI/loadingSpinner";

const MAPBOXKEY = process.env.MAPBOX_API_KEY;

const Map = (props) => {
  const user = useContext(UserContext);
  const [eggLocation, setEggLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [targetEgg, setTargetEgg] = useState(null);
  const [instructions, setInstructions] = useState(false);
  const toggleInstructionsHandler = () => setInstructions(!instructions);

  useEffect(() => {
    const options = { timeout: 5000, maximumAge: 0 };
    const successGeo = (pos) => {
      const crd = pos.coords;
      const position = { longitude: crd.longitude, latitude: crd.latitude };
      setUserLocation(position);
    };
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(successGeo, error, options);
  }, [targetEgg]);

  const navigate = useNavigate();

  const hasNotifications = user.notifications.length > 0;

  const clearEggData = () => setEggLocation(null);

  const dropEgg = (eggData) => {
    user.setEggMarkers([...user.eggMarkers, eggData]);
    clearEggData();
  };

  useEffect(() => {
    if (user.userDataLoadComplete) return;
    user.getUserData();
    user.getEggs();
  }, []);

  const toggleEggDetails = (event) => {
    const egg = event.target.getAttribute("data-egg");
    if (!egg) setTargetEgg(null);
    else {
      const eggId = Number(event.target.id);
      fetch(`/api/eggs/${eggId}`)
        .then((res) => {
          if (!res.ok) throw new Error("something went wrong with details");
          return res.json();
        })
        .then((res) => {
          const distance = distanceToEgg(
            res.latitude,
            res.longitude,
            userLocation.latitude,
            userLocation.longitude
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

  const attributionStyle = {
    logoPosition: "top-left",
  };

  const eventRecognizerOptions = isMobile
    ? {
        pan: { threshold: 10 },
        tap: { threshold: 5 },
        doubletap: { taps: 2 },
      }
    : {};

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
    <>
      {user.userDataLoadComplete && (
        <div className="row">
          <MapGL
            onDblClick={prepareDropHandler}
            doubleClickZoom={false}
            ref={mapRef}
            {...viewport}
            width="100vw"
            height="100vh"
            mapStyle="mapbox://styles/mapbox/streets-v11"
            attributionControl={false}
            eventRecognizerOptions={eventRecognizerOptions}
            onViewportChange={handleViewportChange}
            mapboxApiAccessToken={MAPBOXKEY}
          >
            <AttributionControl compact={true} style={attributionStyle} />
            {user.eggMarkers.map((markers) => (
              <Marker
                key={markers.longitude}
                longitude={markers.longitude}
                latitude={markers.latitude}
              >
                {markers.canClaim === "followers" ? (
                  <FollowerEggIcon
                    id={markers.id}
                    dataEgg={"egg"}
                    onClick={toggleEggDetails}
                  />
                ) : markers.canClaim === "private" ? (
                  <PrivateEggIcon
                    id={markers.id}
                    dataEgg={"egg"}
                    onClick={toggleEggDetails}
                  />
                ) : (
                  <EggIcon
                    id={markers.id}
                    dataEgg={"egg"}
                    onClick={toggleEggDetails}
                  />
                )}
              </Marker>
            ))}

            <Geocoder
              mapRef={mapRef}
              onViewportChange={handleGeocoderViewportChange}
              mapboxApiAccessToken={MAPBOXKEY}
              position="top-left"
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
              <EggDetails
                setEggMarkers={user.eggMarkers}
                eggMarkers={user.eggMarkers}
                targetEgg={targetEgg}
                toggleModal={setTargetEgg}
              />
            )}
            {hasNotifications && (
              <i
                onClick={() => navigate("/notifications")}
                className="fas fa-bell fa-2x notifications-icon"
              ></i>
            )}
            <MapInstructionsButton click={toggleInstructionsHandler} />
            <i
              onClick={() => user.getEggs()}
              className="fas fa-sync-alt fa-2x refresh-icon"
            ></i>
          </MapGL>
        </div>
      )}
      {instructions && <Instructions onFinish={toggleInstructionsHandler} />}

      <Navbar />

      {!user.userDataLoadComplete && <LoadingSpinner />}
    </>
  );
};

export default Map;
