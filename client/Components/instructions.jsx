import React, { useState } from "react";
import Button from "../UI/button";

const Instructions = (props) => {
  const [currentCard, setCurrentCard] = useState(1);
  const navigateHandler = () => {
    setCurrentCard(currentCard + 1);
  };

  return (
    <div className={currentCard <= 3 ? "overlay" : "hidden"}>
      {currentCard === 1 && (
        <div className="row justify-align-center flex-column">
          <div className="column-modal justify-align-center flex-column">
            <i className="dark-brown fas fa-map-marker-alt fa-3x p1"></i>
            <h3 className="light p2">
              Double-tap a location on the map to drop your egg. You can hide it
              anywhere you want.
            </h3>
          </div>
          <div className="row justify-align-center">
            <Button
              text={"Next"}
              className={"instructions-button"}
              click={navigateHandler}
            />
          </div>
        </div>
      )}
      {currentCard === 2 && (
        <div className="row justify-align-center flex-column">
          <div className="column-modal">
            <i className="dark-brown p1 fas fa-camera-retro fa-3x"></i>
            <h3 className="light p2">
              Add a message and a picture to your egg.
            </h3>
            <br />
            <h3 className="light p2">
              By default, your egg has a 100-meter claim radius, but you can
              adjust this if you&#39;d like.
            </h3>
          </div>
          <div className="row justify-align-center">
            <Button
              text={"Next"}
              className={"instructions-button"}
              click={navigateHandler}
            />
          </div>
        </div>
      )}
      {currentCard === 3 && (
        <div className="row justify-align-center flex-column p2">
          <div className="column-modal">
            <i className="dark-brown p1 fas fa-users fa-3x"></i>
            <h3 className="light p2">Lastly, choose who can see this egg.</h3>
            <h3 className="light p2">
              Choose from all users, all your followers, or send it to someone
              special.
            </h3>
          </div>
          <div className="row justify-align-center">
            <Button
              text={"Close"}
              className={"instructions-button"}
              click={props.onFinish}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Instructions;
