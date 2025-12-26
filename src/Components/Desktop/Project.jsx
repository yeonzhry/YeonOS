import React, { useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { 
  ChevronLeft, ChevronRight, Search, 
  LayoutGrid, List, Columns, 
  Folder, Code, PenTool, Calendar, 
  Github, ExternalLink, 
  Sidebar as SidebarIcon, ZoomIn, ZoomOut, Share, PenLine, 
  ArrowLeft 
} from 'lucide-react';

// [이미지 Import]
import project1Img from '../../assets/images/artist.png';
import project2Img from '../../assets/images/GKSF.png';
import project3Img from '../../assets/images/Weaw.png';
import project4Img from '../../assets/images/HAMONY.png';
import project5Img from '../../assets/images/Discord.png';
import project6Img from '../../assets/images/Dacapo.png';
import project7Img from '../../assets/images/yeonjae.png';
import project8Img from '../../assets/images/HOLDUS.png';

import project3Img2 from '../../assets/images/Weaw2.png';
import project3Img3 from '../../assets/images/Weaw3.png';
import project3Img4 from '../../assets/images/Weaw4.mp4';

import project4Img2 from '../../assets/images/Hamony1.mov';
import project4Img3 from '../../assets/images/Hamony2.mov';


import project5Img2 from '../../assets/images/D1.png';
import project5Img3 from '../../assets/images/D2.png';
import project5Img4 from '../../assets/images/D3.png';
import project5Img5 from '../../assets/images/D4.png';
import project5Img6 from '../../assets/images/D5.png';
import project5Img7 from '../../assets/images/D6.png';
import project5Img8 from '../../assets/images/D7.png';
import project5Img9 from '../../assets/images/Discord.mov';


import project6Img2 from '../../assets/images/Dacapo2.png';
import project6Img3 from '../../assets/images/Dacapo3.png';
import project6Img4 from '../../assets/images/Dacapo4.png';





import project8Img2 from '../../assets/images/2.png';
import project8Img3 from '../../assets/images/3.png';
import project8Img4 from '../../assets/images/4.png';
import project8Img5 from '../../assets/images/5.png';
import project8Img6 from '../../assets/images/6.png';
import project8Img7 from '../../assets/images/7.png';
import project8Img8 from '../../assets/images/8.png';
import project8Img9 from '../../assets/images/9.png';

// ==================== 스타일 정의 ====================

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #fff;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  border-radius: 12px;
  overflow: hidden;
  flex-direction: column;
  position: relative;
`;

// ---- 상단 툴바 ----
const Toolbar = styled.div`
  height: 52px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  padding: 0 20px;
  padding-left: 90px;
  gap: 20px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding:  15px;
    gap: 10px;
    justify-content: space-between;
  }
`;

const NavGroup = styled.div`
  display: flex;
  gap: 15px;
  color: #555;
  margin-top: 5px;
  
  svg {
    cursor: pointer;
    &:hover { color: #000; }
  }

  @media (max-width: 768px) {
    opacity: 0;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: #e5e5e5;
  border-radius: 6px;
  padding: 2px;
  
  .icon-box {
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    
    &.active {
      background: #fff;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
  }
  
  @media (max-width: 768px) { display: none; }
`;

const SearchInputWrapper = styled.div`
  margin-left: auto;
  position: relative;
  
  input {
    padding: 6px 10px 6px 30px;
    border-radius: 6px;
    border: 1px solid #d1d1d1;
    background: #fff;
    font-size: 13px;
    width: 180px;
    outline: none;
    
    &:focus { border-color: #007aff; }
  }
  
  svg {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: #888;
    width: 14px;
    height: 14px;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    flex: 1;
    input { width: 100%; }
  }
`;

// ---- 메인 바디 ----
const Body = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// 사이드바 (모바일: 상단 2단 고정 메뉴)
const Sidebar = styled.div`
  width: 200px;
  background-color: rgba(245, 245, 247, 0.6);
  /* backdrop-filter: blur(10px); */
  border-right: 1px solid #e5e5e5;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    padding: 12px;
    border-right: none;
    border-bottom: 1px solid #e5e5e5;
    background-color: #f9f9f9;
    gap: 8px;
    overflow: visible;
  }
`;

const SidebarGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  
  .title {
    font-size: 11px;
    font-weight: 700;
    color: #888;
    padding-left: 10px;
    margin-bottom: 5px;
  }

  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    .title { display: none; }
  }
`;

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  background-color: ${props => props.active ? '#e5e5e5' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.active ? '#e5e5e5' : 'rgba(0,0,0,0.05)'};
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.color || '#007aff'};
  }
  
  /* [Mobile 수정됨] PC와 동일한 스타일 (회색 배경) 적용 */
  @media (max-width: 768px) {
    padding: 5px 12px;
    border-radius: 15px; /* 알약 모양은 유지 */
    border: 1px solid #ddd;
    
    /* 활성 상태일 때 PC처럼 회색 배경(#e5e5e5) 사용 */
    background-color: ${props => props.active ? '#e5e5e5' : '#fff'};
    color: #333; 
    font-size: 12px;
    
    svg { 
      width: 14px;
      height: 14px;
      /* 아이콘 색상도 원래 색 유지 */
      color: ${props => props.color || '#007aff'}; 
    }
    
    &:hover {
      background-color: ${props => props.active ? '#e5e5e5' : '#f0f0f0'};
    }
  }
`;

const TagDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 1px solid rgba(0,0,0,0.1);
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 8px;
    height: 8px;
    border: none;
  }
`;

// ---- 메인 콘텐츠 ----
const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #fff;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 25px 15px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 15px 10px;
  }
