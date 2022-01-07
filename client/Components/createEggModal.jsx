import React from "react";
import Button from "../UI/button";

export default class CreateEgg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      claim: "anyone",
      private: false,
    };
    this.fileInputRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleClaimChange = this.handleClaimChange.bind(this);
    this.handlePrivateChange = this.handlePrivateChange.bind(this);
    this.privateEggSelectHandler = this.privateEggSelectHandler.bind(this);
  }

  privateEggSelectHandler(event) {
    // console.log(event.target.value);
  }

  handlePrivateChange(event) {
    this.setState({ claim: "private", private: true });
  }

  handleClaimChange(event) {
    this.setState({ claim: event.target.value });
  }

  handleMessageChange(event) {
    this.setState({ message: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    const token = window.localStorage.getItem("eggDrop8081proDgge");
    formData.append("message", this.state.message);
    formData.append("image", this.fileInputRef.current.files[0]);
    formData.append("longitude", this.props.eggLocation.longitude);
    formData.append("latitude", this.props.eggLocation.latitude);
    formData.append("canClaim", this.state.claim);
    const req = {
      method: "POST",
      headers: {
        "x-access-token": token,
      },
      body: formData,
    };
    fetch("/api/egg", req)
      .then((res) => res.json())
      .then((res) => {
        const createdEgg = {
          longitude: this.props.eggLocation.longitude,
          latitude: this.props.eggLocation.latitude,
          canClaim: this.state.claim,
          id: res.eggId,
        };
        this.props.drop(createdEgg);
      })
      .catch((err) => console.error(err));
  }

  render() {
    return (
      <div className="overlay">
        <div className="row justify-align-center flex-column">
          <div className="relative column-modal">
            <i
              onClick={this.props.clear}
              className="fas fa-times upper-left"
            ></i>
            <form onSubmit={this.handleSubmit}>
              <div className="p1">
                <input
                  required
                  autoFocus
                  type="text"
                  id="message"
                  name="message"
                  placeholder="Enter message..."
                  value={this.state.message}
                  onChange={this.handleMessageChange}
                />
              </div>
              <div>
                {this.state.message.length <= 0 ? (
                  <div className="row justify-align-center">
                    <i className="far fa-times-circle fa-2x red"></i>
                  </div>
                ) : (
                  <div className="row justify-align-center">
                    <i className=" green fas fa-check-double fa-2x"></i>
                    <p>Ready to drop!</p>
                  </div>
                )}
              </div>
              <div className="p1">
                <input
                  required
                  type="file"
                  name="image"
                  ref={this.fileInputRef}
                  accept=".png, .jpg, .jpeg, .gif"
                  className="file-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload">Upload Image</label>
                <div>
                  <p className="center-text">Who can claim this egg?</p>
                </div>
                <div className="row p1 space-around">
                  <div>
                    <input
                      onChange={this.handleClaimChange}
                      className="create-egg-radio"
                      type="radio"
                      id="can-claim-anyone"
                      name="claimable-by"
                      value="anyone"
                      defaultChecked
                    />
                    <label htmlFor="can-claim-anyone">Anyone</label>
                  </div>
                  <br />
                  <div>
                    <input
                      onChange={this.handleClaimChange}
                      className="create-egg-radio"
                      type="radio"
                      id="can-claim-followers"
                      name="claimable-by"
                      value="followers"
                    />
                    <label htmlFor="can-claim-followers">Followers</label>
                  </div>
                  <div>
                    <input
                      onChange={this.handlePrivateChange}
                      className="create-egg-radio"
                      type="radio"
                      id="can-claim-private"
                      name="claimable-by"
                      value="private"
                    />
                    <label htmlFor="can-claim-private">Private</label>
                  </div>
                </div>
                <div className="row">
                  {this.state.private && (
                    <select
                      onChange={this.privateEggSelectHandler}
                      className="select-create-egg"
                    >
                      {this.props.user.data.followers.map((follower) => (
                        <option key={follower.userId} value={follower.userId}>
                          {follower.username}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <Button
                  type="submit"
                  text="Drop Egg"
                  click={this.handleSubmit}
                  disabled={this.state.message.length <= 0}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
