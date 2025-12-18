import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import * as Tone from 'tone';

// ==================== 키보드 매핑 및 음계 데이터 ====================
// image_10.png를 참고하여 키보드 키와 음계를 매핑합니다. (중간 C4부터 시작)
const keyMapping = {
  // --- 아랫줄 (흰 건반) ---
  'KeyA': { note: 'C4', label: 'ㅁ' }, // C4 (도)
  'KeyS': { note: 'D4', label: 'ㄴ' }, // D4 (레)
  'KeyD': { note: 'E4', label: 'ㅇ' }, // E4 (미)
  'KeyF': { note: 'F4', label: 'ㄹ' }, // F4 (파)
  'KeyG': { note: 'G4', label: 'ㅎ' }, // G4 (솔)
  'KeyH': { note: 'A4', label: 'ㅗ' }, // A4 (라)
  'KeyJ': { note: 'B4', label: 'ㅓ' }, // B4 (시)
  'KeyK': { note: 'C5', label: 'ㅏ' }, // C5 (도)
  'KeyL': { note: 'D5', label: 'ㅣ' }, // D5 (레)
  'Semicolon': { note: 'E5', label: ';' }, // E5 (미)
  'Quote': { note: 'F5', label: "'" }, // F5 (파)

  // --- 윗줄 (검은 건반) ---
  'KeyW': { note: 'C#4', label: 'ㅈ' }, // C#4
  'KeyE': { note: 'D#4', label: 'ㄷ' }, // D#4
  // F와 G 사이엔 검은 건반 없음
  'KeyT': { note: 'F#4', label: 'ㅅ' }, // F#4
  'KeyY': { note: 'G#4', label: 'ㅛ' }, // G#4
  'KeyU': { note: 'A#4', label: 'ㅕ' }, // A#4
  // B와 C 사이엔 검은 건반 없음
  'KeyO': { note: 'C#5', label: 'ㅐ' }, // C#5
  'KeyP': { note: 'D#5', label: 'ㅔ' }, // D#5
};

// 렌더링 순서를 위한 키 목록 (흰 건반 기준)
const whiteKeysOrder = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote'];

// ==================== 스타일 정의 (GarageBand 다크 테마) ====================

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #2c2c2e; /* 어두운 배경 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  color: #eee;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  user-select: none; /* 드래그 방지 */
`;

const KeyboardFrame = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  background-color: #1c1c1e;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
`;

const KeysContainer = styled.div`
  position: relative;
  display: flex;
`;

// 건반 공통 스타일
const KeyBase = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.1s ease;
  
  /* 눌렸을 때 스타일 */
  &.active {
    transform: scale(0.98);
    transform-origin: top;
  }
