import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout, Link } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import StyledCountdown from 'components/Countdown'
import CountdownUpdateTimelock from 'components/CountdownUpdateTimelock'
import FarmStakingCard from './components/FarmStakingCard'
import LotteryCard from './components/LotteryCard'
import CakeStats from './components/CakeStats'
import TotalValueLockedCard from './components/TotalValueLockedCard'
import TwitterCard from './components/TwitterCard'
import BurningStats from './components/BurningStats'
import SishiFinanceStats from './components/SishiFinanceStats'
import SishiProducts from './components/SishiProducts'

const Fieldset = styled.fieldset`
  display: block;
  margin-inline-start: 2px;
  margin-inline-end: 2px;
  padding-block-start: 0.35em;
  padding-inline-start: 0.75em;
  padding-inline-end: 0.75em;
  padding-block-end: 0.625em;
  min-inline-size: min-content;
  border-width: 2px;
  border-style: groove;
  border-color: ${({ theme }) => theme.colors.borderColor};
  border-image: initial;
  legend {
    text-align: center;
    padding: 0.5em;
    border-color: ${({ theme }) => theme.colors.borderColor};
    font-size: 22px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: bold;
  }
`

const Hero = styled.div`
  align-items: center;
  // background-image: url('/images/egg/3.png');
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 70px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    // background-image: url('/images/egg/3.png'), url('/images/egg/3b.png');
    background-position: left center, right center;
    height: 100px;
    padding-top: 0;
  }
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 48px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const Home: React.FC = () => {
  const TranslateString = useI18n()

  return (
    <Page>
      <Fieldset style={{ padding: "1em", textAlign: "center" }}>
        <legend>
          Sishi Finance
        </legend>
        <Text as="h3" color="secondary" style={{ fontWeight: "bold", maxWidth: "600px", margin: "auto" }}>
          Inspired by  <a href="https://bitcoin.org/bitcoin.pdf" target="_blank" rel="noreferrer">Bitcoin</a>,
          21 million SISHI was designed to be the first Yield-of-Value asset based on Binance Smart Chain.
        </Text>
        <br />
      </Fieldset>
      <br />
      <br />
      <Fieldset>
        <legend>
          Sishi Stats
        </legend>
        <SishiFinanceStats/>
      </Fieldset>
      <br />
      <br />
      <Fieldset style={{padding:"2em"}}>
        <legend>
          s-Products
        </legend>
        <SishiProducts/>
      </Fieldset>
      <div>
        <Cards>
          <div>
            {/* <FarmStakingCard /> */}
            <br />
            <br />
            {/* <CakeStats /> */}
          </div>
          {/* <BurningStats /> */}
          {/* <TotalValueLockedCard /> */}
          {/* <TwitterCard /> */}
        </Cards>
      </div>

    </Page>
  )
}

export default Home
