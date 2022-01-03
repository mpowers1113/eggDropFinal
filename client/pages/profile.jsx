import React, { useContext } from "react";
import { UserContext } from "../Context/userContext";

const Profile = (props) => {
  const user = useContext(UserContext);

  const profileEggs = (src, key) => {
    return (
      <div className="profile-square" key={key}>
        <img className="egg-images" src={src} alt="" />
      </div>
    );
  };

  return (
    <div className="profile-brown">
      <div className="row space-between profile-gray">
        <i
          onClick={() => props.closeProfile(false)}
          className="profile-icons fas fa-arrow-left fa-2x"
        ></i>
        <i className="fas fa-history profile-icons fa-2x"></i>
      </div>
      <div className="row justify-align-center profile-gray">
        <div className="circle">
          <img
            className="profile-pic"
            src={
              user.data.profilePhotoUrl
                ? user.data.profilePHotoUrl
                : "../Images/defaultprofilephoto.jpeg"
            }
            alt="profile photo"
          />
        </div>
      </div>
      <div className="row justify-align-center profile-gray center-text">
        <h1 className="profile-name profile-h1">{user.data.username}</h1>
      </div>
      <div className="row justify-align-center profile-gray">
        <i className="padding-none margin-none profile-icons fas fa-user-edit"></i>
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
  );
};

export default Profile;
