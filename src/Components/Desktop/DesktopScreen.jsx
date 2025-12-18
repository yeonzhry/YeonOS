import React, { useState } from 'react';
import styled from 'styled-components';

// =========================================================
// 1. 컴포넌트 Import
// =========================================================
import WindowFrame from './WindowFrame';       
import TerminalWindow from './Terminal'; 
import AboutMeWindow from './AboutMe';   
import ProjectsWindow from './Project';
import MusicWindow from './Music';
import GuestBookWindow from './GuestBook';
import GarageBandWindow from './GarageBand';
import MenuBar from './MenuBar';   

// =========================================================
// 2. 이미지 Import
// =========================================================
import folderIconImg from '../../assets/icons/Folders.png';
import memoIconImg from '../../assets/icons/Memo.png';
import githubIconImg from '../../assets/icons/Github.png';
import musicIconImg from '../../assets/icons/Music.png';
import terminalIconImg from '../../assets/icons/Terminal.png';
import safariIconImg from '../../assets/icons/Safari.png';
import settingIconImg from '../../assets/icons/Setting.png';
import garageIconImg from '../../assets/icons/GarageBand.png';

// =========================================================
// 3. 스타일 정의
// =========================================================

const DesktopContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

// [수정] 아이콘들이 자유롭게 배치될 전체 영역
const ScatterContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 아이콘 없는 빈 공간은 클릭 통과 */
  z-index: 0;
`;

// [수정] 좌표를 받아 배치되는 아이콘 래퍼
const ScatteredIconWrapper = styled.div`
  position: absolute;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  
  width: 85px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid transparent;
  pointer-events: auto; /* 아이콘은 클릭 가능 */
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
    z-index: 10;
  }
`;

const IconImg = styled.div`
  width: 64px;
  height: 64px;
  background-image: url(${props => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-bottom: 8px;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.3));
`;

const IconText = styled.span`
  color: #333;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  text-shadow: 0 1px 1px rgba(255,255,255,0.8);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const StickyNote = styled.div`
  position: absolute;
  top: 150px;
  right: 150px;
  width: 240px;
  height: 180px;
  background-color: #d1fffc;
  border: 1px solid #aee2ef;
  padding: 20px;
  /* box-shadow: 2px 4px 10px rgba(0,0,0,0.1); */
  color: #4a4a4a;
  
  h3 {
    margin-bottom: 15px;
    font-size: 18px;
    padding-bottom: 5px;
  }
  p {
    font-size: 15px;
    line-height: 1.4;
  }
`;

const Dock = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  height: 80px;
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.3);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: end;
  padding: 10px 15px;
  gap: 10px;
  z-index: 9999;
`;

const DockIcon = styled.div`
  width: 55px;
  height: 55px;
  background-image: url(${props => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2));
  position: relative;

  &:hover {
    transform: scale(1.2) translateY(-15px);
  }

  ${props => props.isOpen && `
    &::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      background-color: #333;
      border-radius: 50%;
    }
  `}
  
  &.separator {
    width: 1px;
    height: 45px;
    background-color: rgba(0,0,0,0.1);
    margin: 0 5px;
    background-image: none;
    filter: none;
    pointer-events: none;
    &:hover { transform: none; }
  }
`;


// =========================================================
// 4. 메인 컴포넌트 로직
// =========================================================

