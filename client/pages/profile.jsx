import React, { useContext, useRef, useState, useEffect } from "react";
import Navbar from "../Components/navbar";
import { UserContext } from "../Context/userContext";
import Button from "../UI/button";
import { useNavigate } from "react-router";

const Profile = (props) => {
  const user = useContext(UserContext);
  const [uploadProfilePhoto, setUploadProfilePhoto] = useState(false);
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

  return (
    <>
      {user.data && (
        <div className="profile-brown">
          <div className="row space-between profile-gray">
            <i
              onClick={() => navigate("/map")}
              className="profile-icons fas fa-arrow-left fa-2x"
            ></i>
            {user.notifications.length && (
              <i
                onClick={() => navigate("/notifications")}
                className="fas fa-bell fa-2x notifications-icon"
              ></i>
            )}
          </div>
          {uploadProfilePhoto === false ? (
            <div className="row justify-align-center profile-gray">
              <div className="circle">
                <img
                  className="profile-pic"
                  src={
                    user.data.profilePhotoUrl
                      ? user.data.profilePhotoUrl
                      : "../Images/defaultprofilephoto.jpeg"
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
              <span className="profile-gray-text-bold">
                {user.data.foundEggs.length}
              </span>
            </div>
            <div className="column-third">
              <span className="profile-gray-text-bold">256</span>
            </div>
            <div className="column-third">
              <span className="profile-gray-text-bold">159</span>
            </div>
          </div>
          <div className="profile-header-bottom row profile-gray">
            <br></br>
          </div>

          <div className="flex-wrap space-around profile-brown profile-egg-icons-div">
            {user.data.foundEggs.map((egg) =>
              profileEggs(egg.photoUrl, egg.latitude)
            )}
          </div>
        </div>
      )}
      <Navbar />
    </>
  );
};

export default Profile;
