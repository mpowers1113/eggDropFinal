import React, { useEffect, useState } from 'react';
import InstructionsButton from '../UI/instructionsButton';
import Instructions from './instructions';
import Logo from '../UI/logo';
import Button from '../UI/button';
import Input from '../UI/input';
import Divider from '../UI/divider';
import ColumnWrapper from '../UI/column-wrapper';
import SignUp from './signUp';
import ClientError from '../../server/client-error';
import decodeToken from '../lib/decode-token';
import Map from './map';
import { UserContext } from '../Context/userContext';

const Login = props => {
  const [signUp, setSignUp] = useState(false);
  const [instructions, setInstructions] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validLoginInput, setValidLoginInput] = useState(true);
  const [user, setUser] = useState(null);

  const loginClickHandler = () => sendLoginData(loginData);
  const signUpClickHandler = () => setSignUp(!signUp);
  const toggleInstructionsHandler = () => setInstructions(!instructions);

  const onFocusInputHandler = () => setValidLoginInput(true);
  const usernameHandler = event => setUsername(event.target.value);
  const passwordHandler = event => setPassword(event.target.value);
  const loginData = { username: username, password: password };

  useEffect(() => {
    const token = window.localStorage.getItem('eggDrop8081proDgge');
    const user = token ? decodeToken(token) : null;
    user && setUser({ username: user.username, id: user.id });
  }, []);

  const sendLoginData = userLoginData => {
    if (loginData.username.length === 0 || loginData.password.length === 0) {
      setValidLoginInput('empty');
      return;
    }
    fetch('http://localhost:3000/api/auth/sign-in', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userLoginData)
    }).then(res => {
      if (!res.ok) {
        setValidLoginInput('invalid');
        throw new ClientError('something went wrong in your login');
      } else {
        return res.json();
      }
    })
      .then(res => {
        const { token, user } = res;
        window.localStorage.setItem('eggDrop8081proDgge', token);
        setUser({ username: loginData.username, id: user.id });
      }).catch(err => console.error(err));
  };

  return (
    <div>
      {signUp && !user && <SignUp closeModal={signUpClickHandler} setNewUser={setUser}/>}
      {!instructions && <InstructionsButton click={toggleInstructionsHandler} />}
      {instructions && <Instructions onFinish={toggleInstructionsHandler} />}
      {user && <UserContext.Provider value={user}><Map /></UserContext.Provider>}
      {!user && <ColumnWrapper>
        <Logo />
        <Input onFocus={onFocusInputHandler} onChange={usernameHandler} className={'sign-up-input login'} type={'text'} id={'username'} />
        <Input onFocus={onFocusInputHandler} className={'sign-up-input mb1'} type={'password'} id={'password'} onChange={passwordHandler} />
        {validLoginInput === 'empty' && <div className="row justify-align-center"><p className="password-check">username and password cannot be empty</p></div>}
        {validLoginInput === 'invalid' && <div className="row justify-align-center"><p className="password-check">invalid login</p></div>}
        <Button text={'Login'} click={loginClickHandler} />
        <Button text={'Sign Up'} click={signUpClickHandler} />
        <Divider text={'OR'} />
        <Button click={() => setUser({ username: 'Guest', id: 1 })} text={'Guest'} />
      </ColumnWrapper>
      }
    </div>
  );
};

export default Login;
