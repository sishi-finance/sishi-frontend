import React, { useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton, Image, Tag, Button, LinkExternal } from '@pancakeswap-libs/uikit'
import { Farm } from 'state/types'
import { provider } from 'web3-core'
import useI18n from 'hooks/useI18n'
import { Vault, VaultWithData } from 'config/constants/vaults'
import { BLOCKS_PER_DAY } from 'config'
import { getBalanceNumber } from 'utils/formatBalance'
import VaultAction from "./VaultAction"
import StackAction from "./StackAction"


const Row = styled.div`
  align-items: center;
  display: flex;
`

const VaultRow = styled.tr`
  cursor:pointer;
  &:hover {
    background-color: #8884;
  }
`
interface VaultCardProps {
  vault: Vault
  vaultData: any,
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  ySishiPrice?: BigNumber
  ethereum?: provider
  account?: string
}

const VaultCard: React.FC<VaultCardProps> = ({ vault, vaultData, ethereum, account, cakePrice, bnbPrice, ySishiPrice }) => {
  const TranslateString = useI18n()
  const { tokenSymbol, tag } = vaultData
  const [expand, setExpand] = useState(false)
  const farmImage = vaultData.tokenSymbol.toLowerCase().replace(" lp", "")
  const rewardToken = "ySishi"
  const yieldAPY = (vaultData.calc.apy)
  const yieldAPR = (vaultData.calc.apr)
  const yieldRoiDay = (vaultData.calc.roiDay)
  const yieldTVL = (vaultData.calc.tvl)
  const walletBalance = (vaultData.calc.walletBalance)
  const share = new BigNumber(vaultData.calc.share).decimalPlaces(0)
  const pricePerFullShare = (vaultData.pricePerFullShare)
  const mulCurrent = (vaultData.mulCurrent)
  const tokenPrice = vaultData.tokenBUSDRate
  const yieldBalance = (new BigNumber(share))
    .multipliedBy(new BigNumber(pricePerFullShare))
    .dividedBy(1e18)
    .decimalPlaces(0)

  const yieldTVLUSD = new BigNumber(yieldTVL)
    .times(new BigNumber(tokenPrice))
    .dividedBy(1e18)
  const walletBalanceUSD = new BigNumber(walletBalance)
    .times(new BigNumber(tokenPrice))
    .dividedBy(1e18)
  const {
    pendingFarming, vaultAndFarmBalance, vaultStackApproved, lpToken,
    perShare, sharePerBlock,
  } = vaultData

  // console.log("vaultAndFarmBalance", Number(vaultAndFarmBalance) / 1e18)




  const yieldFarmRoi = new BigNumber(perShare)
    .times(new BigNumber(ySishiPrice))
    .times(BLOCKS_PER_DAY)
    .div(new BigNumber(tokenPrice))
    .dividedBy(1e18)

  const pendingFarmingUSD = new BigNumber(pendingFarming)
    .times(new BigNumber(ySishiPrice))
    .dividedBy(1e18)


  const yieldFarmAPR = yieldFarmRoi.multipliedBy(365)
  const yieldFarmAPY = yieldFarmRoi.plus(1).pow(365).minus(1)

  const onExpandClick = useCallback(() => setExpand(!expand), [setExpand, expand])

  return (
    <>
      <VaultRow key={`${vault.tokenSymbol}_1`} style={{ borderBottom: expand ? 'none' : `solid 2px #8884` }} onClick={onExpandClick}>
        <td style={{ width: "200px", minWidth: "200px" }}>
          <Flex flexDirection="row" alignItems="center" >
            <Image src={`/images/farms/${farmImage}.png`} width={40} height={40} marginLeft="2" marginRight="2" />
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
          {(((yieldAPY || 0) + Number(yieldFarmAPY)) * 100).toFixed(2)}%
        </td>
        <td>
          {(((yieldRoiDay || 0) + Number(yieldFarmRoi)) * 100).toFixed(2)}%
        </td>
        <td>
          ${getBalanceNumber(yieldTVLUSD).toFixed(2)}
        </td>
        <td>
          ${getBalanceNumber(walletBalanceUSD).toFixed(2)}
        </td>
      </VaultRow>
      {
        expand && <VaultRow key={`${vault.tokenSymbol}_2`} style={{ borderBottom: !expand ? 'none' : `solid 2px #8884` }}>
          <td colSpan={6}>
            <Row style={{ justifyContent: "stretch", alignItems: "flex-start", padding: "0em 0.5em" }}>
              <div style={{ flex: 3 }}>
                <Row>
                  <div style={{ width: "10em", textAlign: "left" }}>Vault APY:</div>
                  <div>{(yieldAPY * 100).toFixed(2)}%</div>
                </Row>
                <Row>
                  <div style={{ width: "10em", textAlign: "left" }}>Vault APR:</div>
                  <div>{(yieldAPR * 100).toFixed(2)}%</div>
                </Row>
                <Row>
                  <div style={{ width: "10em", textAlign: "left" }}>Vault Daily:</div>
                  <div>{(yieldRoiDay * 100).toFixed(2)}%</div>
                </Row>
              </div>
              <div style={{ flex: 3 }}>
                {/* <Row>
                  <div style={{ width: "10em", textAlign: "left" }}>Wallet:</div>
                  <div>{getBalanceNumber(walletBalance).toFixed(4)}</div>
                </Row> */}
                <Row>
                  <div style={{ width: "10em", textAlign: "left" }}>Deposit:</div>
                  <div>{getBalanceNumber(yieldBalance).toFixed(4)} {tokenSymbol}</div>
                </Row>
                <Row>
                  <div style={{ width: "10em", textAlign: "left" }}>Vault Share:</div>
                  <div>{getBalanceNumber(share).toFixed(4)} s{tokenSymbol}</div>
                </Row>
              </div>
              <div style={{ flex: 2 }}>
                <VaultAction vault={vaultData} reloadToken={vaultData.reloadToken} account={account} tokenBalance={walletBalance} depositBalance={share} />
              </div>
            </Row>
            <hr style={{ opacity: "0.2", padding: "0 2em" }} />

            <Row style={{ justifyContent: "stretch", alignItems: "flex-start", padding: "0em 0.5em" }}>
              <div style={{ flex: 3 }}>
                <Row>
                  <div style={{ width: "10em", textAlign: "left" }}>{rewardToken} APY:</div>
                  <div>{(Number(yieldFarmAPY) * 100).toFixed(2)}%</div>
                </Row>
                <Row>
                  <div style={{ width: "10em", textAlign: "left" }}>{rewardToken} APR:</div>
                  <div>{(Number(yieldFarmAPR) * 100).toFixed(2)}%</div>
                </Row>
                <Row>
                  <div style={{ width: "10em", textAlign: "left" }}>{rewardToken} Daily:</div>
                  <div>{(Number(yieldFarmRoi) * 100).toFixed(2)}%</div>
                </Row>
                <Row>
                  <div style={{ width: "10em", textAlign: "left" }}>{rewardToken} Weight:</div>
                  <div>{mulCurrent/100}X</div>
                </Row>
              </div>
              <div style={{ flex: 3 }}>
                <Row>
                  <div style={{ width: "10em", textAlign: "left" }}>Stake:</div>
                  <div>{getBalanceNumber(vaultAndFarmBalance).toFixed(4)} s{tokenSymbol}</div>
                </Row>
                <Row>
                  <div style={{ width: "10em", textAlign: "left" }}>Earned:</div>
                  <div>{getBalanceNumber(pendingFarming).toFixed(2)} {rewardToken} ~ ${getBalanceNumber(pendingFarmingUSD).toFixed(2)}</div>
                </Row>
              </div>
              <div style={{ flex: 2 }}>
                <StackAction
                  vault={vaultData}
                  reloadToken={vaultData.reloadToken}
                  vaultStackApproved={vaultStackApproved}
                  account={account} 
                  tokenBalance={share} 
                  depositBalance={vaultAndFarmBalance} 
                  pendingHarvest={pendingFarming}
                />
              </div>
            </Row>

            {/* <hr style={{ opacity: "0.2", padding: "0 2em" }} /> */}

            <Row style={{ justifyContent: "stretch", marginTop: "1em", padding: "0em 0.5em" }}>
              <LinkExternal href={`https://bscscan.com/address/${vaultData.vault}`} fontSize="12" marginRight="3">Vault contract</LinkExternal>
              <LinkExternal href={`https://bscscan.com/address/${vaultData.strategy}`} fontSize="12" marginRight="3">Strategy contract</LinkExternal>
            </Row>
          </td>
        </VaultRow>
      }
    </>
  )
}

export default VaultCard
