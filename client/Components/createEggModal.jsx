import React from "react";
import Button from "../UI/button";
import LoadingSpinner from "../UI/loadingSpinner";
import { readAndCompressImage } from "browser-image-resizer";

export default class CreateEgg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      claim: "anyone",
      private: false,
      ready: false,
      privateUserId: null,
      uploading: false,
    };
    this.fileInputRef = React.createRef();
    this.selectRef = React.createRef();
    this.messageRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReadyToSubmit = this.handleReadyToSubmit.bind(this);
    this.handleClaimChange = this.handleClaimChange.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleCloseModal(event) {
    if (event.target.id === "8") {
      this.props.clear();
    }
  }

  handleReadyToSubmit() {
    this.setState({ ready: true });
  }

  handleClaimChange(event) {
    if (event.target.value === "private")
      this.setState({ claim: "private", private: true });
    else this.setState({ claim: event.target.value, private: false });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const config = {
      quality: 0.5,
      width: 400,
      height: 600,
      autoRotate: false,
      mimeType: "image/png" || "image/jpg",
    };
    this.setState({ loading: true });
    const formData = new FormData();
    const token = window.localStorage.getItem("eggDrop8081porDgge");
    formData.append("message", this.messageRef.current.value);
    formData.append("longitude", this.props.eggLocation.longitude);
    formData.append("latitude", this.props.eggLocation.latitude);
    formData.append("canClaim", this.state.claim);
    if (this.state.claim === "private") {
      formData.append("privateUserId", Number(this.selectRef.current.value));
    } else {
      formData.append("privateUserId", null);
    }
    try {
      const resizedImage = await readAndCompressImage(
        this.fileInputRef.current.files[0],
        config
      );

      formData.append("image", resizedImage);
      const req = {
        method: "POST",
        headers: {
          "x-access-token": token,
        },
        body: formData,
      };
      const response = await fetch("/api/egg", req);
      const jsonRes = await response.json();
      this.setState({ loading: false });
      const createdEgg = {
        longitude: this.props.eggLocation.longitude,
        latitude: this.props.eggLocation.latitude,
        canClaim: jsonRes.canClaim,
        id: jsonRes.eggId,
      };
      this.props.drop(createdEgg);
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <div id="8" onClick={this.handleCloseModal} className="overlay">
        <div className="row justify-align-center flex-column">
          <div className="relative column-modal drop-modal">
            <form>
              <div className="p1">
                <input
                  required
                  autoFocus
                  type="text"
                  id="message"
                  name="message"
                  maxLength="120"
                  placeholder="Enter message..."
                  ref={this.messageRef}
                />
              </div>
              <div>
                {!this.state.ready ? (
                  <div className="row justify-align-center">
                    <i className="far fa-times-circle fa-2x red"></i>
                  </div>
                ) : (
                  <div className="row justify-align-center">
                    <i className="green fas fa-check-double fa-2x"></i>
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
                  onClick={this.handleReadyToSubmit}
                />
                <label htmlFor="file-upload">Upload Image</label>
                <div className="p1">
                  <p className="p1 center-text">Who can claim this egg?</p>
                </div>

                <div className="row p1 space-around flex-column">
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
                  <>{this.state.loading && <LoadingSpinner />}</>
                  <div className="p1">
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
                  <div className="p1">
                    <input
                      onChange={this.handleClaimChange}
                      className="create-egg-radio"
                      type="radio"
                      id="can-claim-private"
                      name="claimable-by"
                      value="private"
                    />
                    <label htmlFor="can-claim-private">Private</label>
                  </div>
                </div>
                <div className="row justify-align-center">
                  {this.state.private && (
                    <select ref={this.selectRef} className="select-create-egg">
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
                  disabled={!this.state.ready}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
