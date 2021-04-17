import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  const displayBalance = new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals))
  const value = displayBalance.toNumber()

  return Number.isFinite(value) ? value : 0
}



export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
  return balance.dividedBy(new BigNumber(10).pow(decimals)).toFixed()
}

