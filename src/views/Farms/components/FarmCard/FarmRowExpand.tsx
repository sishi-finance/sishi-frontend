import React, { useCallback, useMemo, useState } from 'react'
import styled from "styled-components"
import { Flex, Text, Skeleton, Image, Tag, Button, LinkExternal } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import StakeAction from "./StakeAction"

const Row = styled.div`
  align-items: center;
  display: flex;
`

const VaultRowStyled = styled.tr`
  cursor:pointer;
  &:hover {
    background-color: #8884;
  }
`

type FarmRowItemExpandParam = {
  tokenSymbol,
  yieldFarmAPY,
  rewardToken,
  pendingFarming,
  mulCurrent,
  yieldFarmAPR,
  yieldFarmRoi,
  pendingFarmingUSD,
  stakedBalance,
  tokenBalance,
  lpName,
  tokenDecimal,
  pid,
  depositFeeBP,
  tokenAddress,
  account,
  allowance,
  tokenPriceUSD,
}

const FarmRowItemExpand: React.FC<FarmRowItemExpandParam> = ({
  tokenSymbol,
  yieldFarmAPY,
  rewardToken,
  pendingFarming,
  mulCurrent,
  yieldFarmAPR,
  yieldFarmRoi,
  pendingFarmingUSD,
  stakedBalance,
  tokenBalance,
  lpName,
  tokenDecimal,
  tokenAddress,
  pid,
  depositFeeBP,
  account,
  allowance,
  tokenPriceUSD,
}) => {
  return <VaultRowStyled style={{ borderBottom: `solid 2px #8884` }}>
    <td colSpan={6}>
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
            <div>{mulCurrent}</div>
          </Row>
        </div>
        <div style={{ flex: 4 }}>
          <Row>
            <div style={{ width: "10em", textAlign: "left" }}>Stake:</div>
            <div>{getBalanceNumber(stakedBalance).toFixed(4)} {tokenSymbol}</div>
          </Row>
          <Row>
            <div style={{ width: "10em", textAlign: "left" }}>Earned:</div>
            <div>{getBalanceNumber(pendingFarming).toFixed(4)} {rewardToken} ~ $ {getBalanceNumber(pendingFarmingUSD).toFixed(2)}</div>
          </Row>
          <Row>
            <div style={{ width: "10em", textAlign: "left" }}>{tokenSymbol}: </div>
            <div>$ {getBalanceNumber(tokenPriceUSD).toFixed(4)}</div>
          </Row>
        </div>
        <div style={{ flex: 2 }}>
          <StakeAction
            stakedBalance={stakedBalance}
            tokenBalance={tokenBalance}
            tokenName={lpName}
            tokenDecimal={tokenDecimal}
            pid={pid}
            depositFeeBP={depositFeeBP}
            account={account}
            approved={allowance}
            tokenAddress={tokenAddress}
          />
        </div>
      </Row>

      {/* <Row style={{ justifyContent: "stretch", marginTop: "1em", padding: "0em 0.5em" }}>
        <LinkExternal href={`https://bscscan.com/address/${vaultData.vault}`} fontSize="12" marginRight="3">Vault contract</LinkExternal>
        <LinkExternal href={`https://bscscan.com/address/${vaultData.strategy}`} fontSize="12" marginRight="3">Strategy contract</LinkExternal>
      </Row> */}
    </td>
  </VaultRowStyled>
}

export default FarmRowItemExpand