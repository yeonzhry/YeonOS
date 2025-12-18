// src/components/Desktop/MenuBar.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Wifi, BatteryMedium, Search, Volume2 } from 'lucide-react'; // 아이콘

const BarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30px; /* 맥 상단바 표준 높이 */
  background-color: rgba(255, 255, 255, 0.3); /* 반투명 배경 */
  backdrop-filter: blur(20px); /* 블러 효과 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 10000; /* 모든 창보다 위에 있어야 함 */
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  color: #333; /* 글씨 색상 */
  user-select: none;
`;

// 왼쪽 메뉴 영역
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const AppleLogo = styled.span`
  font-size: 16px;
  cursor: pointer;
  &:hover { opacity: 0.7; }
`;

const AppName = styled.span`
  font-weight: 700; /* 현재 실행중인 앱 이름은 굵게 */
  cursor: pointer;
`;

const MenuItem = styled.span`
  cursor: pointer;
  &:hover { opacity: 0.7; }
  
  /* 모바일 등 좁은 화면에서는 숨기기 (반응형) */
  @media (max-width: 600px) {
    display: none;
  }
`;

// 오른쪽 상태 영역
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  /* 아이콘 스타일 통일 */
  svg {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

const Clock = styled.span`
  font-weight: 500;
  cursor: default;
`;

const MenuBar = () => {
  const [time, setTime] = useState(new Date());

  // 1초마다 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 날짜/시간 포맷팅 (예: 12월 16일 (화) 오후 10:53)
  const formatTime = (date) => {
    const options = { 
      month: 'short', 
      day: 'numeric', 
      weekday: 'short', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    };
    return date.toLocaleString('ko-KR', options); 
    // 영문을 원하시면 'en-US'로 바꾸세요.
  };

  return (
    <BarContainer>
      <LeftSection>
        {/* 맥 특수문자 로고 (윈도우에선 안 보일 수 있으므로 이미지가 안전하긴 함) */}
        <AppleLogo></AppleLogo> 
        
        {/* 현재 활성화된 앱 이름 (고정값으로 일단 둡니다) */}
        <AppName>YeonJae</AppName> 
        
        <MenuItem>File</MenuItem>
        <MenuItem>Edit</MenuItem>
        <MenuItem>View</MenuItem>
        <MenuItem>Go</MenuItem>
        <MenuItem>Window</MenuItem>
        <MenuItem>Help</MenuItem>
      </LeftSection>

      <RightSection>
        <Volume2 strokeWidth={2.5} />
        <Wifi strokeWidth={2.5} />
        <BatteryMedium strokeWidth={2.5} />
        <Search strokeWidth={2.5} />
        
        {/* 실제 시간 표시 */}
        <Clock>{formatTime(time)}</Clock>
      </RightSection>
    </BarContainer>
  );
};

export default MenuBar;