`;

const ProjectItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  padding: 10px;
  border-radius: 6px;
  background-color: ${props => props.selected ? '#e5e5e5' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.selected ? '#e5e5e5' : '#eef2ff'};
  }
  
  .icon-wrapper {
    width: 80px;
    height: 80px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    }
    
    svg {
      width: 64px;
      height: 64px;
    }
  }

  @media (max-width: 768px) {
    .icon-wrapper {
      width: 72px;
      height: 72px;
      margin-bottom: 6px;
    }
  }
`;

const NameWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: ${props => props.selected ? '#007aff' : 'transparent'};
  border-radius: 3px;
  padding: 2px 6px;
  max-width: 100%;
`;

const FileName = styled.span`
  font-size: 13px;
  text-align: center;
  color: ${props => props.selected ? '#fff' : '#333'};
  line-height: 1.3;
  word-break: break-word;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 768px) { font-size: 12px; }
`;

const GridTagDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.color};
  flex-shrink: 0;
  box-shadow: 0 0 2px rgba(0,0,0,0.2);
`;

// ---- 미리보기 패널 (Mobile: Overlay) ----
const PreviewPane = styled.div`
  width: 260px;
  background-color: #f5f5f7;
  border-left: 1px solid #e5e5e5;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-y: auto;
  flex-shrink: 0;

  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 50;
    background-color: #fff;
    border-left: none;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    padding: 20px;
  }

  .preview-icon {
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    align-items: flex-start;
    justify-content: center;

    img {
      width: auto;
      height: auto;
      max-width: 180px;
      max-height: 180px;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    svg {
      width: 120px;
      height: 120px;
    }
  }
  
  .preview-title {
    font-size: 18px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 5px;
    color: #333;
    line-height: 1.3;
  }
  
  .preview-subtitle {
    font-size: 12px;
    color: #888;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .divider {
    height: 1px;
    background: #e5e5e5;
    width: 100%;
    margin: 15px 0;
    flex-shrink: 0;
  }
  
  .info-row {
    width: 100%;
    margin-bottom: 15px;
    
    .label {
      font-size: 11px;
      font-weight: 700;
      color: #888;
      margin-bottom: 4px;
      display: block;
    }
    
    .value {
      font-size: 13px;
      color: #333;
      line-height: 1.5;
    }
  }

  .tag-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    
    .tag {
      font-size: 11px;
      background: #e5e5ea;
      padding: 0px 8px;
      border-radius: 10px;
      color: #555;
    }
  }
`;

const MobileBackButton = styled.button`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: left;
    margin-left: -20px;
    align-self: flex-start;
    margin-bottom: 10px;
    background: none;
    border: none;
    font-size: 14px;
    color: #555;
    cursor: pointer;
    font-weight: 600;
  }
`;

const ButtonGroup = styled.div`
  margin-top: auto;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  
  @media (max-width: 768px) {
    padding-bottom: 20px;
    justify-content: center;
    gap: 30px;
  }
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  padding: 2px;
  cursor: pointer;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #333;
    transform: scale(1.1);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;



const PreviewOverlay = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const PreviewWindow = styled.div`
  width: 90%;
  height: 85%;
  max-width: 1100px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes popIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
