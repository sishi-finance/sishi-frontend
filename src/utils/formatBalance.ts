import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  if (balance instanceof BigNumber) {
    const displayBalance = new BigNumber(balance).dividedBy(10 ** decimals)
    const value = displayBalance.toNumber()

    return Number.isFinite(value) ? value : 0
  }
  
  return Number(balance) / (10 ** decimals)

}



export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
  if (balance instanceof BigNumber) {
    return balance.dividedBy(10 ** decimals).toFixed()
  }
  return (Number(balance) / (10 ** decimals)).toFixed()
}
