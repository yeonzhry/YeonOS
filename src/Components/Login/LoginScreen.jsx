// src/components/Login/LoginScreen.js
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import profile from '../../assets/Profile.png';

// 1. 로딩 바 애니메이션 정의
const fillBar = keyframes`
  0% { width: 0%; }
  100% { width: 100%; }
`;

// --- 기존 스타일 (변경 없음) ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%; /* 부모 컨테이너 높이에 따름 (보통 100vh) */
  width: 100%;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.2);
`;

const ProfileImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-image: url(${profile});
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

// --- 새로 추가된 로딩 바 스타일 ---
// 버튼 위치에 대신 나타날 트랙
const LoadingTrack = styled.div`
  width: 140px; /* 버튼과 비슷한 너비 */
  height: 6px;
  background-color: rgba(255, 255, 255, 0.3); /* 버튼과 같은 반투명 배경 */
  border-radius: 3px;
  overflow: hidden;
  margin-top: 10px; /* 버튼과의 위치 보정 */
`;


const LoadingFill = styled.div`
  height: 100%;
  background-color: white;
  border-radius: 3px;
  animation: ${fillBar} 2s ease-in-out forwards;
`;

const LoginScreen = ({ onStart }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);

    setTimeout(() => {
      onStart();
    }, 2000);
  };

  return (
    <Container>
      <ProfileImage />
      <Name>Yeonjae</Name>
      

      {!isLoggingIn ? (
        <StartButton onClick={handleLogin}>Login</StartButton>
      ) : (
        <LoadingTrack>
          <LoadingFill />
        </LoadingTrack>
      )}
    </Container>
  );
};

export default LoginScreen;