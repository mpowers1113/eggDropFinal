import React, { useState } from "react";
import decodeToken from "./lib/decode-token.js";
import { UserContext } from "./Context/userContext";
import Login from "./Components/login";
import Map from "./Components/map";
import EggDisplay from "./pages/eggDisplay";
import EventFeed from "./pages/eventFeed";
import Profile from "./pages/profile";
import Notifications from "./pages/notifications";
import UserSearch from "./pages/userSearch";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const useUserState = () => {
  const [userValid, setUserValid] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [eggMarkers, setEggMarkers] = useState([]);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [loadingEggs, setLoadingEggs] = useState(false);
  const [userDataLoadComplete, setUserDataLoadComplete] = useState(false);

  const getUserData = async () => {
    if (loadingUserData || userDataLoadComplete) return;
    setLoadingUserData(true);
    const token = window.localStorage.getItem("eggDrop8081porDgge");
    const req = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "x-access-token": token,
      },
    };
    try {
      const response = await fetch("/api/profile", req);
      const jsonRes = await response.json();
      setUserValid(jsonRes);
      loadNotifications();
    } catch (err) {
      console.error(err);
      throw new Error("something went wrong fetching profile data");
    }
    setLoadingUserData(false);
    setUserDataLoadComplete(true);
  };

  const validateUserToken = () => {
    if (userDataLoadComplete) return;
    const token = window.localStorage.getItem("eggDrop8081proDgge");
    const user = token ? decodeToken(token) : null;
    if (user) getUserData();
    else return null;
  };

  const getEggs = async () => {
    if (loadingEggs) return;
    setLoadingEggs(true);
    const token = window.localStorage.getItem("eggDrop8081porDgge");
    const req = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-access-token": token,
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch("/api/eggs", req);
      const jsonRes = await response.json();
      const buildEggs = jsonRes.map((egg) => ({
        id: egg.eggId,
        longitude: egg.longitude,
        latitude: egg.latitude,
        canClaim: egg.canClaim,
      }));
      setEggMarkers(buildEggs);
    } catch (err) {
      console.error(err);
      throw new Error("something went wrong fetching eggs");
    }
    setLoadingEggs(false);
  };

  const loadNotifications = async () => {
    if (loadingNotifications) return;
    setLoadingNotifications(true);
    try {
      const response = await fetch("/api/notifications", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": window.localStorage.getItem("eggDrop8081porDgge"),
        },
      });
      const jsonRes = await response.json();
      setNotifications(jsonRes);
    } catch (err) {
      console.error(err);
    }
    setLoadingNotifications(false);
  };

  const context = {
    data: userValid,
    userDataLoadComplete,
    userValid,
    notifications: notifications,
    eggMarkers,
    loadingNotifications,
    loadingEggs,
    getUserData,
    getEggs,
    setEggMarkers,
    validateUserToken,
    loadNotifications,
    setUserValid,
  };
  return context;
};

const App = (props) => {
  const context = useUserState();

  return (
    <>
      <UserContext.Provider value={context}>
        <BrowserRouter>
          <Routes>
            <Route path="/" index element={<Login />} />
            <Route path="/map" element={<Map />} />
            <Route path={"/events"} element={<EventFeed />} />
            <Route path={"/profile"} element={<Profile />} />
            <Route path={"/search"} element={<UserSearch />} />
            <Route path={"/notifications"} element={<Notifications />} />
            <Route path={"/egg-display/:id"} element={<EggDisplay />} />
            <Route path={"*"} element={<div>Not found</div>} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
};

export default App;
