import React, { useState, useEffect, useContext } from "react";
import Input from "../UI/input";
import Navbar from "../Components/navbar";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/userContext";
import LoadingSpinner from "../UI/loadingSpinner";

const UserSearch = (props) => {
  const user = useContext(UserContext);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [disablebutton, setDisableButton] = useState([]);
  const navigate = useNavigate();

  const getUserData = () => {
    const req = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": window.localStorage.getItem("eggDrop8081porDgge"),
      },
    };
    fetch("/api/users", req)
      .then((res) => {
        if (!res.ok) throw new Error("something went wrong fetching user data");
        return res.json();
      })
      .then((res) => {
        setLoadingUsers(res);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    user.data === null && navigate("/");
    getUserData();
  }, []);

  const sendFollowRequest = (e) => {
    const username = e.target.id;
    const token = window.localStorage.getItem("eggDrop8081proDgge");
    const req = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "x-access-token": token,
        "Content-Type": "application/json",
      },
    };
    fetch(`/api/users/${username}/followers`, req)
      .then((res) => {
        if (!res.ok)
          throw new Error("something went wrong sending follow request");
        else return res.json();
      })
      .then(setDisableButton([...disablebutton, e.target.id]))
      .catch((err) => console.error(err));
  };

  const renderSearchBar = () => {
    const onChangeHandler = (e) => setSearchUserQuery(e.target.value);
    return (
      <div className="row flex-column profile-gray justify-center event-div">
        <Input
          className={"sign-up-input mb1"}
          type={"text"}
          id={"search"}
          value={searchUserQuery}
          onChange={onChangeHandler}
        />
      </div>
    );
  };

  const RenderUsers = () => {
    const filtered = loadingUsers.filter((user) =>
      user.username.includes(searchUserQuery)
    );
    return (
      <>
        <ul className="events-ul">
          {filtered.map((filtered) => (
            <li key={filtered.createdAt} className="event-li profile-brown">
              <div className="row space-between align-center event-li-div">
                <div className="column-20">
                  <div className="circle-event">
                    <img
                      className="profile-pic"
                      src={
                        filtered.profilePhotoUrl
                          ? filtered.profilePhotoUrl
                          : "../Images/defaultprofilephoto.jpeg"
                      }
                      alt="profile photo"
                    />
                  </div>
                </div>
                <div className="column-65">
                  <p>{filtered.username}</p>
                </div>
                <div className="column-15 follow-column">
                  <button
                    id={filtered.username}
                    className="follow-button"
                    disabled={disablebutton.includes(filtered.username)}
                    onClick={sendFollowRequest}
                  >
                    follow
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <>
      {!user.userDataLoadComplete && <LoadingSpinner />}
      {user.userDataLoadComplete && (
        <div className="row flex-column profile-gray justify-center event-div">
          {renderSearchBar()}
          {!loadingUsers && <h3 className="center-text">Loading...</h3>}
          {loadingUsers && <RenderUsers />}
        </div>
      )}
      <Navbar />
    </>
  );
};

export default UserSearch;
