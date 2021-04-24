import React from 'react'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js/bignumber'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import useI18n from 'hooks/useI18n'
import { getCakeAddress } from 'utils/addressHelpers'
import Countdown from "react-countdown";
import CardValue from './CardValue'
import { useFarms, usePriceCakeBusd, useTotalValue } from '../../../state/hooks'




const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const StatSection = styled.div`
  align-items: center;
  flex: 1;
  border-right: solid #8888 1px; 
  padding: 0 1em;
  text-align: center;
  &:last-child{
    border-right: none; 
  }
`

const HeadRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`

const CountdownRender: React.FC<{
  total: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number,
  completed: boolean,
}> = ({ days, hours, minutes, seconds, completed }) => {
  const _1 = days > 0
  const _2 = hours > 0
  const _3 = minutes > 0
  const _4 = seconds > 0

  return <>
    { _1 && <> {days} day{days > 1 ? "s" : ""} </>}
    { (_1 || _2) && <> {String(hours).padStart(2, "0")} hour{hours > 1 ? "s" : ""} </>}
    { (!_1 && (_2 || _3)) && <> {String(minutes).padStart(2, "0")} minute{minutes > 1 ? "s" : ""} </>}
    { (!_1 && !_2 && (_3 || _4)) && <> {String(seconds).padStart(2, "0")} second{seconds > 1 ? "s" : ""} </>}
  </>
}

const SishiProducts = () => {
  const totalSupply = useTotalSupply()
  const burnedBalance = useBurnedBalance(getCakeAddress())
  const farms = useFarms()
  const eggPrice = usePriceCakeBusd()
  const circSupply = totalSupply ? totalSupply.minus(burnedBalance) : new BigNumber(0)
  const cakeSupply = getBalanceNumber(circSupply)
  const marketCap = eggPrice.times(circSupply)
  const totalValue = useTotalValue()

  let eggPerBlock = 0
  if (farms && farms[0] && farms[0].eggPerBlock) {
    eggPerBlock = new BigNumber(farms[0].eggPerBlock).div(new BigNumber(10).pow(18)).toNumber()
  }

  return (
    <div>
      <br />
      <Row>
        <StatSection>
          <Heading as="h2" size="md" color="primary" style={{ textAlign: 'center' }}>
            TVL
          </Heading>
          <CardValue fontSize="1.3em" value={totalValue.toNumber()} decimals={0} prefix="$" />

        </StatSection>
        <StatSection>
          <Heading as="h2" size="md" color="primary" style={{ textAlign: 'center' }}>
            SISHI Price
          </Heading>
          <CardValue fontSize="1.3em" value={eggPrice.toNumber()} decimals={3} prefix="$" />

        </StatSection>

        <StatSection>
          <Heading as="h2" size="md" color="primary" style={{ textAlign: 'center' }}>
            Market Cap
          </Heading>
          <CardValue fontSize="1.3em" value={getBalanceNumber(marketCap)} decimals={0} prefix="$" />

        </StatSection>
      </Row>
      <br />
      <br />
      <Row>
        <StatSection>
          <Heading as="h2" size="md" color="primary" style={{ textAlign: 'center' }}>
            Total Minted
          </Heading>
          <CardValue fontSize="1.3em" value={getBalanceNumber(totalSupply)} decimals={0} />

        </StatSection>
        <StatSection>
          <Heading as="h2" size="md" color="primary" style={{ textAlign: 'center' }}>
            Circulating Supply
          </Heading>
          <CardValue fontSize="1.3em" value={cakeSupply} decimals={0} />
        </StatSection>
        <StatSection>
          <Heading as="h2" size="md" color="primary" style={{ textAlign: 'center' }}>
            Burned
          </Heading>
          <CardValue fontSize="1.3em" value={getBalanceNumber(burnedBalance)} decimals={0} />
        </StatSection>
      </Row>
      <br />
      <br />
      <Row>
        <StatSection>
          <Heading as="h2" size="md" color="primary" style={{ textAlign: 'center' }}>
            New SISHI/block
          </Heading>
          <Text style={{ fontSize: "1.3em", fontWeight: "bold" }}>{eggPerBlock}</Text>
        </StatSection>
        <StatSection>
          <Heading as="h2" size="md" color="primary" style={{ textAlign: 'center' }}>
            Halving In
          </Heading>
          <Text style={{ fontSize: "1.3em", fontWeight: "bold" }}>

            {/* <Countdown date={Date.parse('4/24/2021, 4:00:00 PM GMT+7')} renderer={CountdownRender} /> */}
            <Countdown date={Date.parse('6/13/2021, 10:00:00 AM GMT+7')} renderer={CountdownRender} />
          </Text>

        </StatSection>


      </Row>


    </div>
  )
}

export default SishiProducts
