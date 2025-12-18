import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';

// ==================== 스타일 정의 ====================

// [수정] 처음에 보내주신 원본 스타일로 복구
const Body = styled.div`
  width: 100%;
  height: 100%;
  padding: 15px;
  background-color: rgba(30, 30, 30, 0.95);
  color: #fff;
  /* 원본 폰트 스택 */
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace; 
  font-size: 14px; /* 원본 크기 */
  overflow-y: auto;
  line-height: 1.5; /* 원본 줄 간격 */

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
  }
`;

// [수정] 아스키 아트일 경우에만 줄 간격을 좁히는 로직 추가
const Line = styled.div`
  margin-bottom: 5px;
  color: ${props => props.isCommand ? '#fff' : '#aaa'};
  white-space: pre-wrap;
  
  /* 아스키 아트 전용 스타일 override */
  ${props => props.isAscii && css`
    font-size: 10px; /* 아트는 약간 작게 */
    line-height: 1.4; /* 줄 간격을 좁혀서 그림이 이어지게 함 */
    font-family: 'Courier New', monospace; /* 아트 정렬에 유리한 폰트 */
    color: #e5e5e5;
    margin-bottom: 20px;
  `}
`;

const InputLine = styled.div`
  display: flex;
  align-items: center;
`;

const Prompt = styled.span`
  color: #32cd32;
  margin-right: 10px;
  font-weight: bold;
`;

const Input = styled.input`
  background: transparent;
  border: none;
  color: #fff;
  font-family: inherit;
  font-size: inherit;
  flex: 1;
  outline: none;
`;

// 아스키 아트 데이터
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
      // 일반 명령어 입력 줄
      const newLines = [...lines, { text: `yeonjae@MacBookPro ~ % ${inputValue}`, isCommand: true }];
      
      let response = "";
      let isAscii = false; // 아스키 아트 여부 플래그
      
      switch (command.toLowerCase()) {
        case 'help':
          response = "Available commands:\n  help      - Show help\n  ls        - List files\n  cd [app]  - Open app\n  clear     - Clear screen\n  yeonjae   - ???"; 
          break;
        case 'ls':
          response = "projects/  music/  garageband/  guestbook/  about/";
          break;
        
        // --- 앱 실행 ---
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
        case 'garageband':
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

        // --- 아스키 아트 이스터에그 ---
        case 'yeonjae':
          response = SMILE_ASCII;
          isAscii = true; // 아스키 아트임!
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
        // isAscii prop을 함께 전달
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