`;

const PreviewTitleBar = styled.div`
  height: 52px;
  background-color: #f6f6f6;
  border-bottom: 1px solid #d1d1d1;
  display: flex;
  align-items: center;
  padding: 0 16px;
  flex-shrink: 0;
`;

const TrafficLights = styled.div`
  display: flex;
  gap: 8px;
  margin-right: 20px;
  
  div {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  
  .close { background: #ff5f57; border: 1px solid #e0443e; cursor: pointer; &:hover { opacity: 0.8; } }
  .min { background: #febc2e; border: 1px solid #dba524; }
  .max { background: #28c840; border: 1px solid #1aab29; }
`;

const PreviewToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  color: #555;
  
  .file-name {
    font-weight: 600;
    color: #333;
    font-size: 14px;
    margin-right: auto;
  }
  
  .tool-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    cursor: pointer;
    opacity: 0.7;
    &:hover { opacity: 1; }
  }
  
  @media (max-width: 768px) {
    .tool-icon { display: none; }
    
  }
`;

const PreviewBody = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const PreviewSidebar = styled.div`
  width: 180px;
  background-color: #f5f5f7;
  border-right: 1px solid #e5e5e5;
  padding: 20px 10px;
  overflow-y: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 768px) {
    width: 100%;
    height: 90px;
    border-right: none;
    border-top: 1px solid #e5e5e5;
    flex-direction: row;
    overflow-x: auto;
    padding: 10px;
    gap: 10px;
  }
`;

const ThumbnailItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  opacity: ${props => props.isActive ? 1 : 0.7};
  &:hover { opacity: 1; }
  
  .thumb-box {
    width: 100%;
    aspect-ratio: 16/10;
    background: #fff;
    border: ${props => props.isActive ? '2px solid #007aff' : '1px solid #ddd'};
    border-radius: 4px;
    padding: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;
    overflow: hidden;
    
    img, video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  
  .thumb-label {
    font-size: 11px;
    color: ${props => props.isActive ? '#007aff' : '#666'};
    font-weight: ${props => props.isActive ? '600' : '400'};
    text-align: center;
    background: ${props => props.isActive ? '#dbeafe' : 'transparent'};
    padding: 2px 8px;
    border-radius: 10px;
  }

  @media (max-width: 768px) {

    min-width: 90px;
    .thumb-box {
      margin-bottom: 2px;
      height: 50px;
    }
  }
`;

const PreviewMain = styled.div`
  flex: 1;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  overflow: hidden;
  position: relative;

  img, video {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    /* box-shadow: 0 10px 30px rgba(0,0,0,0.5); */
  }
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

// ==================== 데이터 설정 ====================
const allProjects = [
  { 
    id: 1,
    name: "art( )ist",
    category: ["Frontend"],
    tag: "Team", 
    desc: "코다이 손기호를 활용한 모션 인식을 통해 사운드를 생성하고 이를 악보로 실시간 기록·저장하는 인터랙티브 웹 프로젝트",
    stack: ["React", "styled-component", "Three.js", "Tone.js", "FastAPI", "Mediapipe", "Supabase"], 
    date: "2025.04 ~ 2025.11",
    image: project1Img,
    role: "Frontend, Database",
    github: "https://github.com/yeonzhry/art-ist",
    link: "https://artdpist.com/",
    folder: null
  },
  { 
    id: 2, 
    name: "GKSF Website", 
    category: ["Frontend", "Design"], 
    tag: "Team",
    desc: "제 11회 서강대학교 국제한국학포럼 공식 웹사이트", 
    stack: ["React", "Three.js", "styled-component", "Figma"], 
    date: "2025.03 ~ 2025.09", 
    image: project2Img, 
    role: "Frontend, UI/UX Design",
    github: "https://github.com/GKSF-11TH/client", 
    link: "https://www.gksf11.com/", 
    folder: null 
  },
  { 
    id: 3, 
    name: "Weaw", 
    category: ["Design"], 
    tag: "Team",
    desc: "AI 기반 패션 순환 플랫폼 Weaw 기획 및 디자인", 
    stack: ["Figma", "Illustrator"], 
    date: "2025.10 ~ 2025.12",
    image: project3Img, 
    role: "Planning, Visual Design, UI/UX Design",
    folder: [
      { type: 'image', src: project3Img, caption: 'Image1' },
      { type: 'image', src: project3Img2, caption: 'Image2' },
      { type: 'image', src: project3Img3, caption: 'Poster' },
      { type: 'video', src: project3Img4, caption: 'Introduction Video' }
    ]
  },
  { 
    id: 4, 
    name: "Hamony", 
    category: ["Frontend"], 
    tag: "Personal", 
    desc: "손 관절을 점으로 추적해 코다이 손기호를 인식하고 실시간으로 시각화 파티클을 생성하는 프로젝트", 
    stack: ["p5.js", "Tone.js", "FastAPI", "Mediapipe"], 
    date: "2025.12", 
    image: project4Img, 
    github: "https://github.com/yeonzhry/Hamony", 
    link: "https://hamony.onrender.com", 
    folder: [
      { type: 'video', src: project4Img2, caption: 'Demo Video' },
      { type: 'video', src: project4Img3, caption: 'Demo Video - 비행기' }
    ]
   },
  { 
    id: 5, 
    name: "Discord", 
    category: ["Design"], 
    tag: "Personal", 
    desc: "Discord 모바일 환경에서의 서버 이용 흐름을 분석하고, 주요 사용 시나리오를 기반으로 사용자 중심의 UI를 재설계한 프로젝트", 
    stack: ["Figma"],
    date: "2025.09 ~ 2025.10", 
    image: project5Img,
    link: "https://www.figma.com/proto/qF6kGVrXVJgmtltUQs4XyE/UI-UX-Midterm-Prototype?page-id=47%3A71&node-id=50-74&p=f&viewport=392%2C332%2C0.1&t=HXkIQHVJQSBOfR9E-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=238%3A2315", 
    folder: [
      { type: 'image', src: project5Img2, caption: 'Process' },
      { type: 'image', src: project5Img3, caption: 'UI Evaluation' },
      { type: 'image', src: project5Img4, caption: 'Design Direction' },
      { type: 'image', src: project5Img, caption: 'As-is To-be' },
      { type: 'image', src: project5Img5, caption: 'Main Page' },
      { type: 'image', src: project5Img6, caption: 'Create a Server' },
      { type: 'image', src: project5Img7, caption: 'Channel' },
      { type: 'image', src: project5Img8, caption: 'Chatting' },
      { type: 'video', src: project5Img9, caption: 'Prototype Video' }
    ] 
  },
  { 
    id: 6, 
    name: "Highway to [ ]", 
    category: ["Frontend"], 
    tag: "Personal", 
    desc: "서강대학교 지식융합미디어대학 락밴드 소모임 다카포 공연 웹사이트. 포스터 디자인을 기반으로 인터랙션을 추가하여 홍보 및 셋리용으로 제작", 
    stack: ["React"],
    date: "2025.07",
    image: project6Img,
    github: "https://github.com/yeonzhry/Dacapo",
    // link: "#",
    folder: [
      { type: 'image', src: project6Img, caption: 'Rending Page' },
      { type: 'image', src: project6Img2, caption: 'Main Page' },
      { type: 'image', src: project6Img3, caption: 'Lyrics Pop-up' },
      { type: 'image', src: project6Img3, caption: 'Setlist' }
    ]},
  { 
    id: 7, 
    name: "yeonjae", 
    category: ["Frontend", "Design"], 
    tag: "Personal", 
    desc: "오디오 비주얼라이저, 3D 모델링, 사진, 영상 등의 개인 프로젝트 아카이빙 웹사이트", 
    stack: ["Javascript", "HTML", "CSS", "Three.js"], 
    date: "2024.09", 
    image: project7Img, 
    github: "https://github.com/yeonzhry/YJwebsite", 
    link: "https://yeonjae.vercel.app/", 
    folder: null },
  { 
    id: 8, 
    name: "HOLD:US", 
    category: ["Design"], 
    tag: "Team", desc: "에코 서강 업사이클링 컵홀더 브랜딩 카드뉴스", 
    stack: ["Illustrator"], 
    date: "2025.12", 
    image: project8Img, 
    role: "Design",
    folder: [
      { type: 'image', src: project8Img, caption: 'Card 1' }, { type: 'image', src: project8Img2, caption: 'Card 2' },
      { type: 'image', src: project8Img3, caption: 'Card 3' }, { type: 'image', src: project8Img4, caption: 'Card 4' },
      { type: 'image', src: project8Img5, caption: 'Card 5' }, { type: 'image', src: project8Img6, caption: 'Card 6' },
      { type: 'image', src: project8Img7, caption: 'Card 7' }, { type: 'image', src: project8Img8, caption: 'Card 8' },
      { type: 'image', src: project8Img9, caption: 'Card 9' }
    ]
  },
];


const ProjectsWindow = () => {
  const [activeCategory, setActiveCategory] = useState('Projects'); 
  const [selectedId, setSelectedId] = useState(1);
  const [showQuickLook, setShowQuickLook] = useState(false);
  const [quickLookIndex, setQuickLookIndex] = useState(0);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProjects = allProjects.filter(p => {
    if (activeCategory === 'Projects') return true;
    if (activeCategory === 'Team' || activeCategory === 'Personal') return p.tag === activeCategory;
    return p.category.includes(activeCategory);
  });

  const selectedProject = allProjects.find(p => p.id === selectedId) || filteredProjects[0];

  const handleProjectClick = (id) => {
    setSelectedId(id);
    if (isMobile) setIsMobileDetailOpen(true);
  };

  const openQuickLook = () => {
    if (selectedProject?.folder && selectedProject.folder.length > 0) {
      setQuickLookIndex(0);
      setShowQuickLook(true);
    }
  };

  const closeQuickLook = () => setShowQuickLook(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
        if (!showQuickLook || !selectedProject?.folder) return;
        if (e.key === 'Escape') closeQuickLook();
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') setQuickLookIndex(prev => (prev + 1) % selectedProject.folder.length);
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') setQuickLookIndex(prev => (prev - 1 + selectedProject.folder.length) % selectedProject.folder.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showQuickLook, selectedProject]);

  const getIconColor = (categories) => categories.includes('Design') ? { fill: '#ffcc00', color: '#ff9500' } : { fill: '#87ceeb', color: '#007aff' };
  const getTagColor = (tag) => tag === 'Team' ? '#ff9500' : (tag === 'Personal' ? '#34c759' : null);

  return (
    <Container>
      <Toolbar>
        <NavGroup>
          <ChevronLeft size={20} />
          <ChevronRight size={20} style={{opacity: 0.3}} />
        </NavGroup>
        
        <span style={{fontSize:'14px', fontWeight:'600', flex:1, textAlign:'left', marginTop:'5px', marginLeft: '5px'}}>
          {activeCategory === 'Projects' ? 'All Projects' : activeCategory}
        </span>
        
        <ViewToggle>
          <div className="icon-box active"><LayoutGrid size={16}/></div>
          <div className="icon-box"><List size={16}/></div>
          <div className="icon-box"><Columns size={16}/></div>
        </ViewToggle>
        
        <SearchInputWrapper>
          <Search />
          <input type="text" placeholder="검색" />
        </SearchInputWrapper>
      </Toolbar>

      <Body>
        <Sidebar>
          <SidebarGroup>
            <div className="title">My Work</div>
            <SidebarItem active={activeCategory === 'Projects'} onClick={() => setActiveCategory('Projects')}>
              <Folder size={16} color="#007aff" fill={activeCategory === 'Projects' ? '#007aff' : 'none'} style={{fillOpacity:0.2}} /> 
              Projects
            </SidebarItem>
            <SidebarItem active={activeCategory === 'Frontend'} onClick={() => setActiveCategory('Frontend')}>
              <Code size={16} color="#007aff" /> Frontend
            </SidebarItem>
            <SidebarItem active={activeCategory === 'Design'} onClick={() => setActiveCategory('Design')}>
              <PenTool size={16} color="#007aff" /> Design
            </SidebarItem>
          </SidebarGroup>
          
          <SidebarGroup>
            <div className="title">Tags</div>
            <SidebarItem active={activeCategory === 'Team'} onClick={() => setActiveCategory('Team')}>
              <TagDot color="#ff9500" /> Team
            </SidebarItem>
            <SidebarItem active={activeCategory === 'Personal'} onClick={() => setActiveCategory('Personal')}>
              <TagDot color="#34c759" /> Personal
            </SidebarItem>
          </SidebarGroup>
        </Sidebar>

        <MainContent>
          <Grid>
            {filteredProjects.map((project) => {
              const tagColor = getTagColor(project.tag);
              const isSelected = selectedId === project.id;
              
              return (
                <ProjectItem 
                  key={project.id} 
                  selected={isSelected} 
                  onClick={() => handleProjectClick(project.id)}
                  onDoubleClick={() => project.link ? window.open(project.link) : null}
                >
                  <div className="icon-wrapper">
                    {project.image ? (
                      <img src={project.image} alt={project.name} />
                    ) : (
                      <Folder strokeWidth={1} style={getIconColor(project.category)} />
                    )}
                  </div>
                  
                  <NameWrapper selected={isSelected}>
                    {tagColor && <GridTagDot color={tagColor} />}
                    <FileName selected={isSelected}>{project.name}</FileName>
                  </NameWrapper>
                </ProjectItem>
              );
            })}
          </Grid>
        </MainContent>

        {selectedProject && (
          <PreviewPane isOpen={isMobileDetailOpen}>
            <MobileBackButton onClick={() => setIsMobileDetailOpen(false)}>
              <ChevronLeft size={20}/>
            </MobileBackButton>

            <div className="preview-icon">
               {selectedProject.image ? (
                  <img src={selectedProject.image} alt={selectedProject.name} />
                ) : (
                  <Folder strokeWidth={1} style={getIconColor(selectedProject.category)} />
                )}
            </div>
            <div className="preview-title">{selectedProject.name}</div>
            <div className="preview-subtitle">{selectedProject.category.join(', ')} • {selectedProject.tag}</div>
            
            <div className="divider" />
            
            <div className="info-row">
              <div className="value">
                <Calendar size={12} style={{marginRight:4, display:'inline'}}/> 
                {selectedProject.date}
              </div>
            </div>

            {selectedProject.tag === 'Team' && (
              <div className="info-row">
                <span className="label">역할</span>
                <div className="value">{selectedProject.role}</div>
              </div>
            )}

            <div className="info-row">
              <span className="label">정보</span>
              <div className="value">{selectedProject.desc}</div>
            </div>

            <div className="info-row">
              <span className="label">기술 스택</span>
              <div className="tag-container">
                {selectedProject.stack?.map((s, i) => <span key={i} className="tag">{s}</span>)}
              </div>
            </div>

            <ButtonGroup>
              {selectedProject.folder && selectedProject.folder.length > 0 && (
                <IconButton onClick={openQuickLook} title="미리보기 열기"><Folder /></IconButton>
              )}
              {selectedProject.github && (
                <IconButton onClick={() => window.open(selectedProject.github)} title="Code"><Github /></IconButton>
              )}
              {selectedProject.link && (
                <IconButton onClick={() => window.open(selectedProject.link)} title="Link"><ExternalLink /></IconButton>
              )}
            </ButtonGroup>
          </PreviewPane>
        )}
      </Body>
      
      {showQuickLook && selectedProject.folder && (
        <PreviewOverlay onClick={closeQuickLook}>
          <PreviewWindow onClick={(e) => e.stopPropagation()}>
            <PreviewTitleBar>
              <TrafficLights>
                <div className="close" onClick={closeQuickLook} />
                <div className="min" />
                <div className="max" />
              </TrafficLights>
              <div className="file-name">
                {selectedProject.folder[quickLookIndex].caption || `${selectedProject.name} - ${quickLookIndex+1}`}
              </div>
              <PreviewToolbar style={{justifyContent: 'flex-end'}}>
                 <div className="tool-icon"><SidebarIcon size={16} /></div>
                 <div className="tool-icon"><ZoomOut size={16} /></div>
                 <div className="tool-icon"><ZoomIn size={16} /></div>
                 <div className="tool-icon"><Share size={16} /></div>
                 <div className="tool-icon"><PenLine size={16} /></div>
              </PreviewToolbar>
            </PreviewTitleBar>

            <PreviewBody>
              <PreviewSidebar>
                {selectedProject.folder.map((item, index) => (
                  <ThumbnailItem 
                    key={index} 
                    isActive={index === quickLookIndex} 
                    onClick={() => setQuickLookIndex(index)}
                  >
                    <div className="thumb-box">
                      {item.type === 'video' ? (
                        <video src={item.src} style={{objectFit:'cover'}} muted /> 
                      ) : (
                        <img src={item.src} alt="thumb" />
                      )}
                    </div>
                    <div className="thumb-label">{index + 1}</div>
                  </ThumbnailItem>
                ))}
              </PreviewSidebar>
              
              <PreviewMain>
                {selectedProject.folder[quickLookIndex].type === 'video' ? (
                  <video 
                    src={selectedProject.folder[quickLookIndex].src} 
                    controls autoPlay loop 
                    style={{width:'100%', height:'100%'}} 
                  />
                ) : (
                  <img 
                    src={selectedProject.folder[quickLookIndex].src} 
                    alt="detail" 
                  />
                )}
              </PreviewMain>
            </PreviewBody>
          </PreviewWindow>
        </PreviewOverlay>
      )}

    </Container>
  );
};

export default ProjectsWindow;