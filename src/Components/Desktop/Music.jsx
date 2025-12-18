import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Star, MoreHorizontal, SkipBack, Play, Pause, SkipForward } from 'lucide-react';

// ==================== 설정 ====================
// assets 폴더에 넣은 실제 파일 경로를 import 하세요
// import songFile from '../../assets/music/my_song.mp3'; 
// import coverImg from '../../assets/cover.png';

import audio from '../../assets/Bluebird.mp3';
import cover from '../../assets/images/Music.png';



const SONG_INFO = {
  // 테스트용 무료 음원 URL (본인 파일로 교체 시 import 변수 사용)
  audioUrl: audio,
  cover: cover, 
  title: "Bluebird",
  artist: "Sunset Rollercoster"
};

// ==================== 스타일 ====================

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 30px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  border-radius: 12px;
  box-sizing: border-box;
  overflow: hidden; /* 내부 요소가 튀어나오지 않게 */
`;

const AlbumArt = styled.div`
  width: 240px; /* 창 크기에 맞춰 살짝 조정 */
  height: 240px;
  border-radius: 12px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
  margin-bottom: 25px;
`;

const SongInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding: 0 5px;

  .text-info {
    display: flex; flex-direction: column; gap: 5px;
    .title { font-size: 20px; font-weight: 700; color: #000; }
    .artist { font-size: 16px; color: #fa2d48; font-weight: 500; }
  }

  .icons {
    display: flex; gap: 15px; color: #ccc; margin-top: 5px;
    svg { cursor: pointer; &:hover { color: #000; } }
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  padding: 0 5px;
  margin-bottom: 20px;
`;

// [핵심] 진행률(percent)을 props로 받아서 배경색을 동적으로 채움
const ProgressBar = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  outline: none;
  margin-bottom: 8px;
  cursor: pointer;

  /* 동적 그라데이션: 진행된 부분(#555) / 남은 부분(#e5e5e5) */
  background: linear-gradient(
    to right, 
    #555 0%, 
    #555 ${props => props.percent}%, 
    #e5e5e5 ${props => props.percent}%, 
    #e5e5e5 100%
  );

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px; height: 12px;
    background: #555;
    border-radius: 50%;
    opacity: 0; /* 평소엔 숨김 */
    transition: opacity 0.2s;
  }

  /* 호버 시 썸(손잡이) 보이기 */
  &:hover::-webkit-slider-thumb {
    opacity: 1;
  }
`;

const TimeLabels = styled.div`
  display: flex; justify-content: space-between;
  font-size: 11px; color: #888; font-weight: 500;
  font-variant-numeric: tabular-nums; /* 숫자 너비 고정 */
`;

const Controls = styled.div`
  width: 100%;
  display: flex; justify-content: center; align-items: center;
  gap: 40px; margin-top: auto;

  svg {
    color: #000; cursor: pointer; transition: transform 0.1s;
    &:active { transform: scale(0.9); }
  }

  .play-pause-btn {
    transform: scale(1.2);
    display: flex; align-items: center; justify-content: center;
    &:active { transform: scale(1.1); }
  }
`;

const MusicWindow = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 재생/일시정지 토글
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 시간 업데이트 이벤트 (재생 중 계속 호출됨)
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  // 오디오 메타데이터 로드 완료 시 (총 길이 설정)
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  // 사용자가 바를 조작했을 때 (Seek)
  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // 재생 끝났을 때
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    audioRef.current.currentTime = 0;
  };

  // 시간 포맷 (초 -> MM:SS)
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // 진행률 계산 (%)
  const percent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Container>
      {/* 실제 오디오 태그 (화면엔 안 보임) */}
      <audio
        ref={audioRef}
        src={SONG_INFO.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <AlbumArt src={SONG_INFO.cover} />

      <SongInfo>
        <div className="text-info">
          <span className="title">{SONG_INFO.title}</span>
          <span className="artist">{SONG_INFO.artist}</span>
        </div>
        <div className="icons">
          <Star size={20} />
          <MoreHorizontal size={20} />
        </div>
      </SongInfo>

      <ProgressContainer>
        <ProgressBar 
          type="range" 
          min="0" 
          max={duration} 
          value={currentTime}
          percent={percent} // 스타일링용 prop
          onChange={handleSeek}
        />
        <TimeLabels>
          <span>{formatTime(currentTime)}</span>
          <span>-{formatTime(duration - currentTime)}</span> {/* 남은 시간 표시 */}
        </TimeLabels>
      </ProgressContainer>

      <Controls>
        <SkipBack size={32} fill="#000" />
        <div className="play-pause-btn" onClick={togglePlay}>
          {isPlaying ? (
            <Pause size={40} fill="#000" />
          ) : (
            <Play size={40} fill="#000" style={{marginLeft: '4px'}} />
          )}
        </div>
        <SkipForward size={32} fill="#000" />
      </Controls>
    </Container>
  );
};

export default MusicWindow;