// src/App.js
import React, { useState } from 'react';
import styled from 'styled-components';
import GlobalStyle from './GlobalStyle';
import LoginScreen from './Components/Login/LoginScreen';
import DesktopScreen from './Components/Desktop/DesktopScreen';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #E8F5D2; /* 요청하신 배경 컬러 적용 */
  position: relative;
  
  /* 배경이 밝은 색이므로 텍스트 가독성을 위해 기본 색상을 어둡게 조정할 수 있습니다 */
  color: #333; 
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        {isLoggedIn ? (
          <DesktopScreen />
        ) : (
          <LoginScreen onStart={handleLogin} />
        )}
      </AppContainer>
    </>
  );
}

export default App;