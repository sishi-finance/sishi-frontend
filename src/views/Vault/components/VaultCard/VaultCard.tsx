import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton, Image, Tag, Button, LinkExternal } from '@pancakeswap-libs/uikit'
import { Farm } from 'state/types'
import { provider } from 'web3-core'
import useI18n from 'hooks/useI18n'
import { VaultWithData } from 'config/constants/vaults'
import { ExternalLink } from 'react-feather'
import VaultAction from "./VaultAction"


const Row = styled.div`
  align-items: center;
  display: flex;
`
interface VaultCardProps {
  vault: VaultWithData
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  ethereum?: provider
  account?: string
}

const VaultCard: React.FC<VaultCardProps> = ({ vault, ethereum, account, cakePrice, bnbPrice }) => {
  const TranslateString = useI18n()

  const [expand, setExpand] = useState(false)

  const farmImage = vault.tokenSymbol.toLowerCase().replace(" lp","")

  const lpLabel = vault.tokenSymbol
  const earnLabel = 'SISHI'
  const farmAPY = vault.calc.apy
  const farmAPR = vault.calc.apr
  const roiDay = vault.calc.roiDay
  const tvl = vault.calc.tvl
  const balance = vault.calc.balance
  const walletBalance = vault.calc.walletBalance
  const { tokenSymbol, tag } = vault


  return (
    <>
      <tr style={{ borderBottom: expand ? 'none' : `solid 2px #8884` }} onClick={() => setExpand(!expand)}>
        <td style={{ width: "200px" }}>
          <Flex flexDirection="row" alignItems="center" >
            <Image src={`/images/farms/${farmImage}.png`} width={40} height={40} marginRight="2"/>
            <span style={{ fontSize: '20px' }}>{tokenSymbol}</span>
          </Flex>
        </td>
        <td style={{ textAlign: "left" }}>
          {tag.map(e => <>
            <Tag >{e}</Tag>
            {" "}
          </>)}
        </td>
        <td>
          {(farmAPY * 100).toFixed(2)}%
        </td>
        <td>
          {(roiDay * 100).toFixed(2)}%
        </td>
        <td>
          {Number(tvl).toFixed(4)}
        </td>
        <td>
          {Number(walletBalance).toFixed(4)}
        </td>
      </tr>
      {expand && <tr style={{ borderBottom: !expand ? 'none' : `solid 2px #8884` }}>
        <td colSpan={6}>
          <Row style={{ justifyContent: "stretch" }}>
            <div style={{ flex: 1 }}>
              <Row>
                <div style={{ width: "10em", textAlign: "left" }}>Vault APY:</div>
                <div>{(farmAPY * 100).toFixed(2)}%</div>
              </Row>
              <Row>
                <div style={{ width: "10em", textAlign: "left" }}>Vault APR:</div>
                <div>{(farmAPR * 100).toFixed(2)}%</div>
              </Row>
              <Row>
                <div style={{ width: "10em", textAlign: "left" }}>Vault Daily:</div>
                <div>{(roiDay * 100).toFixed(2)}%</div>
              </Row>
            </div>
            <div style={{ flex: 1 }}>
              <Row>
                <div style={{ width: "10em", textAlign: "left" }}>Wallet:</div>
                <div>{Number(walletBalance).toFixed(4)}</div>
              </Row>
              <Row>
                <div style={{ width: "10em", textAlign: "left" }}>Vault:</div>
                <div>{Number(balance).toFixed(4)}</div>
              </Row>
            </div>
            <div>
              <VaultAction vault={vault} tokenBalance={new BigNumber(walletBalance * 1e18)} depositBalance={new BigNumber(balance * 1e18)} />
            </div>
          </Row>

          <Row style={{ justifyContent: "stretch", marginTop: "1em" }}>
            <LinkExternal href={`https://bscscan.com/address/${vault.vault}`} fontSize="12" marginRight="3">Vault contract</LinkExternal>
            <LinkExternal href={`https://bscscan.com/address/${vault.strategy}`} fontSize="12" marginRight="3">Strategy contract</LinkExternal>
          </Row>

        </td>
      </tr>}
    </>
  )
}

export default VaultCard
