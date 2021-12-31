import React, { useState } from "react";
import { UserContext } from "./Context/userContext";
import Login from "./Components/login";
import Map from "./Components/map";
import { usePosition } from "use-position";

const App = (props) => {
  const watch = true;
  const { latitude, longitude, error } = usePosition(watch, {
    enableHighAccuracy: true,
  });
  const [userValid, setUserValid] = useState(null);

  const context = {
    data: userValid,
    longitude: longitude,
    latitude: latitude,
    error: error,
  };

  const renderPage = () => {
    if (userValid && latitude && !error)
      return (
        <UserContext.Provider value={context}>
          <Map />
        </UserContext.Provider>
      );
    else return <Login setUserValid={setUserValid} />;
  };

  return <>{renderPage()}</>;
};

export default App;
