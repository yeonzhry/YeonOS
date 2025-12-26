import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Draggable from 'react-draggable';
import { Minus, X, Maximize2 } from 'lucide-react';

// ============================================================
// 1. 스타일 정의
// ============================================================

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

  /* ================================================================= */
  /* [PC 최대화 수정] 메뉴바(30px) 아래 ~ Dock(약 100px) 위 영역만 차지 */
  /* ================================================================= */
  ${props => props.isMaximized && !props.isMobile && css`
    top: 30px !important;  /* 상단 메뉴바 높이만큼 띄움 */
    left: 0 !important;
    width: 100vw !important;
    
    /* 전체 높이(100vh) - 메뉴바(30px) - 독 영역(100px: 높이80+마진20) */
    height: calc(100vh - 130px) !important; 
    
    transform: none !important;
    border-radius: 0 !important;
    box-shadow: none !important; /* 꽉 찼을 땐 그림자 제거 */
  `}

  /* 모바일 강제 스타일 */
  @media (max-width: 768px) {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    
    width: ${props => props.width} !important;
    height: ${props => props.height} !important;
    
    margin: 0 !important;
    
    ${props => props.isMinimized && css`display: none !important;`}
  }
`;

const Frame = styled.div`
  width: ${props => props.width || '600px'};
  height: ${props => props.height || '400px'};
  
  /* 최대화 시 프레임도 꽉 차게 */
  ${props => props.isMaximized && !props.isMobile && css`
    width: 100% !important;
    height: 100% !important;
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

  @media (max-width: 768px) {
    width: 100% !important;
    height: 100% !important;
    border-radius: 12px;
  }
`;

const TitleBar = styled.div`
  height: ${props => props.transparent ? '50px' : '32px'};
  background-color: ${props => props.transparent ? 'transparent' : '#2d2d2d'};
  display: flex;
  align-items: center;
  padding-left: 18px;
  
  /* border-bottom: ${props => props.transparent ? 'none' : '1px solid #d1d1d1'}; */
  
  cursor: grab;
  
  ${props => props.transparent && css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    /* pointer-events: none; */
  `}

  &:active { cursor: grabbing; }
`;

const TrafficContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: ${props => props.transparent ? '5px' : '0'}; 
  pointer-events: auto;
`;

const TrafficLight = styled.div`
  width: 12px; height: 12px; border-radius: 50%;
  background-color: ${props => props.color};
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; position: relative;

  svg {
    opacity: 0; width: 8px; height: 8px; color: rgba(0,0,0,0.6);
    transition: opacity 0.1s;
  }
  
  ${props => props.disabled && css`
    cursor: default;
    &:hover { filter: none; }
    svg { display: none; }
  `}

  &:hover {
    filter: brightness(0.9);
    svg { opacity: ${props => props.disabled ? 0 : 1}; }
  }
`;

const WindowTitle = styled.div`
  flex: 1; text-align: center; margin-left: -4rem;
  color: #bbb; font-size: 13px; 
  pointer-events: auto;
  display: ${props => props.transparent ? 'none' : 'block'};
`;

const ContentArea = styled.div`
  flex: 1; overflow: hidden; position: relative;
  background-color: ${props => props.transparent ? 'transparent' : 'transparent'};
`;

// ============================================================
// 2. 컴포넌트 로직
// ============================================================

const WindowFrame = ({ 
  title, children, onClose, onMinimize, isMinimized,
  zIndex, onClick, width, height, transparent = false
}) => {
  const nodeRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMaximize = () => {
    if (!isMobile) {
      setIsMaximized(!isMaximized);
    }
  };

  const windowContent = (
    <Frame 
      width={width} 
      height={height} 
      onClick={onClick} 
      transparent={transparent}
      isMaximized={isMaximized}
      isMobile={isMobile}
    >
      <TitleBar className="window-handle" transparent={transparent}>
        <TrafficContainer transparent={transparent}>
          <TrafficLight color="#ff5f56" onClick={(e) => { e.stopPropagation(); onClose(); }}>
            <X />
          </TrafficLight>
          <TrafficLight color="#ffbd2e" onClick={(e) => { e.stopPropagation(); onMinimize(); }}>
            <Minus />
          </TrafficLight>
          <TrafficLight 
            color="#27c93f" 
            onClick={(e) => { e.stopPropagation(); toggleMaximize(); }}
            disabled={isMobile} 
          >
             <Maximize2 />
          </TrafficLight>
        </TrafficContainer>
        <WindowTitle transparent={transparent}>{title}</WindowTitle>
      </TitleBar>
      <ContentArea transparent={transparent}>
        {children}
      </ContentArea>
    </Frame>
  );

  if (isMobile) {
    return (
      <WindowWrapper 
        ref={nodeRef} 
        zIndex={zIndex} 
        isMinimized={isMinimized}
        onClick={onClick}
        width={width}
        height={height}
        isMobile={true}
      >
        {windowContent}
      </WindowWrapper>
    );
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-handle"
      defaultPosition={{x: 0, y: 0}}
      onMouseDown={onClick}
      disabled={isMinimized || isMaximized}
    >
      <WindowWrapper 
        ref={nodeRef} 
        zIndex={zIndex} 
        isMinimized={isMinimized}
        isMaximized={isMaximized}
        isMobile={false}
        style={!isMaximized ? { position: 'absolute', top: '15%', left: '25%' } : {}} 
        width={width}
        height={height}
      >
        {windowContent}
      </WindowWrapper>
    </Draggable>
  );
};

export default WindowFrame;