import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { getMasterChefAddress } from 'utils/addressHelpers'
import farmsConfig from 'config/constants/farms'
import callMethodWithPool from 'utils/pools'
import { QuoteToken } from '../../config/constants/types'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

const fetchFarms = async () => {
  const data = await Promise.all(
    farmsConfig.map(async (farmConfig) => {
      const lpAdress = farmConfig.lpAddresses[CHAIN_ID]

      const [
        tokenBalanceLP,
        quoteTokenBlanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals,
      ] = await Promise.all([

        // Balance of token in the LP contract
        callMethodWithPool(farmConfig.tokenAddresses[CHAIN_ID], erc20, 'balanceOf', [lpAdress]),

        // Balance of quote token on LP contract
        callMethodWithPool(farmConfig.quoteTokenAdresses[CHAIN_ID], erc20, 'balanceOf', [lpAdress]),

        // Balance of LP tokens in the master chef contract
        callMethodWithPool(farmConfig.isTokenOnly ? farmConfig.tokenAddresses[CHAIN_ID] : lpAdress, erc20, 'balanceOf', [getMasterChefAddress()]),

        // Total supply of LP tokens
        callMethodWithPool(lpAdress, erc20, 'totalSupply', []),

        // Token decimals
        callMethodWithPool(farmConfig.tokenAddresses[CHAIN_ID], erc20, 'decimals', []),

        // Quote token decimals
        callMethodWithPool(farmConfig.quoteTokenAdresses[CHAIN_ID], erc20, 'decimals', []),
      ])

      let tokenAmount
      let lpTotalInQuoteToken
      let tokenPriceVsQuote
      if (farmConfig.isTokenOnly) {
        tokenAmount = new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(tokenDecimals))
        if (farmConfig.tokenSymbol === QuoteToken.BUSD && farmConfig.quoteTokenSymbol === QuoteToken.BUSD) {
          tokenPriceVsQuote = new BigNumber(1)
        } else {
          tokenPriceVsQuote = new BigNumber(quoteTokenBlanceLP)
            .div(new BigNumber(tokenBalanceLP))
            .div(new BigNumber(10).pow(18 - tokenDecimals))
        }
        lpTotalInQuoteToken = tokenAmount.times(tokenPriceVsQuote)


      } else {
        // Ratio in % a LP tokens that are in staking, vs the total number in circulation
        const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

        // Total value in staking in quote token value
        lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
          .div(new BigNumber(10).pow(18))
          .times(new BigNumber(2))
          .times(lpTokenRatio)

        // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
        tokenAmount = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatio)
        const quoteTokenAmount = new BigNumber(quoteTokenBlanceLP)
          .div(new BigNumber(10).pow(quoteTokenDecimals))
          .times(lpTokenRatio)

        if (tokenAmount.comparedTo(0) > 0) {
          tokenPriceVsQuote = quoteTokenAmount.div(tokenAmount)
        } else {
          tokenPriceVsQuote = new BigNumber(quoteTokenBlanceLP).div(new BigNumber(tokenBalanceLP))
        }
      }

      const [info, totalAllocPoint, eggPerBlock] = await Promise.all([
        callMethodWithPool(getMasterChefAddress(), masterchefABI, 'poolInfo', [farmConfig.pid]),
        callMethodWithPool(getMasterChefAddress(), masterchefABI, 'totalAllocPoint', []),
        callMethodWithPool(getMasterChefAddress(), masterchefABI, 'sishiPerBlock', []),
      ])

      const allocPoint = new BigNumber(info.allocPoint._hex)
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))
      const priceInQuoteToken = (!farmConfig.isTokenOnly && lpTotalSupply && lpTotalInQuoteToken)
        ? new BigNumber(quoteTokenBlanceLP)
          .multipliedBy(2)
          .div(new BigNumber(lpTotalSupply))
        : tokenPriceVsQuote

      return {
        ...farmConfig,
        tokenAmount: tokenAmount.toJSON(),
        // quoteTokenAmount: quoteTokenAmount,
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
        lpTokenBalanceMC: new BigNumber(lpTokenBalanceMC).toJSON(),
        priceInQuoteToken: priceInQuoteToken.toJSON(),
        lpTotalQuote: new BigNumber(quoteTokenBlanceLP).dividedBy(1e18).toJSON(),
        lpTotalSupply: new BigNumber(lpTotalSupply).dividedBy(1e18).toJSON(),
        poolWeight: poolWeight.toNumber(),
        multiplier: `${allocPoint.div(100).toString()}X`,
        depositFeeBP: info.depositFeeBP,
        eggPerBlock: new BigNumber(eggPerBlock).toNumber(),
        eggPerBlockMultiplier: new BigNumber(eggPerBlock).multipliedBy(poolWeight).toNumber(),
      }
    }),
  )
  return data
}

export default fetchFarms
