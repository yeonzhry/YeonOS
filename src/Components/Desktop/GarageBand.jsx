import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import * as Tone from 'tone';

// ==================== 키보드 매핑 (PC와 동일) ====================
const keyMapping = {
  'KeyA': { note: 'C4', label: 'ㅁ' }, 
  'KeyS': { note: 'D4', label: 'ㄴ' }, 
  'KeyD': { note: 'E4', label: 'ㅇ' }, 
  'KeyF': { note: 'F4', label: 'ㄹ' }, 
  'KeyG': { note: 'G4', label: 'ㅎ' }, 
  'KeyH': { note: 'A4', label: 'ㅗ' }, 
  'KeyJ': { note: 'B4', label: 'ㅓ' }, 
  'KeyK': { note: 'C5', label: 'ㅏ' }, 
  'KeyL': { note: 'D5', label: 'ㅣ' }, 
  'Semicolon': { note: 'E5', label: ';' }, 
  'Quote': { note: 'F5', label: "'" }, 

  'KeyW': { note: 'C#4', label: 'ㅈ' }, 
  'KeyE': { note: 'D#4', label: 'ㄷ' }, 
  'KeyT': { note: 'F#4', label: 'ㅅ' }, 
  'KeyY': { note: 'G#4', label: 'ㅛ' }, 
  'KeyU': { note: 'A#4', label: 'ㅕ' }, 
  'KeyO': { note: 'C#5', label: 'ㅐ' }, 
  'KeyP': { note: 'D#5', label: 'ㅔ' }, 
};

const whiteKeysOrder = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote'];

// ==================== 스타일 정의 ====================

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #1e1e1e; /* 짙은 회색 배경 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  user-select: none;
  overflow: hidden;

  /* [수정됨] 전체화면 고정(fixed) 삭제 -> 윈도우 프레임 안에 얌전히 있음 */
  @media (max-width: 768px) {
    padding: 0; /* 모바일은 꽉 차게 */
  }
