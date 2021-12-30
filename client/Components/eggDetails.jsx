import React, { useState } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import Button from "../UI/button";

const EggDetails = (props) => {
  const [open] = useState(props.targetEgg);
  const [isClaimed, setIsClaimed] = useState(false);

  function onDismiss() {
    props.toggleModal(null);
  }

  let date = props.targetEgg.createdAt;
  date = date.split("T");
  date = date[0].split("-");
  const orderedDate = `${date[1]}-${date[2]}-${date[0]}`;

  const claimEggHandler = () => setIsClaimed(true);

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
