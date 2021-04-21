import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  if (balance instanceof BigNumber) {
    const displayBalance = new BigNumber(balance).dividedBy(10 ** decimals)
    const value = displayBalance.toNumber()

    return Number.isFinite(value) ? value : 0
  }


  return Number.isFinite(balance) ? Number(balance) / (10 ** decimals) : 0

}



export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
  if (balance instanceof BigNumber) {
    return balance.dividedBy(10 ** decimals).toFixed()
  }
  return (Number(balance) / (10 ** decimals)).toFixed()
}


export const prettyNumberByPostfix = (e: number | string) => {
  const num = Number(e)

  if (num > 1000000)
    return `${(num / 1000000).toPrecision(3)}m`
  if (num > 1000)
    return `${(num / 1000).toPrecision(3)}k`
  if (num > 1)
    return num.toPrecision(3)
  return num.toFixed(2)
}