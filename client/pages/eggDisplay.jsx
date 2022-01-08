import React, { useContext, useLayoutEffect, useState, useEffect } from "react";
import { UserContext } from "../Context/userContext";
import { useNavigate, useParams } from "react-router";
import getDateFromTimeStamp from "../Utils/getDateFromTimestamp";
import Navbar from "../Components/navbar";

const EggDisplay = (props) => {
  const user = useContext(UserContext);
  const [loadEgg, setLoadEgg] = useState(false);
  const [deleteEggModal, setDeleteEggModal] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    user.data === null && navigate("/");
  }, []);

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

  const deleteEggHandler = async () => {
    const id = targetEgg[0].eggId;
    try {
      const response = await fetch(`/api/egg/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": window.localStorage.getItem("eggDrop8081proDgge"),
        },
      });
      const jsonRes = await response.json();
      jsonRes && setDeleteConfirmed(true);
    } catch (err) {
      console.error(err);
    }
  };

  const renderHeaderNav = () => {
    return (
      <div className="row space-between profile-gray egg-display-div">
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
    );
  };

  const renderEggData = () => {
    return (
      <div className="profile-gray row flex-column justify-align-center">
        <div>
          <h1 className="center-text">&quot;{loadEgg.message}&quot;</h1>
        </div>
        <div className="row">
          <div className="display-square">
            <img className="egg-images-display" src={loadEgg.photoUrl} />
          </div>
        </div>
        <div className="row">
          <h3 className="center-text">{`From: ${loadEgg.username}`}</h3>
        </div>
        <div className="row">
          <h1 className="center-text">{`Created on ${getDateFromTimeStamp(
            loadEgg.createdAt
          )}`}</h1>
        </div>
        <div className="row pb1">
          <p className="center-text">{`You found this egg on ${getDateFromTimeStamp(
            loadEgg.foundAt
          )}`}</p>
        </div>
        {!deleteEggModal && (
          <div className="row">
            <button
              className="delete-egg"
              onClick={() => setDeleteEggModal(true)}
            >
              Delete egg
            </button>
          </div>
        )}
        {deleteEggModal && (
          <div className="row flex-column">
            <p>Are you sure you want to delete this egg?</p>
            <div className="row justify-align-center">
              <button
                className="delete-egg-no"
                onClick={() => setDeleteEggModal(false)}
              >
                No
              </button>
              <button className="delete-egg-yes" onClick={deleteEggHandler}>
                Yes
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDeletedView = () => {
    return (
      <div className="justify-align-center row center-element">
        <h1 className="center-text">Deleted</h1>
      </div>
    );
  };

  const renderViewToggle = () => {
    if (deleteConfirmed) return renderDeletedView();
    if (!loadEgg)
      return (
        <div className="row justify-align-center center-element">
          <h1 className="center-text">Loading...</h1>
        </div>
      );
    if (loadEgg) return renderEggData();
  };

  return (
    <>
      {renderHeaderNav()}
      {renderViewToggle()}
      <Navbar />
    </>
  );
};

export default EggDisplay;
