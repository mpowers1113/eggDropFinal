import React, { useEffect, useState } from "react";

const EventFeed = (props) => {
  const [loadingEvents, setLoadingEvents] = useState(false);

  const getEventData = () => {
    fetch("/api/events")
      .then((res) => {
        if (!res.ok)
          throw new Error("something went wrong fetching event data");
        return res.json();
      })
      .then((res) => {
        setLoadingEvents(res);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getEventData();
  }, []);

  const RenderEvents = (data) => {
    return data.map((data) => (
      <li key={data.createdAt} className="event-li profile-brown">
        <div className="row space-between align-center event-li-div">
          <div className="column-20">
            <div className="circle-event">
              <img
                className="profile-pic"
                src={
                  data.payload.profilePhotoUrl
                    ? data.payload.profilePhotoUrl
                    : "../Images/defaultprofilephoto.jpeg"
                }
                alt="profile photo"
              />
            </div>
          </div>
          <div className="column-65">
            <p>
              {data.payload.type === "foundEgg"
                ? `${data.payload.username} just found an egg`
                : data.payload.type === "createdEgg"
                ? `${data.payload.username} just dropped an egg`
                : `${data.payload.username} just joined eggDrop!`}
            </p>
          </div>
          <div className="column-15">
            <i
              className={`event-icon fas fa-2x ${
                data.payload.type === "newUser"
                  ? "fa-user-plus"
                  : data.payload.type === "foundEgg"
                  ? "fa-egg"
                  : "fa-check-double"
              }`}
            ></i>
          </div>
        </div>
      </li>
    ));
  };

  const toggleLoadedEvents = () => {
    if (!loadingEvents) return <h3 className="center-text">Loading...</h3>;
    else return RenderEvents(loadingEvents);
  };

  return (
    <div className="row flex-column profile-gray justify-center event-div">
      <ul className="events-ul">{toggleLoadedEvents()}</ul>
    </div>
  );
};

export default EventFeed;
