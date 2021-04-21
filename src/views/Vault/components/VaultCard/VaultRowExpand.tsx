import React, { useCallback, useMemo, useState } from 'react'
import styled from "styled-components"
import { Flex, Text, Skeleton, Image, Tag, Button, LinkExternal } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import StackAction from "./StackAction"
import VaultAction from "./VaultAction"

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

type VaultRowItemExpand = {
  expand,
  yieldAPY,
  yieldAPR,
  yieldRoiDay,
  yieldBalance,
  share,
  tokenSymbol,
  vaultData,
  account,
  walletBalance,
  yieldFarmAPY,
  rewardToken,
  vaultAndFarmBalance,
  pendingFarming,
  mulCurrent,
  yieldFarmAPR,
  vaultStackApproved,
  yieldFarmRoi,
  pendingFarmingUSD
}

const VaultRowItemExpand: React.FC<VaultRowItemExpand> = ({
  yieldAPY,
  yieldAPR,
  yieldRoiDay,
  yieldBalance,
  share,
  tokenSymbol,
  vaultData,
  account,
  walletBalance,
  yieldFarmAPY,
  rewardToken,
  vaultAndFarmBalance,
  pendingFarming,
  mulCurrent,
  yieldFarmAPR,
  vaultStackApproved,
  yieldFarmRoi,
  pendingFarmingUSD,
}) => {
  return <VaultRowStyled style={{ borderBottom: `solid 2px #8884` }}>
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
          <VaultAction
            vault={vaultData}
            reloadToken={vaultData.reloadToken}
            account={account}
            tokenBalance={walletBalance}
            depositBalance={share} />
        </div>
      </Row>
      <hr style={{ opacity: "0.2", padding: "0 2em" }} />
      {
        vaultData.farmPid >= 0 && <Row style={{ justifyContent: "stretch", alignItems: "flex-start", padding: "0em 0.5em" }}>
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
              <div>{mulCurrent / 100}X</div>
            </Row>
          </div>
          <div style={{ flex: 3 }}>
            <Row>
              <div style={{ width: "10em", textAlign: "left" }}>Staked:</div>
              <div>{getBalanceNumber(vaultAndFarmBalance).toFixed(4)} s{tokenSymbol}</div>
            </Row>
            <Row>
              <div style={{ width: "10em", textAlign: "left" }}>Earned:</div>
              <div>{getBalanceNumber(pendingFarming).toFixed(4)} {rewardToken} ~ $ {getBalanceNumber(pendingFarmingUSD).toFixed(2)}</div>
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
      }

      <Row style={{ justifyContent: "stretch", marginTop: "1em", padding: "0em 0.5em" }}>
        <LinkExternal href={`https://bscscan.com/address/${vaultData.vault}`} fontSize="12" marginRight="3">Vault contract</LinkExternal>
        <LinkExternal href={`https://bscscan.com/address/${vaultData.strategy}`} fontSize="12" marginRight="3">Strategy contract</LinkExternal>
      </Row>
    </td>
  </VaultRowStyled>
}

export default VaultRowItemExpand