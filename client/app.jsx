import React, { useEffect, useState } from "react";
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

  const loadNotifications = async () => {
    if (loadingNotifications) return;
    setLoadingNotifications(true);
    try {
      const response = await fetch("/api/notifications", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": window.localStorage.getItem("eggDrop8081proDgge"),
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
    notifications: notifications,
    loadingNotifications,
    loadNotifications,
    setUserValid,
  };
  return context;
};

const App = (props) => {
  const context = useUserState();
  useEffect(() => {
    context.loadNotifications();
  }, []);

  return (
    <UserContext.Provider value={context}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            index
            element={<Login setUserValid={context.setUserValid} />}
          />
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
  );
};

export default App;
