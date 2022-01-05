import React, { useContext, useEffect } from "react";
import Navbar from "../Components/navbar";
import { UserContext } from "../Context/userContext";

const Notifications = (props) => {
  const user = useContext(UserContext);

  useEffect(() => {
    user.loadNotifications();
  }, []);

  const declineFollowRequestHandler = (e) => {
    const id = Number(e.target.id);
    const req = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": window.localStorage.getItem("eggDrop8081proDgge"),
      },
    };
    fetch(`api/notifications/${id}`, req)
      .then((res) => {
        if (!res.ok)
          throw new Error("something went wrong deleting this notification");
        return res.json();
      })
      .then(user.loadNotifications())
      .catch((err) => console.error(err));
  };

  const acceptFollowRequestHandler = (e) => {
    const notificationId = Number(e.target.id);
    const notificationPayload = user.notifications.filter(
      (each) => each.id === notificationId
    );
    const req = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": window.localStorage.getItem("eggDrop8081proDgge"),
      },
      body: JSON.stringify(notificationPayload),
    };
    fetch("/api/notifications", req)
      .then((res) => {
        if (!res.ok)
          throw new Error("something went wrong accepting this follow");
        return res.json();
      })
      .then(user.loadNotifications())
      .catch((err) => console.error(err));
  };

  const renderFoundEgg = (data) => {
    return (
      <>
        <li key={data.id} className="event-li profile-brown">
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
            <div className="column-15">
              <i className="event-icon fas fa-2x fa-egg"></i>
            </div>
          </div>
        </li>
      </>
    );
  };

  const renderFollowRequest = (data) => {
    return (
      <>
        <li key={data.id} className="event-li profile-brown">
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
                onClick={declineFollowRequestHandler}
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
          {user.notifications.map((data) =>
            data.payload.type === "follow"
              ? renderFollowRequest(data)
              : renderFoundEgg(data)
          )}
        </ul>
      </div>
      <Navbar />
    </>
  );
};

export default Notifications;
