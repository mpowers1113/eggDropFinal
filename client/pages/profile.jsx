import React, { useState, useContext } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { UserContext } from "../Context/userContext";

const Profile = (props) => {
  const user = useContext(UserContext);
  const [open] = useState(props.open);
  const onDismiss = () => props.closeProfile(false);

  return (
    <BottomSheet
      open={open}
      onDismiss={onDismiss}
      defaultSnap={({ maxHeight }) => maxHeight / 1}
      expandOnContentDrag={true}
    >
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
            <p>Image goes here</p>
          </div>
        </div>
        <div className="row justify-align-center profile-gray">
          <h1 className="profile-name">{user.username}</h1>
        </div>
        <div className="row justify-align-center profile-gray">
          <i className="padding-none margin-none profile-icons fas fa-user-edit"></i>
        </div>
        <div className="row space-between profile-gray profile-gray-text">
          <div className="column-third">
            <p>eggs</p>
          </div>
          <div className="column-third">
            <p>followers</p>
          </div>
          <div className="column-third">
            <p>following</p>
          </div>
        </div>
        <div className="row space-between profile-gray">
          <div className="column-third">
            <span className="profile-gray-text-bold">12</span>
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
        <div className="row flex-wrap">EGGS GO HERE</div>
      </div>
    </BottomSheet>
  );
};

export default Profile;
