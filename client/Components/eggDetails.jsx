import React, { useContext, useState } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import ClientError from "../../server/client-error";
import { UserContext } from "../Context/userContext";
import Button from "../UI/button";

const EggDetails = (props) => {
  const user = useContext(UserContext);
  const [open] = useState(props.targetEgg);
  const [isClaimed, setIsClaimed] = useState(false);

  function onDismiss() {
    props.toggleModal(null);
  }

  let date = props.targetEgg.createdAt;
  date = date.split("T");
  date = date[0].split("-");
  const orderedDate = `${date[1]}-${date[2]}-${date[0]}`;

  const claimEggHandler = () => {
    const token = window.localStorage.getItem("eggDrop8081proDgge");
    const eggId = { eggId: props.targetEgg.eggId };
    const req = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "x-access-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eggId),
    };
    fetch("/api/found", req)
      .then((res) => {
        if (!res.ok) throw new ClientError("Something went wrong storing egg");
        else return res.json();
      })
      .then(() => {
        const foundEgg = {
          foundBy: user.data.id,
          eggId: props.targetEgg.eggId,
          latitude: props.targetEgg.latitude,
          longitude: props.targetEgg.longitude,
          photoUrl: props.targetEgg.photoUrl,
          message: props.targetEgg.message,
          createdAt: props.targetEgg.createdAt,
        };
        user.data.foundEggs.push(foundEgg);
        setIsClaimed(true);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <BottomSheet
        open={open}
        onDismiss={onDismiss}
        defaultSnap={({ maxHeight }) => maxHeight / 2}
        snapPoints={({ maxHeight }) => [
          maxHeight - maxHeight / 10,
          maxHeight / 4,
          maxHeight * 0.6,
        ]}
        expandOnContentDrag={true}
      >
        <div className={"row justify-align-center flex-column"}>
          {!isClaimed && (
            <div className="p1 center-text">
              <h1>{props.targetEgg.username}&apos;s Egg</h1>
              <p className="light">
                <i>Created on {orderedDate}</i>
              </p>
            </div>
          )}
          {isClaimed && (
            <>
              <div className="p1 center-text egg-details-message">
                <p>&quot;{props.targetEgg.message}&quot;</p>
              </div>
              <img
                src={props.targetEgg.photoUrl}
                alt={`${props.username} secret egg`}
                className="egg-details-img"
              ></img>
            </>
          )}
          {!isClaimed && (
            <div className="center-text">
              <h2>Distance from Egg: </h2>
              <h2 className="password-check">
                <b>
                  {parseInt(props.targetEgg.howFar)} {props.targetEgg.metric}
                </b>
              </h2>
            </div>
          )}
        </div>
        <Button
          className={`submit-sign-up mb1 ${isClaimed && "claimed-egg-button"}`}
          text={
            isClaimed
              ? "Claimed!"
              : props.targetEgg.claimable
              ? "CLAIM EGG!"
              : "Get Closer"
          }
          disabled={!props.targetEgg.claimable || isClaimed}
          click={claimEggHandler}
        />
      </BottomSheet>
    </>
  );
};

export default EggDetails;
