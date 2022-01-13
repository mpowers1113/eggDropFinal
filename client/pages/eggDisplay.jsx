import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../Context/userContext";
import { useNavigate, useParams } from "react-router";
import getDateFromTimeStamp from "../Utils/getDateFromTimestamp";
import Navbar from "../Components/navbar";
import LoadingSpinner from "../UI/loadingSpinner";

const EggDisplay = (props) => {
  const user = useContext(UserContext);
  const [loadEgg, setLoadEgg] = useState(false);
  const [deleteEggModal, setDeleteEggModal] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [targetEgg, setTargetEgg] = useState(null);
  const navigate = useNavigate();
  const params = useParams();

  let eggParam = null;

  const getEggDisplayData = async () => {
    eggParam = user.data.foundEggs.filter(
      (egg) => egg.eggId === Number(params.id)
    );
    const id = eggParam[0].eggId;
    try {
      const response = await fetch(`/api/egg/display/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": window.localStorage.getItem("eggDrop8081porDgge"),
        },
      });
      const jsonRes = await response.json();
      setLoadEgg(jsonRes);
    } catch (err) {
      console.error(err);
    }
    setTargetEgg(eggParam);
  };

  useEffect(() => {
    if (user.data === null) user.getUserData();
    else getEggDisplayData();
  }, []);

  const resetProfileEggs = () => {
    const newFoundEggs = user.data.foundEggs.filter(
      (egg) => egg.eggId !== targetEgg[0].eggId
    );
    user.data.foundEggs = [...newFoundEggs];
  };

  const deleteEggHandler = async () => {
    const id = targetEgg[0].eggId;
    try {
      const response = await fetch(`/api/egg/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": window.localStorage.getItem("eggDrop8081porDgge"),
        },
      });
      const jsonRes = await response.json();
      jsonRes && setDeleteConfirmed(true);
      resetProfileEggs();
    } catch (err) {
      console.error(err);
    }
    navigate("/profile");
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
      <div className="profile-gray-text row flex-column justify-align-center max-height-vh egg-display-queries pt1">
        <h3 className="profile-gray center-text">
          &quot;{loadEgg.message}&quot;
        </h3>

        <div className="row">
          <div className="display-square">
            <img className="egg-images-display" src={loadEgg.photoUrl} />
          </div>
        </div>
        <div className="row">
          <h3 className="center-text profile-gray-text">{`From: ${loadEgg.username}`}</h3>
        </div>
        <div className="row">
          <p className="center-text dark-brown-text">{`Created on ${getDateFromTimeStamp(
            loadEgg.createdAt
          )}`}</p>
        </div>
        <div className="row">
          <p className="center-text light-brown-text">{`You found this egg on ${getDateFromTimeStamp(
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
          <div className="overlay">
            <div className="row center-element delete-egg-modal flex-column">
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
      <>{renderHeaderNav()}</>
      <>{user.userDataLoadComplete ? renderViewToggle() : <LoadingSpinner />}</>
      <>
        <Navbar />
      </>
    </>
  );
};

export default EggDisplay;
