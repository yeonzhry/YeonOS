import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SquarePen, Trash2, Search } from 'lucide-react';

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
`;

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
`;

const LeftTools = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  color: #555;
  z-index: 30;
  margin-top: 4px;

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
`;

// [수정] 검색 아이콘만 표시
const SearchIconWrapper = styled.div`
  color: #555;
  cursor: pointer;
  &:hover { color: #000; }
  margin-top: 4px;
  margin-right: 10px;
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 240px;
  background-color: #f2f2f7;
  border-right: 1px solid #d1d1d1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-shrink: 0;
`;

const SidebarHeader = styled.div`
  padding: 10px 15px;
  font-size: 11px;
  font-weight: 700;
  color: #888;
  margin-top: 5px;
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
`;

const NoteContent = styled.div`
  flex: 1;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 30px 40px;
  overflow-y: auto;
  position: relative;
`;

const DateDisplay = styled.div`
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-bottom: 20px;
`;

// [수정] 읽기 모드 (흰 배경 유지)
const ViewArea = styled.div`
  .view-title {
    font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #000;
  }
  .view-text {
    font-size: 16px; line-height: 1.6; color: #333; white-space: pre-wrap;
  }
`;

// [수정] 쓰기 모드 (흰 배경, 깔끔하게)
const EditArea = styled.div`
  display: flex; flex-direction: column; height: 100%;

  /* 제목 입력창 */
  input {
    font-size: 24px; font-weight: 700; 
    border: none; outline: none;
    margin-bottom: 15px; width: 100%;
    background: transparent;
    color: #000;
    &::placeholder { color: #ccc; }
  }
  
  /* 내용 입력창 */
  textarea {
    flex: 1; 
    border: none; outline: none; resize: none;
    font-size: 16px; line-height: 1.6; 
    font-family: inherit; color: #333;
    background: transparent;
    &::placeholder { color: #ccc; }
  }
`;

// [수정] 완료 버튼 (텍스트 스타일)
const SaveButton = styled.button`
  position: absolute; top: 20px; right: 20px;
  background: none; border: none;
  color: #f7ce46; /* 메모 앱 포인트 컬러 */
  font-weight: 600; font-size: 15px;
  cursor: pointer;
  padding: 5px 10px;
  
  &:hover { opacity: 0.8; }
`;

// ==================== 메인 컴포넌트 ====================

const GuestBookWindow = () => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('mac_notes_guestbook');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedId, setSelectedId] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // 초기 로드 시 첫 번째 글 선택
  useEffect(() => {
    if (notes.length > 0 && selectedId === null && !isEditing) {
      setSelectedId(notes[0].id);
    }
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('mac_notes_guestbook', JSON.stringify(notes));
  }, [notes]);

  const selectedNote = notes.find(n => n.id === selectedId);

  const handleStartWriting = () => {
    setIsEditing(true);
    setSelectedId(null);
    setNewTitle('');
    setNewContent('');
  };

  const handleSave = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      alert("이름과 내용을 모두 입력해주세요.");
      return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('ko-KR') + ' ' + now.toLocaleTimeString('ko-KR', {hour: '2-digit', minute:'2-digit'});

    const newNoteObj = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
      date: dateStr
    };

    const updatedNotes = [newNoteObj, ...notes];
    setNotes(updatedNotes);
    
    setSelectedId(newNoteObj.id);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!selectedId) return;
    if (window.confirm("이 방명록을 삭제하시겠습니까?")) {
      const updatedNotes = notes.filter(n => n.id !== selectedId);
      setNotes(updatedNotes);
      setIsEditing(false);
      setSelectedId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
    }
  };

  const handleSelectNote = (id) => {
    setSelectedId(id);
    setIsEditing(false);
  };

  return (
    <Container>
      <Toolbar>
        <LeftTools>
          <div 
            className={`icon-btn ${!selectedId ? 'disabled' : ''}`} 
            onClick={handleDelete}
            title="삭제"
          >
            <Trash2 size={18} />
          </div>

          <div 
            className="icon-btn" 
            onClick={handleStartWriting}
            title="새 방명록 작성"
          >
            <SquarePen size={18} color={isEditing ? "#f7ce46" : "#555"} />
          </div>
        </LeftTools>

        {/* [수정] 검색창 제거 -> 아이콘만 남김 */}
        <SearchIconWrapper>
          <Search size={18} />
        </SearchIconWrapper>
      </Toolbar>

      <Body>
        <Sidebar>
          <SidebarHeader>Guset Book</SidebarHeader>
          
          {notes.length === 0 && (
            <div style={{padding:'20px', color:'#999', fontSize:'13px', textAlign:'center'}}>
              작성된 글이 없습니다.
            </div>
          )}

          {notes.map(note => (
            <NoteItem 
              key={note.id} 
              active={selectedId === note.id}
              onClick={() => handleSelectNote(note.id)}
            >
              <div className="title">{note.title}</div>
              <div className="meta">
                <span>{note.date.split(' ').slice(0,3).join(' ')}</span>
                <span className="preview">{note.content.substring(0, 10)}...</span>
              </div>
            </NoteItem>
          ))}
        </Sidebar>

        <NoteContent>
          {isEditing ? (
            <EditArea>
              <DateDisplay>{new Date().toLocaleDateString()}</DateDisplay>
              <input 
                type="text" 
                placeholder="Name" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
              <textarea 
                placeholder="방명록 내용을 남겨주세요..." 
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
              {/* [수정] 텍스트형 저장 버튼 */}
              <SaveButton onClick={handleSave}>완료</SaveButton>
            </EditArea>
          ) : (
            selectedNote ? (
              <ViewArea>
                <DateDisplay>{selectedNote.date}</DateDisplay>
                <div className="view-title">{selectedNote.title}</div>
                <div className="view-text">{selectedNote.content}</div>
              </ViewArea>
            ) : (
              <div style={{display:'flex', height:'100%', alignItems:'center', justifyContent:'center', color:'#ccc', flexDirection:'column', gap:'10px'}}>
                <SquarePen size={40} color="#e5e5e5"/>
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