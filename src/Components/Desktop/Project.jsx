import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  ChevronLeft, ChevronRight, Search, 
  LayoutGrid, List, Columns, 
  Folder, Code, PenTool, Calendar, Users, 
  Github, ExternalLink, FileText
} from 'lucide-react';

// [중요] 사용하실 이미지를 import 하세요.
import project1Img from '../../assets/images/artist.png';
import project2Img from '../../assets/images/GKSF.png';
import project3Img from '../../assets/images/Weaw.png';
import project4Img from '../../assets/images/HAMONY.png';
import project5Img from '../../assets/images/Discord.png';
import project6Img from '../../assets/images/Dacapo.png';
import project7Img from '../../assets/images/yeonjae.png';
import project8Img from '../../assets/images/HOLDUS.png';

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
  display: flex;
  flex-direction: column;
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
`;

const NavGroup = styled.div`
  display: flex; gap: 15px; color: #555;
  svg { cursor: pointer; &:hover { color: #000; } }
`;

const ViewToggle = styled.div`
  display: flex; background: #e5e5e5; border-radius: 6px; padding: 2px;
  .icon-box {
    padding: 4px 8px; border-radius: 4px; cursor: pointer; display: flex; align-items: center;
    &.active { background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
  }
`;

const SearchInputWrapper = styled.div`
  margin-left: auto; position: relative;
  input {
    padding: 6px 10px 6px 30px; border-radius: 6px; border: 1px solid #d1d1d1;
    background: #fff; font-size: 13px; width: 180px; outline: none;
    &:focus { border-color: #007aff; }
  }
  svg { position: absolute; left: 8px; top: 50%; transform: translateY(-50%); color: #888; width: 14px; height: 14px; }
`;

// ---- 메인 바디 ----
const Body = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

// 사이드바
const Sidebar = styled.div`
  width: 200px;
  background-color: rgba(245, 245, 247, 0.6);
  backdrop-filter: blur(10px);
  border-right: 1px solid #e5e5e5;
  padding: 20px 10px;
  display: flex; flex-direction: column; gap: 20px;
  overflow-y: auto;
  flex-shrink: 0;
`;

const SidebarGroup = styled.div`
  display: flex; flex-direction: column; gap: 5px;
  .title { font-size: 11px; font-weight: 700; color: #888; padding-left: 10px; margin-bottom: 5px; }
`;

const SidebarItem = styled.div`
  display: flex; align-items: center; gap: 10px;
  padding: 6px 10px; border-radius: 6px; font-size: 13px; color: #333; cursor: pointer;
  background-color: ${props => props.active ? '#e5e5e5' : 'transparent'};
  &:hover { background-color: ${props => props.active ? '#e5e5e5' : 'rgba(0,0,0,0.05)'}; }
  svg { width: 16px; height: 16px; color: ${props => props.color || '#007aff'}; }
`;

const TagDot = styled.div`
  width: 12px; height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 1px solid rgba(0,0,0,0.1);
  flex-shrink: 0;
`;

// 메인 콘텐츠 (그리드)
const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #fff;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 25px 15px;
  align-items: start;
`;

const ProjectItem = styled.div`
  display: flex; flex-direction: column; align-items: center;
  justify-content: flex-start;
  cursor: pointer; padding: 10px; border-radius: 6px;
  background-color: ${props => props.selected ? '#e5e5e5' : 'transparent'};
  
  &:hover { background-color: ${props => props.selected ? '#e5e5e5' : '#eef2ff'}; }
  
  .icon-wrapper {
    width: 80px; height: 80px; margin-bottom: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    
    img {
      width: 100%; height: 100%; object-fit: contain; 
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    }
    svg { width: 64px; height: 64px; }
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
`;

const GridTagDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.color};
  flex-shrink: 0;
  box-shadow: 0 0 2px rgba(0,0,0,0.2);
`;

// 우측 미리보기 패널
const PreviewPane = styled.div`
  width: 260px;
  background-color: #f5f5f7;
  border-left: 1px solid #e5e5e5;
  padding: 30px 20px;
  display: flex; flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-y: auto;
  flex-shrink: 0;

  .preview-icon {
    width: 100%; margin-bottom: 20px;
    display: flex; align-items: flex-start; justify-content: center;

    img {
        width: auto; height: auto; 
        max-width: 180px; max-height: 180px;
        object-fit: contain; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    svg { width: 120px; height: 120px; }
  }
  
  .preview-title { font-size: 18px; font-weight: 700; text-align: center; margin-bottom: 5px; color: #333; line-height: 1.3; }
  .preview-subtitle { font-size: 12px; color: #888; text-align: center; margin-bottom: 20px; }
  
  .divider { height: 1px; background: #e5e5e5; width: 100%; margin: 15px 0; flex-shrink: 0;}
  
  .info-row {
    width: 100%; margin-bottom: 15px;
    .label { font-size: 11px; font-weight: 700; color: #888; margin-bottom: 4px; display: block; }
    .value { font-size: 13px; color: #333; line-height: 1.5; }
  }

  .tag-container {
    display: flex; flex-wrap: wrap; gap: 5px;
    .tag { font-size: 11px; background: #e5e5ea; padding: 0px 8px; border-radius: 10px; color: #555; }
  }
`;

// [NEW] 하단 버튼 그룹 (오른쪽 정렬)
const ButtonGroup = styled.div`
  margin-top: auto; 
  width: 100%; 
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  gap: 15px; /* 아이콘 간격 */
`;

// [NEW] 아이콘 버튼 스타일 (심플하게)
const IconButton = styled.button`
  background: transparent;
  border: none;
  padding: 1px;
  cursor: pointer;
  color: #888; /* 기본 회색 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover { 
    color: #333; /* 호버 시 진해짐 */
    transform: scale(1.1); /* 살짝 커짐 */
  }

  svg {
    width: 20px; 
    height: 20px;
  }
`;

// ==================== 데이터 설정 ====================
// github, link, folder 값이 있으면 해당 아이콘이 표시됨
const allProjects = [
  // Frontend
  { 
    id: 1, name: "art( )ist", 
    category: ["Frontend"], tag: "Team", 
    desc: "코다이 손기호를 활용한 모션 인식을 통해 사운드를 생성하고 이를 악보로 실시간 기록·저장하는 인터랙티브 웹 프로젝트",
    stack: ["React", "Three.js", "Tone.js", "FastAPI", "Mediapipe", "Supabase"], 
    date: "2025.04 ~ 2025.11", 
    image: project1Img,
    role: "Frontend, Database",
    github: "https://github.com/yeonzhry/art-ist", 
    link: "https://artdpist.com/",
    folder: null 
  },
  { 
    id: 2, name: "GKSF Website", 
    category: ["Frontend", "Design"], tag: "Team",
    desc: "제 11회 서강대학교 국제한국학포럼 공식 웹사이트",
    stack: ["React", "Three.js", "styled-component", "Figma"], 
    date: "2025.03 ~ 2025.09", 
    image: project2Img,
    role: "Frontend, UI/UX Design",
    github: "https://github.com/GKSF-11TH/client",
    link: "https://www.gksf11.com/",
    // folder: "#"
  },
  { 
    id: 3, name: "Weaw", 
    category: ["Design"], tag: "Team",
    desc: "AI 기반 패션 순환 플랫폼 모바일 어플리케이션 Weaw 기획 및 디자인",
    stack: ["Figma", "Illustrator"], 
    date: "2025.10 ~ 2025.12", 
    image: project3Img,
    role: "Planning, Visual Design, UI/UX Design",
    folder: "#"
  },
  { 
    id: 4, name: "Hamony", 
    category: ["Frontend"], tag: "Personal",
    desc: "손 관절을 점으로 추적해 코다이 손기호를 인식하고, 그 움직임을 사운드와 실시간 파티클 시각화로 확장하는 인터랙티브 프로젝트",
    stack: ["p5.js", "Tone.js", "Mediapipe", "FastAPI"], 
    date: "2025.12", 
    image: project4Img,
    github: "https://github.com/yeonzhry/hamony",
    // link: "https://hamony.com",
    // folder: "#"
  },
  { 
    id: 5, name: "Discord", 
    category: ["Design"], tag: "Personal",
    desc: "Discord 모바일 환경에서의 서버 이용 흐름을 분석하고, 주요 사용 시나리오를 기반으로 사용자 중심의 UI를 재설계한 프로젝트",
    stack: ["Figma"], 
    date: "2025.10", 
    image: project5Img,
    folder: "#"
  },
  { 
    id: 6, name: "Highway to [ ]", 
    category: ["Frontend"], tag: "Personal",
    desc: "지식융합미디어대학 락밴드 소모임 다카포 공연 웹사이트. 포스터 디자인을 기반으로 인터랙션을 추가하여 홍보 및 셋리용으로 제작",
    stack: ["Javascript", "HTML", "CSS"], 
    date: "2025.07", 
    image: project6Img,
    github: "https://github.com/yeonzhry/Dacapo",
    link: "#"
  },
  { 
    id: 7, name: "yeonjae", 
    category: ["Frontend", "Design"], tag: "Personal",
    desc: "오디오 비주얼라이저, 3D 모델링, 사진, 영상 등의 개인 프로젝트를 아카이빙 한 웹사이트",
    stack: ["Javascript", "HTML", "CSS", "Three.js", "Tone.js", "Blender"], 
    date: "2024.09 ~ 2024.10", 
    image: project7Img,
    github: "https://github.com/yeonzhry/YJwebsite",
    link: "https://yeonjae.vercel.app/"
  },
  { 
    id: 8, name: "HOLD:US", 
    category: ["Design"], tag: "Team",
    desc: "에코 서강 브랜딩 카드뉴스",
    stack: ["Illustrator"], 
    date: "2025.12", 
    image: project8Img,
    link: "#",
    role: "Design",
    folder: "#"
  },
];

const ProjectsWindow = () => {
  const [activeCategory, setActiveCategory] = useState('Projects'); 
  const [selectedId, setSelectedId] = useState(1);

  const filteredProjects = allProjects.filter(p => {
    if (activeCategory === 'Projects') return true;
    if (activeCategory === 'Team' || activeCategory === 'Personal') return p.tag === activeCategory;
    return p.category.includes(activeCategory);
  });

  const selectedProject = allProjects.find(p => p.id === selectedId) || filteredProjects[0];

  const handleProjectClick = (link) => {
    if(link && link !== '#') window.open(link, '_blank');
  };

  const getIconColor = (categories) => {
    if (categories.includes('Design')) return { fill: '#ffcc00', color: '#ff9500' };
    return { fill: '#87ceeb', color: '#007aff' };
  };

  const getTagColor = (tag) => {
    if (tag === 'Team') return '#ff9500'; 
    if (tag === 'Personal') return '#34c759'; 
    return null;
  };

  return (
    <Container>
      <Toolbar>
        <NavGroup>
          <ChevronLeft size={20} />
          <ChevronRight size={20} style={{opacity: 0.3}} />
        </NavGroup>
        
        <span style={{fontSize:'14px', fontWeight:'600', flex:1, textAlign:'left'}}>
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
                  onClick={() => setSelectedId(project.id)}
                  onDoubleClick={() => {
                    // 더블클릭 시 우선순위: 링크 > 깃허브
                    if (project.link) window.open(project.link, '_blank');
                    else if (project.github) window.open(project.github, '_blank');
                  }}
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
          <PreviewPane>
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

            {/* [NEW] 하단 아이콘 버튼 그룹 (조건부 렌더링) */}
            <ButtonGroup>
              {/* 1. Detail (Folder) */}
              {selectedProject.folder && (
                <IconButton onClick={() => console.log('Open Detail')} title="Detail">
                  <Folder />
                </IconButton>
              )}

              {/* 2. Code (Github) */}
              {selectedProject.github && (
                <IconButton onClick={() => window.open(selectedProject.github, '_blank')} title="Code">
                  <Github />
                </IconButton>
              )}

              {/* 3. Demo (Link) */}
              {selectedProject.link && selectedProject.link !== '#' && (
                <IconButton onClick={() => window.open(selectedProject.link, '_blank')} title="Demo">
                  <ExternalLink />
                </IconButton>
              )}
            </ButtonGroup>

          </PreviewPane>
        )}
      </Body>
      
      <div style={{
        height:'24px', background:'#f5f5f5', borderTop:'1px solid #e5e5e5', 
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', color:'#666'
      }}>
        {filteredProjects.length}개의 항목 {selectedProject && `, 1개 선택됨`}
      </div>
    </Container>
  );
};

export default ProjectsWindow;