`;

// 흰 건반 스타일
const WhiteKey = styled(KeyBase)`
  width: 50px;
  height: 200px;
  background: linear-gradient(to bottom, #eee 0%, #fff 100%);
  color: #333;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 6px 6px;
  z-index: 1;
  box-shadow: inset 0 -2px 5px rgba(0,0,0,0.1);

  &.active {
    background: linear-gradient(to bottom, #ccc 0%, #eee 100%);
    box-shadow: inset 0 -2px 5px rgba(0,0,0,0.3);
  }
  
  .label {
    margin-top: auto;
    margin-bottom: 15px;
    color: #555;
  }
`;

// 검은 건반 스타일 (position: absolute로 배치)
const BlackKey = styled(KeyBase)`
  width: 34px;
  height: 120px;
  background: linear-gradient(to bottom, #333 0%, #000 100%);
  color: #eee;
  border: 2px solid #1c1c1e;
  border-top: none;
  border-radius: 0 0 6px 6px;
  position: absolute;
  top: 0;
  /* left는 props로 전달받아 계산 */
  left: ${props => props.left}px;
  z-index: 2;
  box-shadow: inset 0 -2px 3px rgba(255,255,255,0.2);

  &.active {
    background: linear-gradient(to bottom, #111 0%, #333 100%);
  }
  
  .label {
    margin-bottom: 15px;
    color: #ccc;
    font-size: 12px;
  }
`;

const Instructions = styled.div`
  margin-top: 20px;
  font-size: 14px;
  color: #888;
  text-align: center;
`;


// ==================== 메인 컴포넌트 ====================

const GarageBandWindow = () => {
  const synthRef = useRef(null);
  const [activeKeys, setActiveKeys] = useState(new Set()); // 현재 눌린 키들을 추적
  const isMouseDown = useRef(false); // 마우스 클릭 상태

  // 1. Tone.js 신디사이저 초기화
  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' }, // 부드러운 삼각형 파형
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 0.5,
      },
      volume: -5,
    }).toDestination();

    return () => {
      if (synthRef.current) synthRef.current.dispose();
    };
  }, []);

  // 2. 노트 재생/중지 함수
  const startNote = useCallback((note, key) => {
    if (!synthRef.current || activeKeys.has(key)) return;
    Tone.start(); // 브라우저 오디오 컨텍스트 시작 (필수)
    synthRef.current.triggerAttack(note);
    setActiveKeys(prev => new Set(prev).add(key));
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

  // 3. 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 반복 입력 방지 및 매핑된 키인지 확인
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

  // 4. 마우스 이벤트 핸들러 (글리산도 효과를 위해)
  const handleMouseDown = (note, key) => {
    isMouseDown.current = true;
    startNote(note, key);
  };

  const handleMouseUp = (note, key) => {
    isMouseDown.current = false;
    stopNote(note, key);
  };

  const handleMouseEnter = (note, key) => {
    // 마우스를 누른 채로 다른 건반으로 이동했을 때 재생
    if (isMouseDown.current) {
      startNote(note, key);
    }
  };
  
  const handleMouseLeave = (note, key) => {
     // 마우스가 건반을 벗어나면 소리 끔
    if (isMouseDown.current) {
        stopNote(note, key);
    }
  }


  // 5. 건반 렌더링 로직
  const renderKeys = () => {
    const whiteKeys = [];
    const blackKeys = [];
    let currentLeft = 0;
    const whiteKeyWidth = 50;
    const blackKeyWidth = 34;

    whiteKeysOrder.forEach((key) => {
      const { note, label } = keyMapping[key];
      const isActive = activeKeys.has(key);

      // 흰 건반 추가
      whiteKeys.push(
        <WhiteKey
          key={key}
          className={isActive ? 'active' : ''}
          onMouseDown={() => handleMouseDown(note, key)}
          onMouseUp={() => handleMouseUp(note, key)}
          onMouseEnter={() => handleMouseEnter(note, key)}
          onMouseLeave={() => handleMouseLeave(note, key)}
        >
        </WhiteKey>
      );

      // 검은 건반이 있는지 확인하고 추가 (현재음의 #이 매핑에 있는지)
      const sharpNote = note.replace(/(\d)/, '#$1'); // C4 -> C#4
      const blackKeyEntry = Object.entries(keyMapping).find(([_, val]) => val.note === sharpNote);
      
      if (blackKeyEntry) {
        const [blackKey, { label: blackLabel }] = blackKeyEntry;
        const isBlackActive = activeKeys.has(blackKey);
        // 흰 건반 두 개 사이에 걸치도록 위치 계산
        const blackLeft = currentLeft + whiteKeyWidth - (blackKeyWidth / 2);

        blackKeys.push(
          <BlackKey
            key={blackKey}
            left={blackLeft}
            className={isBlackActive ? 'active' : ''}
            onMouseDown={() => handleMouseDown(sharpNote, blackKey)}
            onMouseUp={() => handleMouseUp(sharpNote, blackKey)}
            onMouseEnter={() => handleMouseEnter(sharpNote, blackKey)}
            onMouseLeave={() => handleMouseLeave(sharpNote, blackKey)}
          >
          
          </BlackKey>
        );
      }
      
      currentLeft += whiteKeyWidth;
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
      // 컨테이너 전체에서 마우스 뗐을 때 모든 소리 멈춤 (안전장치)
      onMouseUp={() => {
        isMouseDown.current = false;
        if (synthRef.current) synthRef.current.releaseAll();
        setActiveKeys(new Set());
      }}
    >
      <KeyboardFrame>
        {renderKeys()}
      </KeyboardFrame>
  
    </Container>
  );
};

export default GarageBandWindow;