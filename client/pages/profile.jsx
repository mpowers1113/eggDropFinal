import React, { useContext, useRef, useState, useEffect } from "react";
import Navbar from "../Components/navbar";
import { UserContext } from "../Context/userContext";
import Button from "../UI/button";
import { useNavigate } from "react-router";

const Profile = (props) => {
  const user = useContext(UserContext);
  const [uploadProfilePhoto, setUploadProfilePhoto] = useState(false);
  const [view, setView] = useState("eggs");
  const navigate = useNavigate();

  const toggleUploadProfile = () => setUploadProfilePhoto(!uploadProfilePhoto);

  const imageInputRef = useRef();

  useEffect(() => {
    user.data === null && navigate("/");
  }, []);

  const profileEggs = (src, key) => {
    return (
      <div className="profile-square" key={key}>
        <img className="egg-images" src={src} alt="" />
      </div>
    );
  };

  const handleProfileImageSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    const token = window.localStorage.getItem("eggDrop8081proDgge");
    formData.append("image", imageInputRef.current.files[0]);
    const req = {
      method: "POST",
      headers: {
        "x-access-token": token,
      },
      body: formData,
    };
    fetch("/api/edit/profile", req)
      .then((res) => res.json())
      .then((res) => (user.data.profilePhotoUrl = res.profilePhotoUrl))
      .then(() => toggleUploadProfile())
      .catch((err) => console.error(err));
  };

  const renderFollow = (type, event) => {
    return (
      <div className="row flex-column profile-brown justify-center profile-egg-icons-div">
        <ul className="events-ul">
          {event.map((event, index) => (
            <li key={type + index} className="event-li profile-gray">
              <div className="row space-between align-center event-li-div">
                <div className="column-third">
                  <div className="circle-event">
                    <img
                      className="profile-pic"
                      src={
                        event.profilePhotoUrl ||
                        "../Images/defaultprofilephoto.jpeg"
                      }
                      alt="profile photo"
                    />
                  </div>
                </div>
                <div className="column-third follow-text">
                  <p>{event.username}</p>
                </div>
                <div className="column-third">
                  <i className="gold follow-icon fas fa-2x fa-egg"></i>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderEggs = () => {
    return (
      <div className="flex-wrap space-around profile-brown profile-egg-icons-div">
        {user.data.foundEggs.map((egg) =>
          profileEggs(egg.photoUrl, egg.latitude)
        )}
      </div>
    );
  };

  const editProfile = () => {
    return (
      <div className="profile-gray row justify-align-center flex-column">
        <form onSubmit={handleProfileImageSubmit}>
          <input
            required
            type="file"
            name="image"
            ref={imageInputRef}
            accept=".png, .jpg, .jpeg, .gif"
            className="profile-file-input"
            id="file-upload"
          />
          <label
            className="profile-pic-edit-label center-text"
            htmlFor="file-upload"
          >
            Upload Profile Photo
          </label>
          <div className="row justify-align-center">
            <Button
              text="Save"
              type="submit"
              click={handleProfileImageSubmit}
            />
          </div>
        </form>
      </div>
    );
  };

  const toggleViewHandler = (view) => {
    if (view === "followers")
      return renderFollow("followers", user.data.followers);
    else if (view === "following")
      return renderFollow("following", user.data.following);
    else if (view === "eggs") return renderEggs();
  };

  return (
    <>
      {user.data && (
        <div className="profile-brown">
          <div className="row space-between profile-gray">
            <i
              onClick={() => navigate("/map")}
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
          {uploadProfilePhoto === false ? (
            <div className="row justify-align-center profile-gray">
              <div className="circle">
                <img
                  className="profile-pic"
                  src={
                    user.data.profilePhotoUrl ||
                    "../Images/defaultprofilephoto.jpeg"
                  }
                  alt="profile photo"
                />
              </div>
            </div>
          ) : (
            editProfile()
          )}
          <div className="row justify-align-center profile-gray center-text">
            <h1 className="profile-name profile-h1">{user.data.username}</h1>
          </div>
          <div className="row justify-align-center profile-gray">
            <i
              onClick={toggleUploadProfile}
              className={`padding-none margin-none profile-icons fas fa-user-edit ${
                uploadProfilePhoto && "event-icon"
              }`}
            ></i>
          </div>
          <div className="row space-between profile-gray profile-gray-text">
            <div className="column-third">
              <p className="profile-p">eggs</p>
            </div>
            <div className="column-third">
              <p className="profile-p">followers</p>
            </div>
            <div className="column-third">
              <p className="profile-p">following</p>
            </div>
          </div>
          <div className="row space-between profile-gray">
            <div className="column-third">
              <span
                onClick={() => setView("eggs")}
                className="profile-gray-text-bold cursor-pointer"
              >
                {user.data.foundEggs.length || 0}
              </span>
            </div>
            <div className="column-third">
              <span
                onClick={() => setView("followers")}
                className="profile-gray-text-bold cursor-pointer"
              >
                {user.data.followers.length || 0}
              </span>
            </div>
            <div className="column-third">
              <span
                onClick={() => setView("following")}
                className="profile-gray-text-bold cursor-pointer"
              >
                {user.data.following.length || 0}
              </span>
            </div>
          </div>
          <div className="profile-header-bottom row profile-gray">
            <br></br>
          </div>
          {toggleViewHandler(view)}
        </div>
      )}
      <Navbar />
    </>
  );
};

export default Profile;