`;

// 신디사이저 본체 (회전 대상)
const SynthBody = styled.div`
  width: 100%;
  max-width: 800px; /* PC 최대 너비 */
  background: linear-gradient(180deg, #323232 0%, #1a1a1a 100%);
  border-radius: 12px;
  padding: 20px;
  padding-top: 15px;
  box-shadow: 
    0 10px 30px rgba(0,0,0,0.5), 
    inset 0 1px 1px rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;

  /* ============================================================ */
  /* [핵심] 모바일 세로 모드일 때: 본체만 90도 회전 */
  /* ============================================================ */
  @media (max-width: 768px) and (orientation: portrait) {
    /* 중심축 기준으로 90도 회전 */
    transform: rotate(90deg);
    
    /* 회전하면 width가 높이가 되고, height가 너비가 됨 */
    /* 윈도우 창 높이만큼 길게 만들기 위해 width를 늘림 */
    width: 66vh; /* 창 높이의 60% 정도 길이 */
    
    /* 회전 후 너비(원래 height)는 창 너비에 맞춤 */
    height: 75vw; 
    
    /* 위치 및 패딩 조정 */
    padding: 15px;
    position: absolute; /* 중앙 정렬을 위해 absolute 사용 가능 */
  }
`;

const SynthHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  flex-shrink: 0; 
  
  .brand {
    font-family: 'Helvetica Neue', sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: #888;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .display {
    background-color: #000;
    color: #4cd137;
    padding: 4px 10px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    box-shadow: inset 0 0 5px rgba(76, 209, 55, 0.3);
    min-width: 60px;
    text-align: center;
  }
`;

// 스크롤 영역
const ScrollWrapper = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  overflow: hidden; /* 회전 시 스크롤 있으면 헷갈리므로 숨김 (꽉 차게) */
`;

const KeysContainer = styled.div`
  position: relative;
  display: flex;
  height: 180px; 
  width: 100%;
  
  /* [중요] 모바일에서는 건반이 길어져야 하므로 높이(회전 후 너비) 조정 */
  @media (max-width: 768px) {
    height: 100%; /* 부모 높이 채움 */
  }
`;

const WhiteKey = styled.div`
  flex: 1; 
  position: relative;
  background: linear-gradient(to bottom, #fff 0%, #f2f2f2 100%);
  border-radius: 0 0 6px 6px;
  border: 1px solid #000;
  border-top: none;
  box-shadow: inset 0 -5px 10px rgba(0,0,0,0.1), 0 2px 3px rgba(0,0,0,0.2);
  z-index: 1;
  cursor: pointer;
  
  &.active {
    background: linear-gradient(to bottom, #f2f2f2 0%, #e0e0e0 100%);
    box-shadow: inset 0 -2px 5px rgba(0,0,0,0.2);
    transform: translateY(2px);
    transform-origin: top;
  }

  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 15px;
  color: #aaa;
  font-size: 10px;
  font-weight: 600;
`;

const BlackKey = styled.div`
  position: absolute;
  top: 0;
  width: 6%; 
  height: 60%;
  background: linear-gradient(to bottom, #333 0%, #000 100%);
  border-radius: 0 0 4px 4px;
  border: 1px solid #000;
  border-top: none;
  z-index: 2;
  box-shadow: inset 0 -2px 2px rgba(255,255,255,0.2), 2px 2px 4px rgba(0,0,0,0.4);
  cursor: pointer;

  &.active {
    background: #111;
    box-shadow: inset 0 -1px 1px rgba(255,255,255,0.1);
    transform: translateY(2px);
  }
`;

// ==================== 메인 컴포넌트 ====================

const GarageBandWindow = () => {
  const synthRef = useRef(null);
  const [activeKeys, setActiveKeys] = useState(new Set());
  const isMouseDown = useRef(false);
  const [lastNote, setLastNote] = useState('-');

  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.5 },
      volume: -4,
    }).toDestination();
    return () => { if (synthRef.current) synthRef.current.dispose(); };
  }, []);

  const startNote = useCallback((note, key) => {
    if (!synthRef.current || activeKeys.has(key)) return;
    Tone.start();
    synthRef.current.triggerAttack(note);
    setActiveKeys(prev => new Set(prev).add(key));
    setLastNote(note);
  }, [activeKeys]);

  const stopNote = useCallback((note, key) => {
    if (!synthRef.current || !activeKeys.has(key)) return;
    synthRef.current.triggerRelease(note);
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
  }, [activeKeys]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat || !keyMapping[e.code]) return;
      startNote(keyMapping[e.code].note, e.code);
    };
    const handleKeyUp = (e) => {
      if (!keyMapping[e.code]) return;
      stopNote(keyMapping[e.code].note, e.code);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startNote, stopNote]);

  const handleMouseDown = (note, key) => { isMouseDown.current = true; startNote(note, key); };
  const handleMouseUp = (note, key) => { isMouseDown.current = false; stopNote(note, key); };
  const handleMouseEnter = (note, key) => { if (isMouseDown.current) startNote(note, key); };
  const handleMouseLeave = (note, key) => { if (isMouseDown.current) stopNote(note, key); };

  const renderKeys = () => {
    const whiteKeys = [];
    const blackKeys = [];
    let currentLeft = 0;
    const whiteKeyWidth = 50; 
    const blackKeyWidth = 34;

    // [반응형 % 계산]
    const totalWhiteKeys = whiteKeysOrder.length;
    const whiteKeyPercent = 100 / totalWhiteKeys;

    whiteKeysOrder.forEach((key, index) => {
      const { note, label } = keyMapping[key];
      const isActive = activeKeys.has(key);

      whiteKeys.push(
        <WhiteKey
          key={key}
          className={isActive ? 'active' : ''}
          onMouseDown={() => handleMouseDown(note, key)}
          onMouseUp={() => handleMouseUp(note, key)}
          onMouseEnter={() => handleMouseEnter(note, key)}
          onMouseLeave={() => handleMouseLeave(note, key)}
        />
      );

      const sharpNote = note.replace(/(\d)/, '#$1');
      const blackKeyEntry = Object.entries(keyMapping).find(([_, val]) => val.note === sharpNote);
      
      if (blackKeyEntry) {
        const [blackKey] = blackKeyEntry;
        const isBlackActive = activeKeys.has(blackKey);
        // %로 위치 계산
        const leftPercent = (index + 1) * whiteKeyPercent - 3; 

        blackKeys.push(
          <BlackKey
            key={blackKey}
            style={{ left: `${leftPercent}%` }}
            className={isBlackActive ? 'active' : ''}
            onMouseDown={() => handleMouseDown(sharpNote, blackKey)}
            onMouseUp={() => handleMouseUp(sharpNote, blackKey)}
            onMouseEnter={() => handleMouseEnter(sharpNote, blackKey)}
            onMouseLeave={() => handleMouseLeave(sharpNote, blackKey)}
          />
        );
      }
    });

    return (
      <KeysContainer>
        {whiteKeys}
        {blackKeys}
      </KeysContainer>
    );
  };

  return (
    <Container 
      onMouseUp={() => {
        isMouseDown.current = false;
        if (synthRef.current) synthRef.current.releaseAll();
        setActiveKeys(new Set());
      }}
    >
      <SynthBody>
        <SynthHeader>
          <div className="brand">YeonJae Synth</div>
          <div className="display">{lastNote}</div>
        </SynthHeader>
        
        <ScrollWrapper>
          {renderKeys()}
        </ScrollWrapper>
      </SynthBody>
    </Container>
  );
};

export default GarageBandWindow;