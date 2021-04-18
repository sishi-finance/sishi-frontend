import React, { useCallback, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton, Image, Tag, Button, LinkExternal } from '@pancakeswap-libs/uikit'
import { Farm } from 'state/types'
import { provider } from 'web3-core'
import useI18n from 'hooks/useI18n'
import { Vault, VaultWithData } from 'config/constants/vaults'
import { BLOCKS_PER_DAY } from 'config'
import { getBalanceNumber } from 'utils/formatBalance'
import VaultRowItem from './VaultRowItem'
import VaultRowItemExpand from "./VaultRowExpand"

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
  // console.log("[VaultCard] Render")
  // const TranslateString = useI18n()
  const { tokenSymbol, tag } = vaultData
  const [expand, setExpand] = useState(false)
  const farmImage = vaultData.tokenSymbol.toLowerCase().replace(" lp", "")
  const rewardToken = "ySishi"
  const yieldAPY = (vaultData.calc.apy)
  const yieldAPR = (vaultData.calc.apr)
  const yieldRoiDay = (vaultData.calc.roiDay)
  const yieldTVL = (vaultData.calc.tvl)
  const walletBalance = (vaultData.calc.walletBalance)
  const pricePerFullShare = (vaultData.pricePerFullShare)
  const mulCurrent = (vaultData.mulCurrent)
  const tokenPrice = vaultData.tokenBUSDRate

  const {
    pendingFarming, vaultAndFarmBalance, vaultStackApproved, lpToken,
    perShare, sharePerBlock,
  } = vaultData

  const share = useMemo(
    () => new BigNumber(vaultData.calc.share)
      .decimalPlaces(0),
    [vaultData.calc.share]
  )

  const yieldBalance = useMemo(
    () => (new BigNumber(share))
      .multipliedBy(new BigNumber(pricePerFullShare))
      .dividedBy(1e18)
      .decimalPlaces(0),
    [share, pricePerFullShare]
  )

  const yieldTVLUSD = useMemo(
    () => new BigNumber(yieldTVL)
      .times(new BigNumber(tokenPrice))
      .dividedBy(1e18),
    [yieldTVL, tokenPrice]
  )

  const walletBalanceUSD = useMemo(
    () => new BigNumber(walletBalance)
      .times(new BigNumber(tokenPrice))
      .dividedBy(1e18),
    [walletBalance, tokenPrice]
  )

  const yieldFarmRoi = useMemo(
    () => new BigNumber(perShare)
      .times(new BigNumber(ySishiPrice))
      .times(BLOCKS_PER_DAY)
      .div(new BigNumber(tokenPrice))
      .dividedBy(1e18),
    [perShare, ySishiPrice, tokenPrice]
  )

  const pendingFarmingUSD = useMemo(
    () => new BigNumber(pendingFarming)
      .times(new BigNumber(ySishiPrice))
      .dividedBy(1e18),
    [pendingFarming, ySishiPrice]
  )

  const yieldFarmAPR = useMemo(
    () => yieldFarmRoi.multipliedBy(365),
    [yieldFarmRoi]
  )

  const yieldFarmAPY = useMemo(
    () => yieldFarmRoi.plus(1).pow(365).minus(1),
    [yieldFarmRoi]
  )

  const onExpandClick = useCallback(() => setExpand(!expand), [setExpand, expand])

  return (
    <div style={{ display: "contents" }}>
      <VaultRowItem {...{
        expand, farmImage, tokenSymbol, onExpandClick,
        yieldTVLUSD, walletBalanceUSD, tag,
        apy: (yieldAPY || 0) + Number(yieldFarmAPY),
        roiDay: (yieldRoiDay || 0) + Number(yieldFarmRoi),
      }} />
      {
        expand && <VaultRowItemExpand {...{
          expand, yieldAPY, yieldAPR, yieldRoiDay, yieldBalance, share, tokenSymbol,
          vaultData, account, walletBalance, yieldFarmAPY, rewardToken, vaultAndFarmBalance, pendingFarming,
          mulCurrent, yieldFarmAPR, vaultStackApproved, yieldFarmRoi, pendingFarmingUSD
        }} />
      }
    </div>
  )
}

export default VaultCard
