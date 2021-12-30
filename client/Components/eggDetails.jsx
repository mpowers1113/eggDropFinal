import React, { useState } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import Button from "../UI/button";

const EggDetails = (props) => {
  const [open, setOpen] = useState(props.targetEgg);

  function onDismiss() {
    props.toggleModal(null);
  }

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
          <div className="p1">
            <h1>{props.targetEgg.username}'s Egg</h1>
          </div>
          <div className="center-text">
            <h3>Distance from Egg: </h3>
            <h3 className="password-check">
              <b>
                {parseInt(props.targetEgg.howFar)} {props.targetEgg.metric}
              </b>
            </h3>
          </div>
        </div>
        <Button
          className="submit-sign-up"
          text={props.targetEgg.claimable ? "CLAIM EGG!" : "Get Closer"}
          click={() => console.log("click")}
          disabled={!props.targetEgg.claimable}
        />
      </BottomSheet>
    </>
  );
};

export default EggDetails;
