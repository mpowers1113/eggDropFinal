import React, { useContext, useLayoutEffect, useState } from "react";
import { UserContext } from "../Context/userContext";
import { useNavigate, useParams } from "react-router";
import getDateFromTimeStamp from "../Utils/getDateFromTimestamp";
import Navbar from "../Components/navbar";

const EggDisplay = (props) => {
  const user = useContext(UserContext);
  const [loadEgg, setLoadEgg] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const targetEgg = user.data.foundEggs.filter(
    (egg) => egg.eggId === Number(params.id)
  );

  useLayoutEffect(() => {
    const id = targetEgg[0].eggId;
    const getEggDisplayData = async () => {
      try {
        const response = await fetch(`/api/egg/display/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": window.localStorage.getItem("eggDrop8081proDgge"),
          },
        });
        const jsonRes = await response.json();
        setLoadEgg(jsonRes);
      } catch (err) {
        console.error(err);
      }
    };
    getEggDisplayData();
  }, []);

  return (
    <div className="profile-gray">
      {!loadEgg && <div className="row justify-align-center">Loading...</div>}
      {loadEgg && (
        <>
          <div className="row space-between profile-brown egg-display-div">
            <i
              onClick={() => navigate("/profile")}
              className="profile-icons fas fa-arrow-left fa-2x"
            ></i>

            <i
              onClick={() => navigate("/notifications")}
              className={`fas fa-bell fa-2x ${
                user.notifications.length > 0
                  ? "notifications-icon"
                  : "no-notifications"
              }`}
            />
          </div>
          <div className="profile-brown row flex-column justify-align-center">
            <div>
              <h1 className="center-text">{loadEgg.message}</h1>
            </div>
            <div className="display-square">
              <img className="egg-images-display" src={loadEgg.photoUrl} />
            </div>
            <div className="row">
              <h3 className="center-text">{`From: ${loadEgg.username}`}</h3>
            </div>
            <div className="row">
              <h1 className="center-text">{`Created on ${getDateFromTimeStamp(
                loadEgg.createdAt
              )}`}</h1>
            </div>
            <div className="row">
              <p className="center-text">{`You found this egg on ${getDateFromTimeStamp(
                loadEgg.foundAt
              )}`}</p>
            </div>
          </div>
        </>
      )}
      <Navbar />
    </div>
  );
};

export default EggDisplay;
