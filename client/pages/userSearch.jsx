import React, { useState, useEffect, useContext } from "react";
import Input from "../UI/input";
import Navbar from "../Components/navbar";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/userContext";

const UserSearch = (props) => {
  const user = useContext(UserContext);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const navigate = useNavigate();

  const getUserData = () => {
    fetch("/api/users")
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
                  <button id={filtered.username} className="follow-button">
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
      <div className="row flex-column profile-gray justify-center event-div">
        {renderSearchBar()}
        {!loadingUsers && <h3 className="center-text">Loading...</h3>}
        {loadingUsers && <RenderUsers />}
      </div>
      <Navbar />
    </>
  );
};

export default UserSearch;
