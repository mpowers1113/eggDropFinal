import React, {
  useState,
  useRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
} from "react";
import EggIcon from "../UI/egg-icon";
import FollowerEggIcon from "../UI/followers-egg-icon";
import PrivateEggIcon from "../UI/private-egg-icon";
import MapGL, { Marker, GeolocateControl } from "react-map-gl";
import { usePosition } from "use-position";
import Geocoder from "react-map-gl-geocoder";
import CreateEgg from "./createEggModal";
import { UserContext } from "../Context/userContext";
import EggDetails from "./eggDetails";
import distanceToEgg from "../Utils/distanceToEgg";
import Navbar from "./navbar";
import { useNavigate } from "react-router";

const MAPBOXKEY = process.env.MAPBOX_API_KEY;

const Map = (props) => {
  const watch = true;
  const { latitude, longitude, error } = usePosition(watch, {
    enableHighAccuracy: true,
  });
  const user = useContext(UserContext);
  const [eggLocation, setEggLocation] = useState(null);
  const [targetEgg, setTargetEgg] = useState(null);
  const navigate = useNavigate();

  const hasNotifications = user.notifications.length > 0;

  const clearEggData = () => setEggLocation(null);

  const dropEgg = (eggData) => {
    user.setEggMarkers([...user.eggMarkers, eggData]);
    clearEggData();
  };

  useEffect(() => {
    user.validateUserToken();
    user.getEggs();
  }, []);

  useLayoutEffect(() => {}, []);

  const toggleEggDetails = (event) => {
    if (error) return;
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
            latitude,
            longitude
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
    <>
      {user.userDataLoadComplete && (
        <div className="row">
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
          </MapGL>
        </div>
      )}
      <Navbar />
      {hasNotifications && (
        <i
          onClick={() => navigate("/notifications")}
          className="fas fa-bell fa-2x notifications-icon"
        ></i>
      )}
      {user.loadingNotifications && <span>loading...</span>}
      <i
        onClick={() => user.getEggs()}
        className="fas fa-sync-alt fa-2x refresh-icon"
      ></i>
    </>
  );
};

export default Map;