const DesktopScreen = () => {
  const [windows, setWindows] = useState({
    terminal: { isOpen: false, isMinimized: false, zIndex: 10 },
    about: { isOpen: false, isMinimized: false, zIndex: 10 },
    project: { isOpen: false, isMinimized: false, zIndex: 10 },
    music: { isOpen: false, isMinimized: false, zIndex: 10 }, 
    garage: { isOpen: false, isMinimized: false, zIndex: 10 }, 
    guest: { isOpen: false, isMinimized: false, zIndex: 10 },
  });

  const [topZIndex, setTopZIndex] = useState(10);

  const openWindow = (id) => {
    setTopZIndex(prev => prev + 1);
    setWindows(prev => ({
      ...prev,
      [id]: { isOpen: true, isMinimized: false, zIndex: topZIndex + 1 }
    }));
  };

  const closeWindow = (id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false }
    }));
  };

  const minimizeWindow = (id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true }
    }));
  };

  const handleDockClick = (id) => {
    const win = windows[id];
    if (win.isOpen) {
      if (win.isMinimized) {
        openWindow(id); 
      } else {
        minimizeWindow(id);
      }
    } else {
      openWindow(id);
    }
  };

  // [설정] 아이콘 위치 좌표 (top, left %)
  const icons = [
    { id: 'about', label: 'About Me', icon: settingIconImg, action: () => openWindow('about'), top: 35, left: 46 },
    { id: 'project', label: 'Projects', icon: folderIconImg, action: () => openWindow('project'), top: 29, left: 35 },
    { id: 'music', label: 'Music', icon: musicIconImg, action: () => openWindow('music'), top: 45, left: 31 },
    { id: 'terminal', label: 'Terminal', icon: terminalIconImg, action: () => openWindow('terminal'), top: 60, left: 45 },
    { id: 'guest', label: 'GuestBook', icon: memoIconImg, action: () => openWindow('guest'), top: 46, left: 60 },
    { id: 'garage', label: 'GarageBand', icon: garageIconImg, action: () => openWindow('garage'), top: 28, left: 56 },
  ];

  return (
    <DesktopContainer>
      <MenuBar />

      {/* --- 윈도우 창들 --- */}
      {windows.terminal.isOpen && (
        <WindowFrame
          title="yeonjae — -zsh — 80x24"
          width="600px" height="400px"
          zIndex={windows.terminal.zIndex}
          isMinimized={windows.terminal.isMinimized}
          onClose={() => closeWindow('terminal')}
          onMinimize={() => minimizeWindow('terminal')}
          onClick={() => openWindow('terminal')}
        >
          <TerminalWindow openApp={openWindow} />
        </WindowFrame>
      )}

      {windows.about.isOpen && (
        <WindowFrame
          title="Apple Account"
          width="850px" height="600px"
          zIndex={windows.about.zIndex}
          isMinimized={windows.about.isMinimized}
          onClose={() => closeWindow('about')}
          onMinimize={() => minimizeWindow('about')}
          onClick={() => openWindow('about')}
          transparent={true}
        >
          <AboutMeWindow />
        </WindowFrame>
      )}

      {windows.project.isOpen && (
        <WindowFrame
          title="Finder"
          width="950px" height="600px"
          zIndex={windows.project.zIndex}
          isMinimized={windows.project.isMinimized}
          onClose={() => closeWindow('project')}
          onMinimize={() => minimizeWindow('project')}
          onClick={() => openWindow('project')}
          transparent={true}
        >
          <ProjectsWindow />
        </WindowFrame>
      )}

      {windows.music.isOpen && (
        <WindowFrame
          title="Music"
          width="300px" height="580px"
          zIndex={windows.music.zIndex}
          isMinimized={windows.music.isMinimized}
          onClose={() => closeWindow('music')}
          onMinimize={() => minimizeWindow('music')}
          onClick={() => openWindow('music')}
          transparent={true}
        >
          <MusicWindow />
        </WindowFrame>
      )}

      {windows.garage.isOpen && (
        <WindowFrame
          title="GarageBand - Synth"
          width="650px" height="300px"
          zIndex={windows.garage.zIndex}
          isMinimized={windows.garage.isMinimized}
          onClose={() => closeWindow('garage')}
          onMinimize={() => minimizeWindow('garage')}
          onClick={() => openWindow('garage')}
          transparent={false}
        >
          <GarageBandWindow />
        </WindowFrame>
      )}

      {windows.guest.isOpen && (
        <WindowFrame
          title="Guest Book"
          width="800px" height="550px"
          zIndex={windows.guest.zIndex}
          isMinimized={windows.guest.isMinimized}
          onClose={() => closeWindow('guest')}
          onMinimize={() => minimizeWindow('guest')}
          onClick={() => openWindow('guest')}
          transparent={true}
        >
          <GuestBookWindow />
        </WindowFrame>
      )}

      {/* --- [수정됨] 자유 배치된 바탕화면 아이콘들 --- */}
      <ScatterContainer>
        {icons.map((item) => (
          <ScatteredIconWrapper 
            key={item.id}
            top={item.top} 
            left={item.left}
            onClick={item.action}
          >
            <IconImg src={item.icon} />
            <IconText>{item.label}</IconText>
          </ScatteredIconWrapper>
        ))}
      </ScatterContainer>

      {/* --- 메모장 --- */}
      <StickyNote>
        <h3>Welcome to Yeonjae's Portfolio! <br/>

        </h3>
        <p>
         Enjoy the journey ~
        </p>
      </StickyNote>

      {/* --- 하단 독(Dock) --- */}
      <Dock>
        <DockIcon src={folderIconImg} onClick={() => handleDockClick('project')} isOpen={windows.project.isOpen} />
        <DockIcon src={terminalIconImg} onClick={() => handleDockClick('terminal')} isOpen={windows.terminal.isOpen}  />
        <DockIcon src={musicIconImg} onClick={() => handleDockClick('music')} isOpen={windows.music.isOpen} />

        <DockIcon src={memoIconImg} onClick={() => handleDockClick('guest')} isOpen={windows.guest.isOpen} /> 
          
        <DockIcon src={garageIconImg} onClick={() => handleDockClick('garage')} isOpen={windows.garage.isOpen} />
        <DockIcon src={settingIconImg} onClick={() => handleDockClick('about')} isOpen={windows.project.isOpen} />

        <DockIcon className="separator" />

        <DockIcon 
          src={githubIconImg} 
          onClick={() => window.open('https://github.com/yeonzhry/YeonOS', '_blank')} 
        />

      </Dock>
    </DesktopContainer>
  );
};

export default DesktopScreen;