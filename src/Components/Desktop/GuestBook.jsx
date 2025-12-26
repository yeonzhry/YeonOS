import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { SquarePen, Trash2, Search, ChevronLeft } from 'lucide-react';
// [Supabase] 클라이언트 임포트
import { supabase } from '../../supabaseClient'; 

// ==================== 스타일 정의 ====================

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #1d1d1f;
  overflow: hidden;
  border-radius: 10px;

  /* [Mobile] 모바일에서 상단 여백 (신호등 겹침 방지) */
  @media (max-width: 768px) {
    padding-top: 40px; 
    background-color: #F2F2F7; 
  }
`;

// [PC] 툴바
const Toolbar = styled.div`
  height: 52px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #d1d1d1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  padding-left: 90px; 
  flex-shrink: 0;
  
  /* [수정] z-index 제거하여 WindowFrame의 TitleBar(신호등) 클릭 방해 안 함 */
  position: relative; 
  /* z-index: 1;  <-- 삭제함 */

  @media (max-width: 768px) {
    padding-left: 15px; 
    background-color: transparent; 
    border-bottom: none; 
    height: 44px;
    justify-content: flex-end; 
    display: none;
  }
`;

// [PC] 왼쪽 아이콘 그룹 (삭제/쓰기)
const LeftTools = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  color: #555; 
  margin-top: 4px;
  
  /* [추가] 툴바 자체의 z-index가 없어도 버튼 클릭은 되어야 함 */
  pointer-events: auto;
  z-index: 10; 

  .icon-btn {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;

    &:hover { color: #000; }
    &:active { opacity: 0.6; }
    
    &.disabled {
      opacity: 0.3;
      cursor: default;
      &:hover { color: #555; }
    }
  }

  /* 모바일에서는 상단 툴바의 왼쪽 버튼 숨김 */
  @media (max-width: 768px) {
    display: none;
  }
`;

// [Mobile] 하단 플로팅 글쓰기 버튼
const MobileFloatingButton = styled.div`
  display: none;
  position: absolute;
  bottom: 25px;
  right: 25px;
  width: 25px;
  height: 25px;
  color: #f7ce46; 
  z-index: 50;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: flex;
  }
  
  &:active { opacity: 0.7; transform: scale(0.95); }
`;

// [Mobile] 상세화면 상단바 (뒤로가기 + 삭제/완료)
const MobileDetailHeader = styled.div`
  position: absolute; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 50px;
  z-index: 60;
  display: flex; 
  align-items: center; 
  justify-content: space-between; /* 양쪽 정렬 */
  padding-left: 10px; 
  padding-right: 15px; 
  padding-top: 70px; /* 신호등 여백 */
`;

const MobileBackButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #f7ce46;
  font-weight: 600;
  font-size: 16px;
`;

// [Mobile] 상단 우측 버튼 (삭제 아이콘 or 완료 텍스트)
const MobileRightAction = styled.div`
  cursor: pointer;
  color: #f7ce46;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
`;

const SearchIconWrapper = styled.div`
  color: #555; /* [수정] 원래 회색으로 복구 */
  cursor: pointer;
  &:hover { color: #000; }
  margin-top: 4px;
  margin-right: 10px;
  
  /* [추가] 버튼 클릭 보장 */
  pointer-events: auto;
  z-index: 10;
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const Sidebar = styled.div`
  width: 240px;
  background-color: #f2f2f7;
  border-right: 1px solid #d1d1d1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    display: ${props => props.isHidden ? 'none' : 'flex'};
    background-color: transparent; 
    padding: 0 16px; 
  }
`;

const SidebarHeader = styled.div`
  padding: 10px 15px;
  font-size: 11px;
  font-weight: 700;
  color: #888;
  margin-top: 5px;

  @media (max-width: 768px) {
    font-size: 24px;
    font-weight: 700;
    color: #000;
    margin-bottom: 10px;
    padding-left: 4px;
    margin-top: 10px;
  }
`;

const ListGroup = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    margin-bottom: 20px;
  }
