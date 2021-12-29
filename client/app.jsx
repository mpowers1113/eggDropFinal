import React, { useState } from "react";
import { UserContext } from "./Context/userContext";
import Login from "./Components/login";
import Map from "./Components/map";

const App = (props) => {
  const [userValid, setUserValid] = useState(null);

  const renderPage = () => {
    if (userValid)
      return (
        <UserContext.Provider value={userValid}>
          <Map />
        </UserContext.Provider>
      );
    else return <Login setUserValid={setUserValid} />;
  };

  return <>{renderPage()}</>;
};

export default App;
