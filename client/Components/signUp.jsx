import React, { useState } from 'react';
import Input from '../UI/input';
import ColumnWrapper from '../UI/column-wrapper';
import Button from '../UI/button';

const SignUp = props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [email, setEmail] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [validSignUp, setValidSignUp] = useState(null);

  const usernameChangeHandler = event => setUsername(event.target.value);
  const passwordChangeHandler = event => setPassword(event.target.value);
  const retypePasswordChangeHandler = event => setRetypePassword(event.target.value);
  const emailChangeHandler = event => setEmail(event.target.value);

  const userSubmissionData = { username, password, retypePassword, email };

  const closeSignUpHandler = e => {
    if (e.target.id === 'overlay') props.closeModal();
  };

  const signUpHandler = data => {
    fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (!res.ok) setValidSignUp(false);
        else return res.json();
      })
      .then(res => {
        setValidSignUp(true);
        props.setNewUser(res);
      }).catch(err => console.error(err));
  };

  const sendSubmissionData = () => {
    if (userSubmissionData.password !== userSubmissionData.retypePassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
      signUpHandler({ username: userSubmissionData.username, password: userSubmissionData.password, email: userSubmissionData.email });
    }
  };

  return (
    <div className="overlay" id='overlay' onClick={closeSignUpHandler}>
      <ColumnWrapper className={'sign-up-column'}>
          <Input className={'sign-up-input'} type={'text'} id={'Username'} onChange={usernameChangeHandler}/>
          <Input className={'sign-up-input'} type={'password'} id={'Password'} onChange={passwordChangeHandler}/>
          <Input className={'sign-up-input'} type={'password'} id={'Re-enter Password'} onChange={retypePasswordChangeHandler}/>
          {passwordMatch === false ? <div className="justify-align-center"><p className="passwordCheck">Passwords must match...</p></div> : ''}
          <Input className={'sign-up-input'} type={'email'} id={'Email'} onChange={emailChangeHandler} />
          {validSignUp === false && <div className="justify-align-center"><p className="password-check">Passwords must match...</p></div>}
          <Button text={'Submit'} diabled={!passwordMatch} className={'submit-sign-up'} click={username.length > 0 ? sendSubmissionData : props.closeModal} />
      </ColumnWrapper>
    </div>
  );
};

export default SignUp;
