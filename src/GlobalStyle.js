// src/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    width: 100vw;
    height: 100vh;
    overflow: hidden; /* 스크롤 방지 */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  #root {
    width: 100%;
    height: 100%;
  }
`;

export default GlobalStyle;