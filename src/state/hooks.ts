import BigNumber from 'bignumber.js'
import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import { BLOCKS_PER_DAY } from 'config'
import { fetchFarmsPublicDataAsync, fetchPoolsPublicDataAsync, fetchPoolsUserDataAsync } from './actions'
import { State, Farm, Pool } from './types'
import { QuoteToken } from '../config/constants/types'

const ZERO = new BigNumber(0)

export const useFetchPublicData = () => {
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync())
    // dispatch(fetchPoolsPublicDataAsync())
  }, [dispatch, slowRefresh])
}

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
  }
}

export const useFarmsUser = () => {
  const farms: Farm[] = useSelector((state: State) => state.farms.data)
  const bnbPrice = usePriceBnbBusd()
  const cakePrice = usePriceCakeBusd()

  const getTokenQuotePrice = (sym: string) => {
    if (sym === QuoteToken.BNB)
      return bnbPrice
    if (sym === QuoteToken.BUSD)
      return 1
    if (sym === QuoteToken.SISHI)
      return cakePrice
    return 0
  }

  return farms.map(farm => {

    const priceInQuoteToken = (!farm.isTokenOnly && farm.lpTotalSupply && farm.lpTotalInQuoteToken)
      ? new BigNumber(farm.lpTotalQuote)
        .multipliedBy(2)
        .div(farm.lpTotalSupply)
      : new BigNumber((farm.tokenPriceVsQuote ?? "0").toString())

    const tokenPriceUSD = farm.tokenPriceVsQuote
      ? Number(priceInQuoteToken) * Number(getTokenQuotePrice(farm.quoteTokenSymbol))
      : 0

    const earningPerDay = Number(farm.eggPerBlockMultiplier) 
      * Number(farm.userData?.stakedBalance ?? 0) / Number(farm.lpTokenBalanceMC ?? 0)
      * Number(BLOCKS_PER_DAY)
    
    
    return {
      ...farm,
      tokenPriceUSD,
      allowance: farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
      tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
      stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
      tokenBalanceUSD: Number(farm.userData?.tokenBalance ?? 0) * tokenPriceUSD,
      stakedBalanceUSD: Number(farm.userData?.stakedBalance ?? 0) * tokenPriceUSD,
      earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
      lpTotalInUSD: Number(farm.lpTokenBalanceMC ?? 0) * tokenPriceUSD,
      earningPerDay,
      earningPerDayUSD: earningPerDay * Number(cakePrice) / 1e18,
    }
  })
}

// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const pools = useSelector((state: State) => state.pools.data)
  return pools
}

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return pool
}

// Prices

export const usePriceBnbBusd = (): BigNumber => {
  const pid = 3 // BUSD-BNB LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceCakeBusd = (): BigNumber => {
  // const pid = 2 // SISHI-BNB LP
  // const bnbPriceUSD = usePriceBnbBusd()
  // const farm = useFarmFromPid(pid)
  // return farm.tokenPriceVsQuote ? bnbPriceUSD.times(farm.tokenPriceVsQuote) : ZERO
  const pid = 1 // SISHI-BUSD LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const useTotalValue = (): BigNumber => {
  const farms = useFarms()
  const bnbPrice = usePriceBnbBusd()
  const cakePrice = usePriceCakeBusd()
  let value = new BigNumber(0)
  for (let i = 0; i < farms.length; i++) {
    const farm = farms[i]
    if (farm.lpTotalInQuoteToken) {
      let val
      if (farm.quoteTokenSymbol === QuoteToken.BNB) {
        val = bnbPrice.times(farm.lpTotalInQuoteToken)
      } else if (farm.quoteTokenSymbol === QuoteToken.SISHI) {
        val = cakePrice.times(farm.lpTotalInQuoteToken)
      } else {
        val = farm.lpTotalInQuoteToken
      }
      value = value.plus(val)
    }
  }
  return value
}
