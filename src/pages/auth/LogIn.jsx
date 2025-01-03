import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import AuthLayout from './components/AuthLayout';
import AuthInput from './components/AuthInput';
import { Chat } from '@/assets/icons';
import { useAuth } from '@/hooks/useAuth';

const LogIn = () => {
  useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [emailError, setEmailError] = useState(
    'Please fill out the correct email format',
  );
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    const emailIsValid = validateEmail(email);
    setIsEmailValid(emailIsValid);
    setIsPasswordValid(true);
    console.log(email);
    console.log(password);

    if (!emailIsValid) {
      emailRef.current?.focus();
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/accounts/login/`,
        { email, password },
      );

      localStorage.setItem('username', response.data.data.username);
      localStorage.setItem('token', response.data.data.access_token);
      localStorage.setItem('id', response.data.data.id);
      navigate(`/home/${response.data.data.id}`);
    } catch (error) {
      if (error.response?.status === 400) {
        setIsEmailValid(false);
        setEmailError('This account does not exist');
        emailRef.current?.focus();
      } else if (error.response?.status === 401) {
        setIsPasswordValid(false);
        passwordRef.current?.focus();
      }
    }
  };

  const handleKakaoLogin = () => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}&response_type=code`;

    window.location.replace(KAKAO_AUTH_URL);
  };

  return (
    <AuthLayout title="Log in to I WANT IT!">
      <AuthInput
        ref={emailRef}
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        isValid={isEmailValid}
        errorText={emailError}
      />
      <AuthInput
        ref={passwordRef}
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        isValid={isPasswordValid}
        errorText="Please fill out a valid password"
      />
      <Button>
        <BtnIn onClick={() => navigate('/signup')}>Sign up</BtnIn>
        <BtnIn style={{ backgroundColor: 'black' }} onClick={handleLogin}>
          Log in
        </BtnIn>
      </Button>
      <BtnKakao onClick={handleKakaoLogin}>
        <Chat />
        <KakaoP>Log in with Kakao</KakaoP>
      </BtnKakao>
    </AuthLayout>
  );
};

export default LogIn;

const Button = styled.div`
  display: flex;
  width: fit-content;
  margin: 0.5rem auto 1.4rem;
  gap: 0.88rem;
`;

const BtnIn = styled.button`
  all: unset;
  cursor: pointer;
  ${({ theme }) => theme.font.m_btn}
  color: white;
  background-color: ${({ theme }) => theme.color.orange};
  padding: 0.25rem 0.75rem;
`;

const BtnKakao = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  margin-top: 1rem;
  border: 1px solid black;
  background: linear-gradient(90deg, #87dbe9 0%, #fff 125.31%);
  cursor: pointer;
`;

const KakaoP = styled.p`
  ${({ theme }) => theme.font.common_input};
  color: black;
`;
