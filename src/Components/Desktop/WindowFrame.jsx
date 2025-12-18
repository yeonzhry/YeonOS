// src/components/Desktop/WindowFrame.jsx
import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import Draggable from 'react-draggable';
import { Minus, X, Maximize2 } from 'lucide-react';

const WindowWrapper = styled.div`
  position: absolute;
  z-index: ${props => props.zIndex};
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  transform-origin: bottom center;

  /* 최소화 스타일 */
  ${props => props.isMinimized && css`
    opacity: 0;
    transform: scale(0.1) translate(0, 400px) !important;
    pointer-events: none;
  `}

  /* 최대화 스타일 (전체화면) */
  ${props => props.isMaximized && css`
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    transform: none !important; /* 드래그 위치 초기화 */
    border-radius: 0 !important;
  `}
`;

const Frame = styled.div`
  width: ${props => props.width || '600px'};
  height: ${props => props.height || '400px'};
  
  /* 최대화 시 크기 100%로 강제 조정 */
  ${props => props.isMaximized && css`
    width: 100% !important;
    height: calc(100vh - 30px) !important;
    margin-top: 30px;
    border-radius: 0 !important;
  `}

  background-color: ${props => props.transparent ? 'transparent' : 'rgba(30, 30, 30, 0.95)'};
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  border: ${props => props.transparent ? 'none' : '1px solid #444'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const TitleBar = styled.div`
  height: ${props => props.transparent ? '50px' : '32px'};
  background-color: ${props => props.transparent ? 'transparent' : '#2d2d2d'};
  display: flex;
  align-items: center;
  padding-left: 18px;
  border-bottom: ${props => props.transparent ? 'none' : '1px solid #333'};
  cursor: grab;
  
  ${props => props.transparent && css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    /* pointer-events: none; */
  `}

  &:active {
    cursor: grabbing;
  }
`;

const TrafficContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: ${props => props.transparent ? '5px' : '0'}; 
  pointer-events: auto;
`;

const TrafficLight = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;

  svg {
    opacity: 0;
    width: 8px;
    height: 8px;
    color: rgba(0,0,0,0.6);
    transition: opacity 0.1s;
  }

  &:hover {
    filter: brightness(0.9);
    svg { opacity: 1; }
  }
`;

// [수정됨] 타이틀 정렬 변경 (가운데 -> 왼쪽)
const WindowTitle = styled.div`
  flex: 1;
  text-align: center; /* 왼쪽 정렬 */
  margin-left: -4rem;
  color: #bbb;
  font-size: 13px;
  pointer-events: none;
  display: ${props => props.transparent ? 'none' : 'block'};
`;

const ContentArea = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  background-color: ${props => props.transparent ? 'transparent' : 'transparent'};
`;

const WindowFrame = ({ 
  title, 
  children, 
  onClose, 
  onMinimize, 
  isMinimized,
  zIndex, 
  onClick, 
  width,
  height,
  transparent = false
}) => {
  const nodeRef = useRef(null);
  // [추가됨] 최대화 상태 관리
  const [isMaximized, setIsMaximized] = useState(false);

  // 최대화 토글 함수
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-handle"
      defaultPosition={{x: 0, y: 0}}
      onMouseDown={onClick}
      disabled={isMinimized || isMaximized} // 최대화 상태일 땐 드래그 방지
    >
      <WindowWrapper 
        ref={nodeRef} 
        zIndex={zIndex} 
        isMinimized={isMinimized}
        isMaximized={isMaximized} // 스타일 적용을 위해 전달
        style={!isMaximized ? { position: 'absolute', top: '15%', left: '25%' } : {}} // 최대화 아닐 때만 초기 위치 잡기
      >
        <Frame 
          width={width} 
          height={height} 
          onClick={onClick} 
          transparent={transparent}
          isMaximized={isMaximized}
        >
          <TitleBar className="window-handle" transparent={transparent}>
            <TrafficContainer transparent={transparent}>
              {/* 빨강: 닫기 */}
              <TrafficLight color="#ff5f56" onClick={(e) => { e.stopPropagation(); onClose(); }}>
                <X />
              </TrafficLight>
              {/* 노랑: 최소화 */}
              <TrafficLight color="#ffbd2e" onClick={(e) => { e.stopPropagation(); onMinimize(); }}>
                <Minus />
              </TrafficLight>
              {/* 초록: 최대화 기능 연결 */}
              <TrafficLight color="#27c93f" onClick={(e) => { e.stopPropagation(); toggleMaximize(); }}>
                <Maximize2 />
              </TrafficLight>
            </TrafficContainer>
            
            <WindowTitle transparent={transparent}>{title}</WindowTitle>
          </TitleBar>
          
          <ContentArea transparent={transparent}>
            {children}
          </ContentArea>
        </Frame>
      </WindowWrapper>
    </Draggable>
  );
};

export default WindowFrame;