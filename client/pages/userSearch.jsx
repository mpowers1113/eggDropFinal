import React, { useState, useEffect } from "react";
import Button from "../UI/button";
import Input from "../UI/input";

const UserSearch = (props) => {
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchUserQuery, setSearchUserQuery] = useState("");

  const getUserData = () => {
    fetch("/api/users")
      .then((res) => {
        if (!res.ok)
          throw new Error("something went wrong fetching event data");
        return res.json();
      })
      .then((res) => {
        setLoadingUsers(res);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getUserData();
  }, []);

  const RenderUsers = (data, query = "") => {
    const filtered = data.filter((user) => user.username.includes(query));
    return filtered.map((filtered) => (
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
          <div className="column-15">
            <Button text="follow" />
          </div>
        </div>
      </li>
    ));
  };

  const SearchBar = () => {
    return (
      <Input
        className={"sign-up-input mb1"}
        type={"text"}
        id={"search"}
        onChange={(e) => setSearchUserQuery(e.target.value)}
      />
    );
  };

  const toggleLoadingUsers = () => {
    if (!loadingUsers) return <h3 className="center-text">Loading...</h3>;
    else return RenderUsers(loadingUsers, searchUserQuery);
  };

  return (
    <>
      <div className="row flex-column profile-gray justify-center event-div">
        <SearchBar />
        <ul className="events-ul">{toggleLoadingUsers()}</ul>
      </div>
    </>
  );
};

export default UserSearch;
