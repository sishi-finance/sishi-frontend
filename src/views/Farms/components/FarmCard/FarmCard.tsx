import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton } from '@pancakeswap-libs/uikit'
import { communityFarms } from 'config/constants'
import { Farm } from 'state/types'
import { provider } from 'web3-core'
import useI18n from 'hooks/useI18n'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { QuoteToken } from 'config/constants/types'
import { useFarmUser } from 'state/hooks'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import ApyButton from './ApyButton'
import FarmRowItem from './FarmRowItem'
import FarmRowItemExpand from './FarmRowExpand'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

const RainbowLight = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 0px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const FCard = styled.tr`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};
  border-radius: 0px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

interface FarmCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  ethereum?: provider
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, removed, cakePrice, bnbPrice, ethereum, account }) => {
  const TranslateString = useI18n()

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  const { allowance, tokenBalance, stakedBalance, earnings, } = useFarmUser(farm.pid)

  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  // const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  const farmImage = farm.isTokenOnly
    ? farm.tokenSymbol.toLowerCase()
    : `${farm.tokenSymbol.toLowerCase()}-${farm.quoteTokenSymbol.toLowerCase()}`

  const totalValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return null
    }
    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.SISHI) {
      return cakePrice.times(farm.lpTotalInQuoteToken)
    }
    return farm.lpTotalInQuoteToken
  }, [bnbPrice, cakePrice, farm.lpTotalInQuoteToken, farm.quoteTokenSymbol])

  const totalValueFormated = totalValue
    ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  const tokenPriceInUSD: BigNumber = useMemo(() => {
    if (!farm.tokenPriceVsQuote)
      return null

    const priceInQuoteToken = (!farm.isTokenOnly && farm.lpTotalSupply && farm.lpTotalInQuoteToken)
      ? new BigNumber(farm.lpTotalQuote)
        .multipliedBy(2)
        .div(farm.lpTotalSupply)
      : new BigNumber((farm.tokenPriceVsQuote).toString())


    if (farm.quoteTokenSymbol === QuoteToken.BNB)
      return priceInQuoteToken
        .times(bnbPrice)
    if (farm.quoteTokenSymbol === QuoteToken.BUSD) {
      // console.log( "[fk]" ,farm.lpSymbol, farm.lpTotalInQuoteToken, farm.lpTotalSupply)
      return priceInQuoteToken
    }
    if (farm.quoteTokenSymbol === QuoteToken.SISHI)
      return priceInQuoteToken
        .times(cakePrice)

    return null
  }, [farm.lpTotalQuote, bnbPrice, cakePrice, farm.tokenPriceVsQuote, farm.quoteTokenSymbol, farm.isTokenOnly, farm.lpTotalSupply, farm.lpTotalInQuoteToken])

  const tokenSymbol = farm.isTokenOnly ? farm.tokenSymbol : farm.lpSymbol
  const tokenAddress = farm.isTokenOnly ? farm.tokenAddresses[56] : farm.lpAddresses[56]
  // const lpLabel = farm.lpSymbol
  const earnLabel = 'SISHI'
  // const farmAPY =
  //   farm.apy &&
  //   farm.apy.times(new BigNumber(100)).toNumber().toLocaleString(undefined, {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   })

  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, risk } = farm


  return (
    <div style={{ display: "contents" }}>
      <FarmRowItem {...{
        depositFee: farm.depositFeeBP / 10000,
        farmImage,
        expand: showExpandableSection,
        onExpandClick: () => setShowExpandableSection(!showExpandableSection),
        tokenSymbol,
        apy: Number(farm.apy),
        roiDay: Number(farm.apy) / 365,
        walletBalanceUSD: Number(tokenBalance) * Number(tokenPriceInUSD),
        yieldTVLUSD: Number(totalValue) * 1e18,
        stakedUSD: Number(stakedBalance) * Number(tokenPriceInUSD),
        tokenBalance,
        stakedBalance,
      }} />
      {
        showExpandableSection && <FarmRowItemExpand {...{
          depositFeeBP: farm.depositFeeBP,
          lpName: farm.lpSymbol,
          mulCurrent: farm.multiplier,
          pendingFarming: Number(earnings),
          pendingFarmingUSD: Number(earnings) * Number(cakePrice),
          pid: farm.pid,
          rewardToken: earnLabel,
          stakedBalance,
          tokenBalance,
          tokenSymbol,
          tokenAddress,
          tokenDecimal: farm.tokenDecimal ?? 16,
          yieldFarmRoi: Number(farm.apy) / 365,
          yieldFarmAPR: Number(farm.apy),
          yieldFarmAPY: (Number(farm.apy) / 365 + 1) ** 365 - 1,
          account,
          allowance: Number(allowance) > 1e25,
          tokenPriceUSD: Number(tokenPriceInUSD) * 1e18,
        }} />
      }
    </div>
  )
}

export default FarmCard
