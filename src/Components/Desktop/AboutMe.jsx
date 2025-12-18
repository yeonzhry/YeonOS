import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { 
  User, Layers, Briefcase, Smile, 
  Search, Code, PenTool
} from 'lucide-react';

import profile from '../../assets/Profile.png';


// ==================== 스타일 정의 ====================

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #1d1d1f;
  background-color: #f2f2f7;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #d1d1d1;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  padding: 50px 10px 20px 10px;
  border-right: 1px solid #d1d1d1;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #e3e3e4;
  border-radius: 6px;
  padding: 6px 10px;
  margin-bottom: 15px;
  color: #888;
  font-size: 13px;
  svg { width: 14px; height: 14px; margin-right: 6px; }
`;

const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  
  .avatar {
    width: 40px; height: 40px;
    border-radius: 50%;
    background-color: #fff;
    background-image: url(${profile});
    background-size: cover;
    margin-right: 10px;
    border: 1px solid #ccc;
  }
  
  .text {
    display: flex; flex-direction: column;
    .name { font-size: 14px; font-weight: 600; }
    .email { font-size: 11px; color: #666; }
  }
`;

const MenuList = styled.div`
  display: flex; flex-direction: column; gap: 2px;
`;

const MenuItem = styled.div`
  display: flex; align-items: center;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  
  /* 활성화 상태 스타일 */
  background-color: ${props => props.active ? '#007aff' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#1d1d1f'};

  &:hover {
    background-color: ${props => props.active ? '#007aff' : 'rgba(0,0,0,0.05)'};
  }

  .icon-box {
    width: 22px; height: 22px;
    border-radius: 6px;
    background-color: ${props => props.active ? 'rgba(255,255,255,0.2)' : props.iconColor};
    display: flex; align-items: center; justify-content: center;
    margin-right: 10px;
    svg { width: 14px; height: 14px; color: #fff; }
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 50px 40px;
  overflow-y: auto;
  scroll-behavior: smooth; /* 부드러운 스크롤 */
  position: relative;
`;

const BigProfile = styled.div`
  display: flex; flex-direction: column; align-items: center;
  margin-bottom: 40px; margin-top: 10px;
  
  .avatar {
    width: 80px; height: 80px;
    border-radius: 50%;
    background-image: url(${profile});
    background-size: cover;
    margin-bottom: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .name { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
  .desc { font-size: 13px; color: #86868b; }
`;

const SectionContainer = styled.div`
  margin-bottom: 60px; /* 섹션 간 간격 */
  
  /* 마지막 섹션은 스크롤 여유를 위해 패딩 추가 */
  &:last-child {
    padding-bottom: 100px; 
  }
`;

const SectionTitle = styled.h3`
  font-size: 13px; color: #666; margin-bottom: 8px;
  padding-left: 5px; text-transform: uppercase;
`;

const SettingsGroup = styled.div`
  width: 100%; max-width: 500px;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #e5e5e5;
  overflow: hidden;
  margin-bottom: 15px;
`;

