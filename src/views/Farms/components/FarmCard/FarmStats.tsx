import React, { useMemo, useState } from 'react'
import { provider } from 'web3-core'
import { useFarmsUser, useFarmUser } from 'state/hooks'
import { Pie } from 'react-chartjs-2';




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

const FarmStats: React.FC<StatCardProps> = ({ ethereum, account }) => {

  const farms = useFarmsUser()

  const filteredFarms = farms.filter(e => Number(e.stakedBalance) > 0)
    .map(e => ({
      ...e,
      tokenBalanceUSD: e.tokenBalanceUSD / 1e18,
      stakedBalanceUSD: e.stakedBalanceUSD / 1e18,
      balanceDecimal: e.isTokenOnly ? e.tokenDecimal : 18,
    }))
    .sort((e, f) => f.stakedBalanceUSD - e.stakedBalanceUSD)

  const totalStackedUSDT = filteredFarms.map(e => e.stakedBalanceUSD ?? 0).reduce((e, f) => e + f, 0)

  console.log("[totalUSDT]", (totalStackedUSDT).toFixed(2))

  console.table(filteredFarms, ["tokenBalanceUSD", "stakedBalanceUSD", "tokenDecimal"])


  const pieData = {
    labels: filteredFarms.map(e => e.isTokenOnly ? e.tokenSymbol : e.lpSymbol),
    datasets: [
      {
        label: '% of staked',
        data: filteredFarms.map(e => e.stakedBalanceUSD ?? 0),
        backgroundColor: filteredFarms.map((e,i) => PALETTE[i % PALETTE.length]),
        borderWidth: 1,
      },
    ],
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    animations: false,
    aspectRatio: 3,
    layout: {
      padding: 10,
    },
    plugins: {
      legend: {
        position: 'right',
      },
    }
  }


  return <Pie data={pieData} type="pie" options={pieOptions} height={10} />
}

export default FarmStats
