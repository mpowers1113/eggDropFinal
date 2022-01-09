import React, { useContext, useLayoutEffect, useState, useEffect } from "react";
import Navbar from "../Components/navbar";
import { UserContext } from "../Context/userContext";
import { useNavigate } from "react-router";

const Notifications = (props) => {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const [currentNotifications, setCurrentNotifications] = useState(
    user.notifications
  );

  useEffect(() => {
    user.data === null && navigate("/");
  }, []);

  useLayoutEffect(() => {
    user.loadNotifications();
  }, []);

  const resetNotifications = (id) => {
    const newNotifications = user.notifications.filter(
      (notification) => notification.id !== id
    );
    if (currentNotifications.length === 1) setCurrentNotifications([]);
    else setCurrentNotifications(newNotifications);
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
      <div className="row flex-column profile-gray justify-center event-div">
        <ul className="events-ul">
          {currentNotifications.map((data) =>
            data.payload.type === "follow"
              ? renderFollowRequest(data, "follow")
              : renderFoundEgg(data, "egg")
          )}
        </ul>
      </div>
      <Navbar />
    </>
  );
};

export default Notifications;