`;

const NoteItem = styled.div`
  padding: 12px 20px 12px 25px;
  cursor: pointer;
  
  background-color: ${props => props.active ? '#fff' : 'transparent'};
  border-radius: ${props => props.active ? '6px' : '0'};
  margin: ${props => props.active ? '0 10px' : '0'};
  box-shadow: ${props => props.active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};

  &:hover {
    background-color: ${props => props.active ? '#fff' : 'rgba(0,0,0,0.03)'};
  }

  .title {
    font-size: 14px; font-weight: 700; color: #000;
    margin-bottom: 4px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .meta {
    display: flex; gap: 8px; font-size: 12px; color: #8e8e93;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  @media (max-width: 768px) {
    background-color: #fff; 
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 16px 20px;
    position: relative;

    &:hover { background-color: #fafafa; }
    
    &:not(:last-child)::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 20px; 
      right: 0;
      height: 1px;
      background-color: #e5e5e5;
    }

    .title { font-size: 16px; margin-bottom: 6px; }
    .meta { font-size: 14px; }
  }
`;

const NoteContent = styled.div`
  flex: 1;
  /* background-color: #fff; */
  display: flex;
  flex-direction: column;
  padding: 30px 40px;
  overflow-y: auto;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;
    padding-top: 10px; 
    display: ${props => props.isVisible ? 'flex' : 'none'};
    
    position: absolute; 
    top: 0; left: 0; height: 100%; 
    z-index: 50; 
  }
`;

const DateDisplay = styled.div`
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-bottom: 20px;
`;

const ViewArea = styled.div`
  .view-title {
    font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #000;
    @media (max-width: 768px) {
      font-size: 20px; 
    }
  }
  .view-text {
    font-size: 16px; line-height: 1.6; color: #333; white-space: pre-wrap;
    @media (max-width: 768px) {
      font-size: 13px; 
    }
  }
