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
  liquidityUrlPathParts,
  eggPerBlockMultiplierDay,
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
  liquidityUrlPathParts,
  eggPerBlockMultiplierDay,
}) => {

  return <VaultRowStyled style={{ borderBottom: `solid 2px #8884` }}>
    <td colSpan={6}>
      <Row style={{ justifyContent: "stretch", alignItems: "flex-start", padding: "0em 0.5em" }}>
        <div style={{ flex: 3 }}>
          {/* <Row>
            <div style={{ width: "10em", textAlign: "left" }}>APY:</div>
            <div>{(Number(yieldFarmAPY) * 100).toFixed(2)}%</div>
          </Row>
          <Row>
            <div style={{ width: "10em", textAlign: "left" }}>APR:</div>
            <div>{(Number(yieldFarmAPR) * 100).toFixed(2)}%</div>
          </Row>
          <Row>
            <div style={{ width: "10em", textAlign: "left" }}>Daily:</div>
            <div>{(Number(yieldFarmRoi) * 100).toFixed(2)}%</div>
          </Row> */}
          <Row>
            <div style={{ width: "7em", textAlign: "left" }}>Weight:</div>
            <div>{mulCurrent}</div>
          </Row>
          <Row>
            <div style={{ width: "7em", textAlign: "left" }}>Allocate:</div>
            <div>{getBalanceNumber(eggPerBlockMultiplierDay).toFixed(2)} SISHI/Day</div>
          </Row>
          <Row>
            <div style={{ width: "7em", textAlign: "left" }}>{String(tokenSymbol).endsWith(" LP") ? "LP Price" : tokenSymbol}: </div>
            <div>$ {getBalanceNumber(tokenPriceUSD).toFixed(4)}</div>
          </Row>
          <Row>
            <LinkExternal marginTop="0.7em"
              href={ String(tokenSymbol).endsWith(" LP")
                  ? `https://exchange.sishi.finance/#/add/${liquidityUrlPathParts}`
                  : `https://exchange.sishi.finance/#/swap?inputCurrency=BNB&outputCurrency=${tokenAddress}`
              }>
                Get {tokenSymbol}
            </LinkExternal>
          </Row>
          {/* <Row>
            <div style={{ width: "10em", textAlign: "left" }}>Deposit Fee:</div>
            <div>{(depositFeeBP / 100).toFixed(2)}%</div>
          </Row> */}
        </div>
        <div style={{ flex: 3 }}>
          <Row>
            <div style={{ width: "5em", textAlign: "left" }}>Staked:</div>
            <div>{getBalanceNumber(stakedBalance).toFixed(4)} {tokenSymbol}</div>
          </Row>
          <Row>
            <div style={{ width: "5em", textAlign: "left" }}>Earned:</div>
            <div>{getBalanceNumber(pendingFarming).toFixed(4)} {rewardToken} ~ $ {getBalanceNumber(pendingFarmingUSD).toFixed(2)}</div>
          </Row>

        </div>
        <div style={{ flex: 2 }}>
          <StakeAction
            stakedBalance={stakedBalance}
            tokenBalance={tokenBalance}
            earnedBalance={pendingFarming}
            tokenName={lpName}
            tokenDecimal={tokenDecimal}
            pid={pid}
            depositFeeBP={depositFeeBP}
            account={account}
            approved={allowance}
            tokenAddress={tokenAddress}
            rewardToken={rewardToken}
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