const SettingItem = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f2f2f7;
  font-size: 13px;

  &:last-child { border-bottom: none; }

  .label { font-weight: 500; min-width: 80px; color: #333; }
  .value { color: #666; text-align: right; flex: 1; }
  
  .tags {
    display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end;
    span {
      background: #f2f2f7; padding: 4px 8px; border-radius: 4px;
      color: #333; font-size: 12px; font-weight: 500;
    }
  }
`;

const AboutMeWindow = () => {
  const [activeTab, setActiveTab] = useState('personal');

  // 각 섹션으로 이동하기 위한 Ref 생성
  const sectionRefs = {
    personal: useRef(null),
    skills: useRef(null),
    career: useRef(null),
    intro: useRef(null),
  };

  // 왼쪽 메뉴 데이터
  const menuItems = [
    { id: 'personal', text: 'Personal', icon: <User />, color: '#007aff' },
    { id: 'skills',   text: 'Skills', icon: <Layers />, color: '#ff9500' },
    { id: 'career',   text: 'Experience', icon: <Briefcase />, color: '#34c759' },
    { id: 'intro',    text: 'About', icon: <Smile />, color: '#5856d6' },
  ];

  // 클릭 시 해당 섹션으로 스크롤 이동
  const scrollToSection = (id) => {
    setActiveTab(id);
    sectionRefs[id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // 스크롤 시 현재 보이는 섹션을 감지하여 왼쪽 메뉴 하이라이트 변경
  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollTop + 100; // 보정값
    
    // 각 섹션의 위치를 확인
    for (const item of menuItems) {
      const element = sectionRefs[item.id].current;
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveTab(item.id);
        }
      }
    }
  };

  return (
    <Container>
      {/* 왼쪽 사이드바 */}
      <Sidebar>
        <SearchBar><Search /> 검색</SearchBar>
        
        <ProfileCard>
          <div className="avatar" />
          <div className="text">
            <span className="name">Yeonjae</span>
            <span className="email">yeonzhry@gmail.com</span>
          </div>
        </ProfileCard>

        <MenuList>
          {menuItems.map((item) => (
            <MenuItem 
              key={item.id} 
              active={activeTab === item.id} 
              iconColor={item.color}
              onClick={() => scrollToSection(item.id)}
            >
              <div className="icon-box">{item.icon}</div>
              {item.text}
            </MenuItem>
          ))}
        </MenuList>
      </Sidebar>

      {/* 오른쪽 콘텐츠 (스크롤 영역) */}
      <Content onScroll={handleScroll}>
        <BigProfile>
          <div className="avatar" />
          <div className="name">Yeonjae Lee</div>
          <div className="desc">Frontend Developer</div>
        </BigProfile>

        {/* 1. 개인정보 섹션 */}
        <SectionContainer ref={sectionRefs.personal}>
          <SectionTitle>Personal Information</SectionTitle>
          <SettingsGroup>
            <SettingItem>
              <span className="label">Name</span>
              <span className="value">Yeonjae Lee</span>
            </SettingItem>
            <SettingItem>
              <span className="label">Birth</span>
              <span className="value">2005.01.04</span>
            </SettingItem>
            <SettingItem>
              <span className="label">Residance</span>
              <span className="value">Seoul</span>
            </SettingItem>
            <SettingItem>
              <span className="label">E-mail</span>
              <span className="value" style={{color:'#007aff'}}>yeonzhry@gmail.com</span>
            </SettingItem>
          </SettingsGroup>
          
          <SectionTitle>Education</SectionTitle>
          <SettingsGroup>
            <SettingItem>
              <span className="label">University</span>
              <span className="value">Sogang Univ. Art&Technology</span>
            </SettingItem>
          </SettingsGroup>
        </SectionContainer>

        {/* 2. 기술 스택 섹션 */}
        <SectionContainer ref={sectionRefs.skills}>
          <SectionTitle>Skills</SectionTitle>
          <SettingsGroup>
            <SettingItem>
              <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                <Code size={16} color="#007aff"/> <span className="label">Frontend</span>
              </div>
              <div className="tags">
                <span>React</span>
                <span>JavaScript</span>
                <span>HTML/CSS</span>
                <span>Three.js</span>
                <span>Styled-Components</span>
              </div>
            </SettingItem>
            <SettingItem>
              <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                <PenTool size={16} color="#ff2d55"/> <span className="label">Design</span>
              </div>
              <div className="tags">
                <span>Figma</span>
                <span>Illustrator</span>

              </div>
            </SettingItem>
            
          </SettingsGroup>
        </SectionContainer>

        {/* 3. 경력 사항 섹션 */}
        <SectionContainer ref={sectionRefs.career}>
          <SectionTitle>Experience</SectionTitle>
          <SettingsGroup>
            <SettingItem style={{display:'block'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
                <span style={{fontWeight:'600'}}>인액터스 서강</span>
                <span style={{color:'#888', fontSize:'12px'}}>2025.09 - 현재</span>
              </div>
              <div style={{color:'#007aff', fontSize:'12px', marginBottom:'8px'}}></div>
              <div style={{lineHeight:'1.5', color:'#555', fontSize:'12px'}}>
                디어풋 팀원<br/>
                비주얼 팀원
              </div>
            </SettingItem>
          </SettingsGroup>
          <SettingsGroup>
            <SettingItem style={{display:'block'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
                <span style={{fontWeight:'600'}}>제11회 국제한국학포럼</span>
                <span style={{color:'#888', fontSize:'12px'}}>2025.03 - 2025.09</span>
              </div>
              <div style={{lineHeight:'1.5', color:'#555', fontSize:'12px'}}>
                웹팀원
              </div>
            </SettingItem>
          </SettingsGroup>
        </SectionContainer>

        {/* 4. 자기소개 섹션 */}
        <SectionContainer ref={sectionRefs.intro}>
          <SectionTitle>Introduction</SectionTitle>
          <SettingsGroup>
            <div style={{padding:'20px', lineHeight:'1.6', color:'#333', fontSize:'14px'}}>
              <p style={{marginBottom:'10px'}}>
                <strong>"사용자 경험을 최우선으로 생각합니다."</strong>
              </p>
              <p style={{color:'#555'}}>
                디자인과 개발의 경계를 넘나들며 완성도 있는 웹 경험을 만드는 데 관심이 있습니다.
              </p>
            </div>
          </SettingsGroup>
          <SectionTitle>Keywords</SectionTitle>
          <SettingsGroup>
            <div style={{padding:'15px', display:'flex', gap:'10px', flexWrap:'wrap'}}>
              <span style={{background:'#eef2ff', color:'#4f46e5', padding:'6px 12px', borderRadius:'20px', fontSize:'13px'}}>#Frontend</span>
              <span style={{background:'#ecfdf5', color:'#059669', padding:'6px 12px', borderRadius:'20px', fontSize:'13px'}}>#Design</span>
              <span style={{background:'#ecfdf5', color:'#057296', padding:'6px 12px', borderRadius:'20px', fontSize:'13px'}}>#UI/UX</span>

            </div>
          </SettingsGroup>
        </SectionContainer>

      </Content>
    </Container>
  );
};

export default AboutMeWindow;