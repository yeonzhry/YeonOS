import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';

// ==================== 스타일 정의 (반응형 적용) ====================

const Body = styled.div`
  width: 100%;
  height: 100%;
  padding: 15px;
  background-color: rgba(30, 30, 30, 0.95);
  color: #fff;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace; 
  font-size: 14px; 
  overflow-y: auto;
  overflow-x: hidden; /* 가로 스크롤 방지 (기본 텍스트) */
  line-height: 1.5;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
  }

  /* [반응형] 모바일에서 패딩과 폰트 크기 축소 */
  @media (max-width: 768px) {
    padding: 10px;
    font-size: 12px;
  }
`;

const Line = styled.div`
  margin-bottom: 5px;
  color: ${props => props.isCommand ? '#fff' : '#aaa'};
  white-space: pre-wrap; /* 줄바꿈 유지 + 자동 줄바꿈 */
  word-break: break-all; /* 긴 단어도 강제로 줄바꿈하여 화면 안넘치게 */
  
  /* 아스키 아트 전용 스타일 override */
  ${props => props.isAscii && css`
    font-size: 10px;
    line-height: 1.2; 
    font-family: 'Courier New', monospace;
    color: #e5e5e5;
    margin-bottom: 20px;
    white-space: pre; /* 아스키 아트는 줄바꿈 금지 (모양 유지) */
    overflow-x: auto; /* 화면보다 크면 가로 스크롤 생김 */
    
    /* [반응형] 모바일에서 아스키 아트가 깨지지 않도록 폰트 대폭 축소 */
    @media (max-width: 768px) {
      font-size: 6px; 
      line-height: 1.0;
    }
  `}
`;

const InputLine = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap; /* 모바일에서 프롬프트가 너무 길면 입력창 줄바꿈 허용 (선택사항) */
`;

const Prompt = styled.span`
  color: #32cd32;
  margin-right: 10px;
  font-weight: bold;
  white-space: nowrap; /* 프롬프트는 줄바꿈 안되게 */

  /* [반응형] 모바일에서 프롬프트 폰트 조금 더 작게 */
  @media (max-width: 768px) {
    font-size: 11px;
    margin-right: 5px;
  }
`;

const Input = styled.input`
  background: transparent;
  border: none;
  color: #fff;
  font-family: inherit;
  font-size: inherit;
  flex: 1;
  outline: none;
  min-width: 100px; /* 너무 작아지지 않게 최소 너비 설정 */
`;

// ==================== 데이터 및 로직 ====================

const SMILE_ASCII = `
                 *@@@                                                          
              @@@.   @@@@      @@@@@@@@@@@@@@@@@@@       @@@@(@@@@              
              .@@      @@@@@@@@                   @@@@@%@@@     @@@             
               @@@    @@@@                             @@@@     @@@             
                %@@@@@                                    .@@@@@@               
                 @@@                                         @@@                
               @@@                                             @@@              
              @@(                                               @@@             
             @@                   @@@         @@@                ,@@            
            @@,                                                   &@@           
           @@@                                                     @@&          
           @@#                          @@@@                       @@@          
           @@                           @@@@                       .@@          
           @@                     @@@   @@@   @@@                  (@@          
           @@@                       @@@# @@@@@/                   @@@          
           .@@&                                                   @@@           
            .@@@                                                 @@@            
              @@@@                                             @@@%             
                &@@@@/                                     @@@@@                
                    ,@@@@@@@                        (@@@@@@@                    
                            &@@@@@@@@@@@@@@@@@@@@@@@,                           
`;

const TerminalWindow = ({ openApp }) => {
  const getLoginMessage = () => {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const dayNum = now.getDate();
    const time = now.toTimeString().split(' ')[0]; 
    return `Last login: ${dayName} ${monthName} ${dayNum} ${time} on ttys000`;
  };

  const [lines, setLines] = useState([
    { text: getLoginMessage(), isCommand: false }, 
    { text: "Welcome to YeonJae's OS. Type 'help' to see commands.", isCommand: false },
  ]);

  const [inputValue, setInputValue] = useState("");
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  const handleBodyClick = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const command = inputValue.trim();
      const newLines = [...lines, { text: `yeonjae@MacBookPro ~ % ${inputValue}`, isCommand: true }];
      
      let response = "";
      let isAscii = false;
      
      switch (command.toLowerCase()) {
        case 'help':
          response = "Available commands:\n  help      - Show help\n  ls        - List files\n  cd [app]  - Open app\n  clear     - Clear screen\n  yeonjae   - ???"; 
          break;
        case 'ls':
          response = "projects/  music/  garageband/  guestbook/  about/";
          break;
        case 'cd project':
        case 'cd projects':
          response = "Opening Projects Directory...";
          openApp('project');
          break;
        case 'cd music':
          response = "Starting Music Player...";
          openApp('music');
          break;
        case 'cd garageband':
          response = "Launching GarageBand Synth...";
          openApp('garage');
          break;
        case 'cd guestbook':
          response = "Opening Guest Book...";
          openApp('guest');
          break;
        case 'cd about':
          response = "Opening About Me...";
          openApp('about');
          break;
        case 'yeonjae':
          response = SMILE_ASCII;
          isAscii = true;
          break;
        case 'clear':
          setLines([]);
          setInputValue("");
          return;
        case '':
          response = "";
          break;
        default:
          if (command.startsWith('cd ')) {
             response = `cd: no such file or directory: ${command.replace('cd ', '')}`;
          } else {
             response = `zsh: command not found: ${command}`;
          }
      }

      if (response) {
        newLines.push({ text: response, isCommand: false, isAscii: isAscii });
      }

      setLines(newLines);
      setInputValue("");
    }
  };

  return (
    <Body ref={bodyRef} onClick={handleBodyClick}>
      {lines.map((line, index) => (
        <Line key={index} isCommand={line.isCommand} isAscii={line.isAscii}>
          {line.text}
        </Line>
      ))}
      <InputLine>
        <Prompt>yeonjae@MacBookPro ~ %</Prompt>
        <Input 
          ref={inputRef}
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </InputLine>
    </Body>
  );
};

export default TerminalWindow;