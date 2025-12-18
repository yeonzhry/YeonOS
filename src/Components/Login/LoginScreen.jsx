// src/components/Login/LoginScreen.js
import React from 'react';
import styled from 'styled-components';
import profile from '../../assets/profile.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  backdrop-filter: blur(10px); /* 배경 흐림 효과 (유료버전 맥 느낌) */
  background-color: rgba(0, 0, 0, 0.2);
`;

const ProfileImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-image: url(${profile}); /* 본인 프로필 이미지로 교체 */
  background-size: cover;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
`;

const Name = styled.h2`
  color: white;
  font-weight: 600;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
`;

const StartButton = styled.button`
  padding: 10px 24px;
  border-radius: 20px;
  border: none;
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(5px);

  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
  }
`;

const LoginScreen = ({ onStart }) => {
  return (
    <Container>
      <ProfileImage />
      <Name>Yeonjae</Name> 
      <StartButton onClick={onStart}>Login</StartButton>
    </Container>
  );
};

export default LoginScreen;