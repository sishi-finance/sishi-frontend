import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout, Link } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Page from 'components/layout/Page'
import { useVaults, useVaultsData, useVaultsUserData, useYSISHIPrice } from 'hooks/useVault'
import { usePriceBnbBusd, usePriceCakeBusd } from 'state/hooks'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import useBlock from 'hooks/useBlock'
import BigNumber from 'bignumber.js'
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

const TableContainer = styled.div`
  width: 100%;
  max-width: calc(100vw - 2em);
  overflow: auto;
  font-weight: bold;
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


const VaultHome: React.FC<{ account, ethereum, allVaults, cakePrice, bnbPrice, ySishiPrice, currentBlock }> = ({ account, ethereum, allVaults, cakePrice, bnbPrice, ySishiPrice, currentBlock, }) => {

  // console.log("[Rerender]", {
  //   cakePrice: String(cakePrice),
  //   bnbPrice: String(bnbPrice),
  //   ySishiPrice: String(ySishiPrice),
  //   currentBlock: String(currentBlock)
  // })

  const [token, setToken] = useState(Math.random())
  const vaultDatas = useVaultsData(allVaults, { currentBlock, bnbBusdRate: bnbPrice, sishiBusdRate: ySishiPrice, token })
  const vaultDataUsers = useVaultsUserData(allVaults, { account, token })
  const reloadToken = useCallback(() => setToken(Math.random()), [setToken])

  const allMergeVaults = useMemo(
    () => {
      console.log("[allMergeVaults] update")
      String(reloadToken);
      return allVaults.map((vault, index) => ({
        ...vault,
        ...vaultDatas[index] || {},
        ...vaultDataUsers[index] || {},
        calc: {
          ...vaultDatas[index]?.calc || {},
          ...vaultDataUsers[index]?.calc || {},
        },
        reloadToken,
      }))
    },
    [allVaults, vaultDatas, vaultDataUsers, reloadToken]
  )

  const allVaultRender = useMemo(() => {
    return allVaults.map((vault, index) => (<VaultCard
      key={vault.tokenSymbol}
      {...{ vault, vaultData: allMergeVaults[index], account, bnbPrice, cakePrice, ethereum, ySishiPrice }}
    />))
  }, [allVaults, allMergeVaults, account, bnbPrice, cakePrice, ethereum, ySishiPrice])


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
          <br />
          ySISHI is a test token, it has no value.
        </Text>

        <Text color="red" fontSize="12px">
          Action Required: Unstack All Vault Share Token to earn ySISHI from Venus Farm.
        </Text>

        <br />
        <br />
        <br />
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th> </th>
                <th style={{ textAlign: "left" }}> Farm </th>
                <th> Daily</th>
                <th> APY </th>
                <th> TVL</th>
                <th> Balance</th>
                {/* <th> </th> */}
              </tr>
            </thead>
            <tbody>
              {allVaultRender}
            </tbody>
          </Table>

        </TableContainer>
      </Hero>
    </Page>
  )
}

const Home: React.FC = () => {
  const allVaults = useVaults()
  const cakePrice = String(usePriceCakeBusd())
  const bnbPrice = String(usePriceBnbBusd())
  const ySishiPrice = String(useYSISHIPrice())
  const currentBlock = Math.floor(useBlock() / 30) * 30
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()

  return useMemo(
    () => {
      // console.log("[compare]", [cakePrice, bnbPrice, ySishiPrice, currentBlock])
      return <VaultHome
        allVaults={allVaults}
        cakePrice={new BigNumber(cakePrice)}
        bnbPrice={new BigNumber(bnbPrice)}
        ySishiPrice={new BigNumber(ySishiPrice)}
        currentBlock={currentBlock}
        account={account}
        ethereum={ethereum}
      />
    },
    [allVaults, cakePrice, bnbPrice, ySishiPrice, currentBlock, account, ethereum,]
  )
}



export default Home
