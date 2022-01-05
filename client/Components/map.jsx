import React, {
  useState,
  useRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
} from "react";
import EggIcon from "../UI/egg-icon";
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
  const [eggMarkers, setEggMarkers] = useState([]);
  const [eggLocation, setEggLocation] = useState(null);
  const [targetEgg, setTargetEgg] = useState(null);
  const [notifications, setNotifications] = useState(false);
  const navigate = useNavigate();

  const clearEggData = () => setEggLocation(null);

  const dropEgg = () => {
    setEggMarkers([...eggMarkers, eggLocation]);
    clearEggData();
  };

  useEffect(() => {
    user.data === null && navigate("/");
  }, []);

  useLayoutEffect(() => {
    const getEggs = () => {
      if (!user) return;
      const req = {
        method: "GET",
      };
      fetch("/api/eggs", req)
        .then((res) => {
          if (!res.ok) throw new Error("something went wrong fetching eggs");
          return res.json();
        })
        .then((res) => {
          const eggs = res.map((egg) => ({
            id: egg.eggId,
            longitude: egg.longitude,
            latitude: egg.latitude,
          }));
          getNotifications();
          setEggMarkers(eggs);
        })
        .catch((err) => console.error(err));
    };
    getEggs();
  }, []);

  const getNotifications = () => {
    fetch("/api/notifications", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": window.localStorage.getItem("eggDrop8081proDgge"),
      },
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("something went wrong fetching notification data");
        return res.json();
      })
      .then((res) => {
        user.notifications = res;
      })
      .then(() => user.notifications.length && setNotifications(true))
      .catch((err) => console.error(err));
  };

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
          {eggMarkers.map((markers) => (
            <Marker
              key={markers.longitude}
              longitude={markers.longitude}
              latitude={markers.latitude}
            >
              <EggIcon
                id={markers.id}
                dataEgg={"egg"}
                onClick={toggleEggDetails}
              />
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
            <EggDetails targetEgg={targetEgg} toggleModal={setTargetEgg} />
          )}
        </MapGL>
      </div>
      <Navbar />
      {notifications && (
        <i
          onClick={() => navigate("/notifications")}
          className="fas fa-bell fa-2x notifications-icon"
        ></i>
      )}
    </>
  );
};

export default Map;
