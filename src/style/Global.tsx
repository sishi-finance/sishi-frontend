import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@pancakeswap-libs/uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: monospace;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};
    &:before{
      content: "";
      position: fixed;
      left 0;
      top 0;
      width: 100%;
      height: 100%;
      background-image: url('/bitcoin.png');
      background-size: cover;
      opacity: 0.1;
      filter: blur(2px);
    }
    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
