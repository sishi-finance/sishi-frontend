import React, { useEffect, useCallback, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { Image, Heading } from '@pancakeswap-libs/uikit'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useFarms, usePriceBnbBusd, usePriceCakeBusd } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { QuoteToken } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import StyledCountdown from 'components/Countdown'
import CountdownUpdateTimelock from 'components/CountdownUpdateTimelock'
import styled from 'styled-components'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import FarmTabButtons from './components/FarmTabButtons'
// import Divider from './components/Divider'
import FarmStats from './components/FarmCard/FarmStats'

export interface FarmsProps {
  tokenMode?: boolean
}

const TableContainer = styled.div`
  width: 100%;
  max-width: calc(100vw - 2em);
  overflow: auto;
  text-align: left;
`

const Fieldset = styled.fieldset`
  display: block;
  margin-inline-start: 2px;
  margin-inline-end: 2px;
  padding-block-start: 0.35em;
  padding-inline-start: 0.75em;
  padding-inline-end: 0.75em;
  padding-block-end: 0.625em;
  min-inline-size: min-content;
  border-width: 2px;
  border-style: groove;
  border-color: ${({ theme }) => theme.colors.borderColor};
  border-image: initial;
  legend {
    text-align: center;
    padding: 0.5em;
    border-color: ${({ theme }) => theme.colors.borderColor};
    font-size: 18px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: bold;
  }
`

const Table = styled.table`
  width: 100%;
  vertical-align: middle;
  line-height: 1.7;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  // background: ${(props) => props.theme.card.background};

  td, th {
    padding: 10px 5px;
    vertical-align: middle;
    white-space: nowrap;
  }
`

const Farms: React.FC<FarmsProps> = (farmsProps) => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()
  const farmsLP = useFarms()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  // const { tokenMode } = farmsProps

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const [stakedOnly, setStakedOnly] = useState(false)

  const activeFarms = farmsLP.filter((farm) => farm.multiplier !== '0X')
  const inactiveFarms = farmsLP.filter((farm) => farm.multiplier === '0X')
  // const activeFarms = farmsLP.filter((farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier !== '0X')
  // const inactiveFarms = farmsLP.filter((farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier === '0X')

  const stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      // const cakePriceVsBNB = new BigNumber(farmsLP.find((farm) => farm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote || 0)
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        // if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
        //   return farm
        // }
        const cakeRewardPerBlock = new BigNumber(farm.eggPerBlock || 1)
          .times(new BigNumber(farm.poolWeight))
          .div(new BigNumber(10).pow(18))
        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

        let apy = cakePrice.times(cakeRewardPerYear)

        let totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0)

        if (farm.quoteTokenSymbol === QuoteToken.BNB) {
          totalValue = totalValue.times(bnbPrice)
        }

        if (totalValue.comparedTo(0) > 0) {
          apy = apy.div(totalValue)
        }

        return { ...farm, apy }
      })
      return farmsToDisplayWithAPY.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          removed={removed}
          bnbPrice={bnbPrice}
          cakePrice={cakePrice}
          ethereum={ethereum}
          account={account}
        />
      ))
    },
    [bnbPrice, account, cakePrice, ethereum],
  )

  return (
    <Page>
      <Heading as="h1" size="lg" color="primary" mb="50px" style={{ textAlign: 'center' }}>
        Stake tokens/LP tokens to earn SISHI
      </Heading>
      <Fieldset>
        <legend>
          Yield Portfolio
        </legend>
        <FarmStats account={account} ethereum={ethereum} />
      </Fieldset>
      <br />
      <br />

      <Fieldset>
        <legend>
          Sishi Pools
        </legend>
        <TableContainer>

          <Table>
            <thead>
              <tr>
                <th> </th>
                <th> Deposit Fee </th>
                {/* <th> Daily</th> */}
                <th> APY </th>
                <th> TVL</th>
                {/* <th> Staked</th> */}
                <th> Balance</th>
                {/* <th> </th> */}
              </tr>
            </thead>
            <tbody>
              <Route exact path={`${path}`}>
                {stakedOnly ? farmsList(stakedOnlyFarms, false) : farmsList(activeFarms, false)}
              </Route>
              <Route exact path={`${path}/history`}>
                {farmsList(inactiveFarms, true)}
              </Route>
            </tbody>
          </Table>
        </TableContainer>
      </Fieldset>
      {/* <FarmTabButtons stakedOnly={stakedOnly} setStakedOnly={setStakedOnly} /> */}
      <div>
        {/* <Divider /> */}

      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <StyledCountdown />
      <CountdownUpdateTimelock />

      <Heading as="h2" color="secondary" mb="50px" style={{ textAlign: 'center' }}>
        {TranslateString(10000, 'Deposit Fee will be used to yield optimization and  buyback SISHI')}
      </Heading>
      {/* <Image src="/images/egg/8.png" alt="illustration" width={1352} height={587} responsive /> */}
    </Page >
  )
}

export default Farms
