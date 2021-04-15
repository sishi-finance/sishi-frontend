import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout, Link } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import useVaultToken, { useVaults } from 'hooks/useVault'
import { usePriceBnbBusd, usePriceCakeBusd } from 'state/hooks'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import VaultHarvestCard from "./components/VaultHarvestCard"

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

const TableContainer = styled.div`
  width: 100%;
  max-width: calc(100vw - 2em);
  overflow: auto;
`

const Table = styled.table`
  width: 100%;
  vertical-align: middle;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
  // background: ${(props) => props.theme.card.background};

  td, th {
    padding: 10px 5px;
    vertical-align: middle;
  }
`

const Workers: React.FC = () => {
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
        <Heading as="h3" color="secondary">
          Yield Optimization on Binance Smart Chain
        </Heading>
        <br />
        <br />
        <br />
        <Text color="red" fontSize="12px">
          Risk Warning: Sishi Vault is in beta testing, it is unaudited and smart contracts were forked from  
          <a href="https://yearn.finance/" target="_blank" rel="noreferrer"> Yearn Finance</a>.
        </Text>
        <br />
        <br />
        <br />
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th> </th>
                <th style={{textAlign:"left"}}> Reward </th>
                <th style={{textAlign:"left"}}> Action</th>
              </tr>
            </thead>
            <tbody>
              {
                allVaults.map(vault => (<VaultHarvestCard key={vault.tokenSymbol} {...{ vault, account, bnbPrice, cakePrice, ethereum }} />))
              }
            </tbody>
          </Table>

        </TableContainer>
      </Hero>
    </Page>
  )
}

export default Workers
