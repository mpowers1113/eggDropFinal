import React, { useContext, useState, useEffect } from "react";
import Navbar from "../Components/navbar";
import { UserContext } from "../Context/userContext";

import LoadingSpinner from "../UI/loadingSpinner";

const Notifications = (props) => {
  const user = useContext(UserContext);

  let currentNotifications = user.notifications;

  const [notificationState, setNotificationState] = useState(false);

  useEffect(() => {
    if (user.notifications.length > 0) return;
    !user.userDataLoadComplete && user.getUserData();
  }, []);

  useEffect(() => {
    if (user.notifications.length > 0) return;
    user.loadNotifications();
  }, []);
  useEffect(() => {
    if (user.userDataLoadComplete) setNotificationState(currentNotifications);
  }, [user.userDataLoadComplete]);

  const resetNotifications = (id) => {
    if (!user.userDataLoadComplete) return;
    if (currentNotifications.length === 1) setNotificationState([]);
    else
      currentNotifications = currentNotifications.filter(
        (notification) => notification.id !== id
      );
    setNotificationState(currentNotifications);
  };

  const deleteNotificationHandler = async (e) => {
    const id = Number(e.target.id);
    try {
      const response = await fetch(`api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": window.localStorage.getItem("eggDrop8081proDgge"),
        },
      });
      if (!response)
        throw new Error("something went wrong deleting this notification");
    } catch (err) {
      console.error(err);
    }
    resetNotifications(id);
  };

  const acceptFollowRequestHandler = async (e) => {
    const id = Number(e.target.id);
    const targetNotification = user.notifications.filter(
      (each) => each.id === id
    );
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": window.localStorage.getItem("eggDrop8081proDgge"),
        },
        body: JSON.stringify(targetNotification),
      });
      if (!response)
        throw new Error("something went wrong accepting this notification");
    } catch (err) {
      console.error(err);
    }
    resetNotifications(id);
  };

  const renderFoundEgg = (data, type) => {
    return (
      <>
        <li key={data.id + type} className="event-li profile-brown">
          <div className="row space-between align-center event-li-div">
            <div className="column-20">
              <div className="circle-event">
                <img
                  className="profile-pic"
                  src={
                    data.payload.fromUserPhoto
                      ? data.payload.fromUserPhoto
                      : "../Images/defaultprofilephoto.jpeg"
                  }
                  alt="profile photo"
                />
              </div>
            </div>
            <div className="column-65">
              <p>{data.payload.fromUserUsername} just found your egg!</p>
            </div>
            <div className="column-15 row justify-align-center">
              <i
                id={data.id}
                onClick={deleteNotificationHandler}
                className="fas fa-times cursor-pointer"
              ></i>
            </div>
          </div>
        </li>
      </>
    );
  };

  const renderFollowRequest = (data, type) => {
    return (
      <>
        <li key={data.id + type} className="event-li profile-brown">
          <div className="row space-between align-center event-li-div">
            <div className="column-20">
              <div className="circle-event">
                <img
                  className="profile-pic"
                  src={
                    data.payload.fromUserPhoto
                      ? data.payload.fromUserPhoto
                      : "../Images/defaultprofilephoto.jpeg"
                  }
                  alt="profile photo"
                />
              </div>
            </div>
            <div className="column-40">
              <p>{data.payload.fromUserUsername} wants to follow you. </p>
            </div>
            <div className="column-20">
              <i
                id={data.id}
                className="notification-follow fas fa-times fa-2x"
                onClick={deleteNotificationHandler}
              ></i>
            </div>
            <div className="column-20">
              <i
                id={data.id}
                className="notification-follow fas fa-check fa-2x"
                onClick={acceptFollowRequestHandler}
              ></i>
            </div>
          </div>
        </li>
      </>
    );
  };

  return (
    <>
      {notificationState === false && <LoadingSpinner />}
      {notificationState && (
        <div className="row flex-column profile-gray justify-center event-div">
          <ul className="events-ul">
            {notificationState.map((data) =>
              data.payload.type === "follow"
                ? renderFollowRequest(data, "follow")
                : renderFoundEgg(data, "egg")
            )}
          </ul>
        </div>
      )}
      <Navbar />
    </>
  );
};

export default Notifications;
