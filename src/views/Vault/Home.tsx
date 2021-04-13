import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout, Link } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import useVaultToken, { useVaults } from 'hooks/useVault'
import { usePriceBnbBusd, usePriceCakeBusd } from 'state/hooks'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import VaultCard from "./components/VaultCard/VaultCard"

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

const Table = styled.table`
  width: 100%;
  vertical-align: middle;
  
  tr, td {
    padding: 8px 5px;
    vertical-align: middle;
  }
`

const Home: React.FC = () => {
  const TranslateString = useI18n()
  const allVaults = useVaults()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()

  return (
    <Page>
      <Hero>
        <Heading as="h1" size="xl" mb="24px" color="secondary">
          Sishi Vault
        </Heading>
        <br />
        <br />
        <Heading as="h3" color="secondary">
          Yield Optimization on Binance Smart Chain
        </Heading>
        <br />
        <br />
        <br />
        <Heading as="h3" color="secondary">
          Coming Soon
        </Heading>
        <br />
        <div style={{ width: "100%" }}>
          <Table>
            <thead>
              <th> </th>
              <th> </th>
              <th> APY </th>
              <th> Daily</th>
              <th> TVL</th>
              <th> Balance</th>
              <th> </th>
            </thead>
            <tbody>
              {
                allVaults.map(vault => (<VaultCard {...{ vault, account, bnbPrice, cakePrice, ethereum }} />))
              }
            </tbody>
          </Table>

        </div>
      </Hero>
    </Page>
  )
}

export default Home
