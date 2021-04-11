import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout, Link } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'


const Hero = styled.div`
  align-items: center;
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    // background-image: url('/images/egg/3.png'), url('/images/egg/3b.png');
    background-position: left center, right center;
    min-height: 300px;
    padding-top: 0;
  }
`

const Home: React.FC = () => {
  const TranslateString = useI18n()

  return (
    <Page>
      <Hero>
        <Heading as="h1" size="xl" mb="24px" color="secondary">
          Sishi Vault
        </Heading>
        <br/>
        <br/>
        <Heading as="h3" color="secondary">
          Yield Optimization on Binance Smart Chain
        </Heading>
        <br/>
        <br/>
        <br/>
        <Heading as="h3" color="secondary">
          Coming Soon 
        </Heading>
      </Hero>
    </Page>
  )
}

export default Home
