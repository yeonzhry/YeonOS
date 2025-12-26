// src/components/Desktop/MenuBar.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Wifi, BatteryMedium, Search, Volume2 } from 'lucide-react';

const BarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 10000;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  color: #333;
  user-select: none;

  /* [Mobile] 좌우 패딩 축소 */
  @media (max-width: 768px) {
    padding: 0 12px;
  }
`;

// 왼쪽 메뉴 영역
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  /* [Mobile] 간격 축소 */
  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const AppleLogo = styled.span`
  font-size: 16px;
  cursor: pointer;
  &:hover { opacity: 0.7; }
`;

const AppName = styled.span`
  font-weight: 700;
  cursor: pointer;
`;

const MenuItem = styled.span`
  cursor: pointer;
  &:hover { opacity: 0.7; }
  
  /* [Mobile] 공간이 좁으므로 메뉴 항목 숨기기 */
  @media (max-width: 768px) {
    display: none;
  }
`;

// 오른쪽 상태 영역
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  svg {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  /* [Mobile] 간격 축소 */
  @media (max-width: 768px) {
    gap: 10px;
  }
`;

// [Mobile] 좁은 화면에서 숨길 아이콘들을 위한 스타일
const HideOnMobile = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Clock = styled.span`
  font-weight: 500;
  cursor: default;
  /* 모바일에서는 폰트를 조금 작게 */
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const MenuBar = () => {
  const [time, setTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // 1. 시간 업데이트 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. 화면 크기 감지 (날짜 포맷 변경용)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const formatTime = (date) => {
    if (isMobile) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }

    // 데스크탑: 전체 날짜 표시 (예: Dec 26 (Fri) 6:05 PM)
    // Intl.DateTimeFormat을 사용하여 커스텀 포맷 구성
    const dateOptions = { month: 'short', day: 'numeric', weekday: 'short' };
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    
    const datePart = date.toLocaleDateString('en-US', dateOptions); // "Dec 26, Fri"
    const timePart = date.toLocaleTimeString('en-US', timeOptions); // "6:05 PM"
    
    // 포맷 합치기 (맥북 스타일: 날짜 + 시간)
    return `${datePart} ${timePart}`; 
  };

  return (
    <BarContainer>
      <LeftSection>
        <AppleLogo></AppleLogo> 
        <AppName>YeonJae</AppName> 
        
        {/* 모바일에서는 아래 메뉴들이 숨겨짐 */}
        <MenuItem>File</MenuItem>
        <MenuItem>Edit</MenuItem>
        <MenuItem>View</MenuItem>
        <MenuItem>Go</MenuItem>
        <MenuItem>Window</MenuItem>
        <MenuItem>Help</MenuItem>
      </LeftSection>

      <RightSection>
        {/* 모바일에서는 소리, 검색 아이콘 숨김 */}
        <HideOnMobile>
          <Volume2 strokeWidth={2.5} style={{ marginRight: 2 }} />
        </HideOnMobile>
        <HideOnMobile>
          <Search strokeWidth={2.5} style={{ marginRight: 2 }} />
        </HideOnMobile>

        {/* 와이파이와 배터리는 항상 표시 */}
        <Wifi strokeWidth={2.5} />
        <BatteryMedium strokeWidth={2.5} />
        
        <Clock>{formatTime(time)}</Clock>
      </RightSection>
    </BarContainer>
  );
};

export default MenuBar;