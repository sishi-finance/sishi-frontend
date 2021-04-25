import React, { useCallback, useMemo, useState } from 'react'
import { provider } from 'web3-core'
import { useFarmsUser, useFarmUser, usePriceCakeBusd } from 'state/hooks'
import { Pie } from 'react-chartjs-2';
import styled from 'styled-components';
import { Button, ButtonProps, Heading, Text, } from '@pancakeswap-libs/uikit';
import { getBalanceNumber, prettyNumberByPostfix } from 'utils/formatBalance';
import CardValue from 'views/Home/components/CardValue';
import useStake from 'hooks/useStake'
import { useAllHarvest } from 'hooks/useHarvest';
import { StakeActionWithPid } from './StakeAction';


const Row = styled.div`
  align-items: center;
  align-items: stretch;
  display: flex;
  padding: 1em;

`

const HeadRow = styled.div`
  align-items: center;
  display: flex;
  // justify-content: space-between;
  margin-bottom: 8px;
`

const PortfolioSection = styled.div`
  align-items: center;
  flex: 1;
  border-right: solid #8888 1px; 
  padding: 0 1em;
  &:last-child{
    border-right: none; 
  }
`


const Table = styled('table')`
  width 100%;
  color: ${({ theme }) => theme.colors.text};
  th, td {
    padding 0.5em 0.3em;
    text-align left;
    white-space nowrap;
    font-family monospace;
    font-weight bold;
  }

  th, td {
    &:first-child,&:nth-child(2)  {
      text-align left;
    }
  }
  .highlight {
    // background-color: ${({ theme }) => theme.colors.backgroundDisabled};
    color: ${({ theme }) => theme.colors.primary};
  }
  thead {
    tr {
      background-color: ${({ theme }) => theme.colors.background};
      border-bottom: solid 1px ${({ theme }) => theme.colors.borderColor};
      th {
      }
    }
  }
  tbody {
    tr {
      border-bottom: solid 1px ${({ theme }) => theme.colors.borderColor};
      td {


      }
    }
    tr:nth-child(2n){
      background-color: ${({ theme }) => theme.colors.background};
    }


  }
`


interface StatCardProps {
  ethereum?: provider
  account?: string
}



const PALETTE = [
  "#003f5c",
  "#2f4b7c",
  "#665191",
  "#a05195",
  "#d45087",
  "#f95d6a",
  "#ff7c43",
  "#ffa600",
].reverse()


const CompoundButton: React.FC<{ pid, earnedBalance, tokenDecimal } & ButtonProps> = ({ pid, earnedBalance, tokenDecimal, children, ...rest }) => {
  const { onStake } = useStake(pid)
  const [requestedHarvest, setRequestedHarvest] = useState(false)
  const rawEarnedBalance = getBalanceNumber(earnedBalance, tokenDecimal)

  const onHarvest = useCallback(async () => {
    try {
      setRequestedHarvest(true)
      await onStake(rawEarnedBalance.toString())
    } catch (e) {
      console.error(e)
    } finally {
      setRequestedHarvest(false)
    }
  }, [onStake, rawEarnedBalance, setRequestedHarvest])

  return <Button {...rest} disabled={requestedHarvest} onClick={onHarvest}>{children}</Button>
}

const HarvestButton: React.FC<{ pid } & ButtonProps> = ({ pid, children, ...rest }) => {
  const { onStake } = useStake(pid)
  const [requestedHarvest, setRequestedHarvest] = useState(false)

  const onHarvest = useCallback(async () => {
    try {
      setRequestedHarvest(true)
      await onStake("0")
    } catch (e) {
      console.error(e)
    } finally {
      setRequestedHarvest(false)
    }
  }, [onStake, setRequestedHarvest])

  return <Button {...rest} disabled={requestedHarvest} onClick={onHarvest}>{children}</Button>
}

const HarvestAllButton: React.FC<{ pids: number[] } & ButtonProps> = ({ pids, children, ...rest }) => {
  const { onReward } = useAllHarvest(pids)
  const [requestedHarvest, setRequestedHarvest] = useState(false)

  const onHarvest = useCallback(async () => {
    try {
      setRequestedHarvest(true)
      await onReward()
    } catch (e) {
      console.error(e)
    } finally {
      setRequestedHarvest(false)
    }
  }, [onReward, setRequestedHarvest])

  return <Button {...rest} disabled={requestedHarvest} onClick={onHarvest}>{children}</Button>
}