`;

const EditArea = styled.div`
  display: flex; flex-direction: column; height: 100%;

  input {
    font-size: 24px; font-weight: 700; 
    border: none; outline: none;
    margin-bottom: 15px; width: 100%;
    background: transparent;
    color: #000;
    &::placeholder { color: #ccc; }

    
  }
  
  textarea {
    flex: 1; 
    border: none; outline: none; resize: none;
    font-size: 16px; line-height: 1.6; 
    font-family: inherit; color: #333;
    background: transparent;
    &::placeholder { color: #ccc; }
  }
`;

// [PC용] 완료 버튼
const PCSaveButton = styled.button`
  position: absolute; top: 20px; right: 20px;
  background: none; border: none;
  color: #f7ce46; 
  font-weight: 600; font-size: 15px;
  cursor: pointer;
  padding: 5px 10px;
  
  &:hover { opacity: 0.8; }

  @media (max-width: 768px) {
    display: none; /* 모바일에서는 상단 헤더로 이동하므로 숨김 */
  }
`;

// ==================== 메인 컴포넌트 ====================

const GuestBookWindow = () => {
  // [Supabase] 로컬스토리지 대신 빈 배열 초기화
  const [notes, setNotes] = useState([]);
  
  const [selectedId, setSelectedId] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // [Supabase] 초기 데이터 로드 (Read)
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error.message);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // PC에서 데이터 로드 후 첫 번째 글 자동 선택
  useEffect(() => {
    if (!isMobile && notes.length > 0 && selectedId === null && !isEditing) {
      setSelectedId(notes[0].id);
    }
  }, [notes, isMobile]);

  const selectedNote = notes.find(n => n.id === selectedId);
  const isDetailView = isMobile && (selectedId !== null || isEditing);

  const handleStartWriting = () => {
    setIsEditing(true);
    setSelectedId(null);
    setNewTitle('');
    setNewContent('');
  };

  // [Supabase] 글 저장 (Create)
  const handleSave = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      alert("이름과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('guestbook')
        .insert([
          { title: newTitle, content: newContent }
        ])
        .select();

      if (error) throw error;

      if (data) {
        const newNote = data[0];
        setNotes([newNote, ...notes]);
        setSelectedId(newNote.id);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving note:', error.message);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  // [Supabase] 글 삭제 (Delete)
  const handleDelete = async () => {
    if (!selectedId) return;
    if (window.confirm("삭제하시겠습니까?")) {
      try {
        const { error } = await supabase
          .from('guestbook')
          .delete()
          .eq('id', selectedId);

        if (error) throw error;

        const updatedNotes = notes.filter(n => n.id !== selectedId);
        setNotes(updatedNotes);
        setIsEditing(false);
        
        if (!isMobile && updatedNotes.length > 0) {
          setSelectedId(updatedNotes[0].id);
        } else {
          setSelectedId(null);
        }
      } catch (error) {
        console.error('Error deleting note:', error.message);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSelectNote = (id) => {
    setSelectedId(id);
    setIsEditing(false);
  };

  const handleBackToList = () => {
    setSelectedId(null);
    setIsEditing(false);
  };

  // 날짜 포맷팅 함수 (DB Timestamp -> View String)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <Container>
      {/* 1. PC 툴바 (모바일 상세화면일 땐 숨김) */}
      {(!isMobile || !isDetailView) && (
        <Toolbar>
          <LeftTools>
            <div className={`icon-btn ${!selectedId ? 'disabled' : ''}`} onClick={handleDelete} title="삭제">
              <Trash2 size={20} />
            </div>
            <div className="icon-btn" onClick={handleStartWriting} title="새 방명록 작성">
              <SquarePen size={20} color={isEditing ? "#f7ce46" : "#555"} />
            </div>
          </LeftTools>
          
          <SearchIconWrapper>
            <Search size={18} />
          </SearchIconWrapper>
        </Toolbar>
      )}

      {/* 2. 모바일 상세화면 헤더 (메모 <-----> 완료/삭제) */}
      {isDetailView && isMobile && (
        <MobileDetailHeader>
          {/* 왼쪽: 뒤로가기 */}
          <MobileBackButton onClick={handleBackToList}>
            <ChevronLeft size={24} style={{ marginRight: -4 }} /> 메모
          </MobileBackButton>

          {/* 오른쪽: 편집 중이면 '완료', 보기 중이면 '삭제' */}
          <MobileRightAction>
            {isEditing ? (
              <span onClick={handleSave}>완료</span>
            ) : (
              selectedId && <Trash2 size={20} onClick={handleDelete} />
            )}
          </MobileRightAction>
        </MobileDetailHeader>
      )}

      <Body>
        <Sidebar isHidden={isDetailView}>
          <SidebarHeader>Guest Book</SidebarHeader>
          
          {notes.length === 0 ? (
            <div style={{ padding: '20px', color: '#999', fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>
              작성된 글이 없습니다.
            </div>
          ) : (
            <ListGroup>
              {notes.map(note => (
                <NoteItem 
                  key={note.id} 
                  active={selectedId === note.id && !isMobile} 
                  onClick={() => handleSelectNote(note.id)}
                >
                  <div className="title">{note.title}</div>
                  <div className="meta">
                    {/* [Supabase] created_at 필드 사용 */}
                    <span>{formatDate(note.created_at).split(' ').slice(0,3).join(' ')}</span>
                    <span style={{margin:'0 4px'}}>·</span>
                    <span className="preview">{note.content.substring(0, 15)}...</span>
                  </div>
                </NoteItem>
              ))}
            </ListGroup>
          )}
        </Sidebar>

        {/* 모바일 하단 플로팅 작성 버튼 */}
        {!isDetailView && isMobile && (
          <MobileFloatingButton onClick={handleStartWriting}>
            <SquarePen size={32} />
          </MobileFloatingButton>
        )}

        <NoteContent isVisible={!isMobile || isDetailView}>
          {isEditing ? (
            <EditArea>
              <DateDisplay style={{marginTop: isMobile ? '40px' : '0'}}>
                {new Date().toLocaleDateString()}
              </DateDisplay>
              
              <input 
                type="text" placeholder="Name" 
                value={newTitle} onChange={(e) => setNewTitle(e.target.value)} autoFocus
              />
              <textarea 
                placeholder="방명록 내용을 남겨주세요..." 
                value={newContent} onChange={(e) => setNewContent(e.target.value)}
              />
              {/* PC용 완료 버튼 (모바일은 헤더에 있음) */}
              <PCSaveButton onClick={handleSave}>완료</PCSaveButton>
            </EditArea>
          ) : (
            selectedNote ? (
              <ViewArea>
                <DateDisplay style={{marginTop: isMobile ? '40px' : '0'}}>
                  {/* [Supabase] created_at 필드 사용 */}
                  {formatDate(selectedNote.created_at)}
                </DateDisplay>
                <div className="view-title">{selectedNote.title}</div>
                <div className="view-text">{selectedNote.content}</div>
              </ViewArea>
            ) : (
              <div style={{display:'flex', height:'100%', alignItems:'center', justifyContent:'center', color:'#ccc', flexDirection:'column', gap:'15px'}}>
                <SquarePen size={50} color="#e5e5e5"/>
                <span>상단의 펜 아이콘을 눌러 방명록을 남겨보세요!</span>
              </div>
            )
          )}
        </NoteContent>
      </Body>
    </Container>
  );
};

export default GuestBookWindow;