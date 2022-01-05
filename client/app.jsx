import React, { useState } from "react";
import { UserContext } from "./Context/userContext";
import Login from "./Components/login";
import Map from "./Components/map";

import EventFeed from "./pages/eventFeed";
import Profile from "./pages/profile";
import Notifications from "./pages/notifications";
import UserSearch from "./pages/userSearch";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = (props) => {
  const [userValid, setUserValid] = useState(null);

  const context = {
    data: userValid,
  };

  return (
    <UserContext.Provider value={context}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            index
            element={<Login setUserValid={setUserValid} />}
          />
          <Route path="/map" element={<Map />} />
          <Route path={"/events"} element={<EventFeed />} />
          <Route path={"/profile"} element={<Profile />} />
          <Route path={"/search"} element={<UserSearch />} />
          <Route path={"/notifications"} element={<Notifications />} />
          <Route path={"*"} element={<div>Not found</div>} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