const FarmStats: React.FC<StatCardProps> = ({ ethereum, account }) => {

  const farms = useFarmsUser()

  const sishiPriceUSD = usePriceCakeBusd()

  const filteredFarms = farms.filter(e => Number(e.stakedBalance) > 0 || e.tokenSymbol === "SISHI")
    .map(e => ({
      ...e,
      stakedBalance: e.stakedBalance.multipliedBy((10 ** (18 - (e.isTokenOnly ? e.tokenDecimal : 18)))),
      tokenBalanceUSD: e.tokenBalanceUSD / 1e18,
      stakedBalanceUSD: e.stakedBalanceUSD / 1e18,
      balanceDecimal: e.isTokenOnly ? e.tokenDecimal : 18,
      lpTotalInUSD: e.lpTotalInUSD * (10 ** (18 - (e.isTokenOnly ? e.tokenDecimal : 18))) / 1e18,
    }))
    .filter(e => e.stakedBalanceUSD > 0.00001 || e.tokenSymbol === "SISHI")
    .sort((e, f) => f.stakedBalanceUSD - e.stakedBalanceUSD)



  const totalStackedUSDT = filteredFarms.map(e => e.stakedBalanceUSD ?? 0).reduce((e, f) => e + f, 0)
  const totalEarned = filteredFarms.map(e => e.earnings ? Number(e.earnings) : 0).reduce((e, f) => e + f, 0) / 1e18
  const totalEarnedUSD = Number(sishiPriceUSD) * totalEarned
  const pids = filteredFarms
    .filter(e => Number(e.earnings) / 1e18 > 0.0005)
    .map(e => e.pid)
  console.log("[totalUSDT]", (totalStackedUSDT).toFixed(2))
  console.log("[totalEarning]", (totalEarned).toFixed(3))

  // console.table(filteredFarms, ["tokenBalanceUSD", "stakedBalanceUSD", "tokenDecimal"])


  const pieData = {
    labels: filteredFarms.map(e => e.isTokenOnly ? e.tokenSymbol : e.lpSymbol),
    datasets: [
      {
        label: '% of staked',
        data: filteredFarms.map(e => (e.stakedBalanceUSD ?? 0) + 1e-18),
        backgroundColor: filteredFarms.map((e, i) => PALETTE[i % PALETTE.length]),
        borderWidth: 1,
      },
    ],
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    animations: false,
    aspectRatio: 2,
    layout: {
      padding: 10,
    },
    plugins: {
      legend: {
        position: 'right',
      },
    }
  }

  console.dir(pieData, { depth: 10 })

  return <>
    <Row>
      <PortfolioSection>
        <Heading as="h1" size="md" color="primary" style={{ textAlign: 'left' }}>
          Balance
        </Heading>
        <Heading size="lg" mb="24px" >
          <HeadRow>
            <span>$</span>
            <CardValue fontSize="1.3em" value={totalStackedUSDT} decimals={2} />
          </HeadRow>
        </Heading>
      </PortfolioSection>

      <PortfolioSection>
        <Heading as="h1" size="md" color="primary" style={{ textAlign: 'left' }}>
          Total SISHI Earned
        </Heading>
        <Heading size="lg" >
          <CardValue fontSize="1.3em" value={totalEarned} decimals={3} />
        </Heading>
        <Text>~ ${prettyNumberByPostfix(totalEarnedUSD)}</Text>
        <br />
        <HarvestAllButton size="sm" pids={pids}>Harvest All</HarvestAllButton>
      </PortfolioSection>
      <PortfolioSection>
        {/* <Heading as="h1" size="lg" color="primary" style={{ textAlign: 'left' }}>
          Sishi to harvest
        </Heading> */}
        <Pie data={pieData} type="pie" options={pieOptions} height={5} />
      </PortfolioSection>
    </Row>
    <Row>
      <PortfolioSection>
        {/* <Heading as="h1" size="lg" color="primary" style={{ textAlign: 'left' }}>
          Positions
        </Heading> */}
        <Table>
          <thead>
            <tr>
              <th>#	</th>
              <th>Asset	</th>
              <th>Share	</th>
              <th>Price	</th>
              <th>Total	</th>
              {/* <th>Total Pool	</th> */}
              <th>Pool Share	</th>
              <th>Earned</th>
              <th style={{textAlign:"right"}}>   </th>
            </tr>
          </thead>
          <tbody>
            {
              filteredFarms.map((farm, index) => <tr>
                <th>{index + 1}</th>
                <th>{farm.isTokenOnly ? farm.tokenSymbol : farm.lpSymbol}	</th>
                <th>{(Number(farm.stakedBalance) / 1e18).toFixed(4)}</th>
                <th>${(Number(farm.tokenPriceUSD)).toFixed(2)}</th>
                <th>${prettyNumberByPostfix(farm.stakedBalanceUSD)}	</th>
                {/* <th>${prettyNumberByPostfix(farm.lpTotalInUSD)}	</th> */}
                <th>{(100 * farm.stakedBalanceUSD / farm.lpTotalInUSD).toFixed(2)}%</th>
                {/* <th>{(farm.earningPerDay / 1e18).toFixed(4)} SISHI/Day</th> */}
                <th>{(Number(farm.earnings) / 1e18).toFixed(3)}</th>
                <th style={{textAlign:"left"}}>
                  <StakeActionWithPid pid={farm.pid} />
                  {/* <HarvestButton size="sm" pid={farm.pid}>Harvest</HarvestButton> */}

                  {/* {
                    farm.isTokenOnly && farm.tokenSymbol === "SISHI" 
                      && <CompoundButton size="sm" pid={farm.pid} earnedBalance={farm.earnings} tokenDecimal={farm.tokenDecimal} ml="2">Compound</CompoundButton>
                  } */}
                  
                </th>
              </tr>)
            }
          </tbody>
        </Table>
      </PortfolioSection>
    </Row>

  </>
}

export default FarmStats
