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
  const walletBalance = new BigNumber(vaultData.calc.walletBalance)
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

  const yieldBalance = Number(share) * Number(pricePerFullShare) / 1e18
  
  const yieldTVLUSD = Number(yieldTVL) * Number(tokenPrice) / 1e18

  const walletBalanceUSD = Number(walletBalance) * Number(tokenPrice) / 1e18

  const pendingFarmingUSD = Number(pendingFarming) * Number(ySishiPrice) / 1e18

  const _yieldFarmRoi = Number(perShare)
    * Number(ySishiPrice)
    * Number(BLOCKS_PER_DAY)
    / Number(tokenPrice)
    / 1e18
  
  const yieldFarmRoi = Number.isFinite(_yieldFarmRoi) ? _yieldFarmRoi : 0

  const yieldFarmAPR = yieldFarmRoi * 365

  const yieldFarmAPY = (yieldFarmRoi + 1) ** 365 - 1

  const onExpandClick = useCallback(() => setExpand(!expand), [setExpand, expand])

  return (
    <div style={{ display: "contents" }}>
      <VaultRowItem {...{
        expand, farmImage, tokenSymbol, onExpandClick,
        yieldTVLUSD, walletBalanceUSD, tag,
        apy: Number(yieldAPY) + Number(yieldFarmAPY),
        roiDay: Number(yieldRoiDay) + Number(yieldFarmRoi),
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
