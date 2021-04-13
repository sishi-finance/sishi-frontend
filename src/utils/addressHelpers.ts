import addresses from 'config/constants/contracts'
import vaults from 'config/constants/vaults'

const chainId = process.env.REACT_APP_CHAIN_ID
const notFound = () => {
  throw new Error("Not Found")
}
export const getCakeAddress = () => {
  return addresses.sishi[chainId]
}
export const getMasterChefAddress = () => {
  return addresses.masterChef[chainId]
}
export const getMulticallAddress = () => {
  return addresses.mulltiCall[chainId]
}
export const getWbnbAddress = () => {
  return addresses.wbnb[chainId]
}
export const getLotteryAddress = () => {
  return addresses.lottery[chainId]
}
export const getLotteryTicketAddress = () => {
  return addresses.lotteryNFT[chainId]
}
export const getVaultAddress = (token: string) => {
  return vaults[token]?.vault ?? notFound()
}
export const getStrategyAddress = (token: string) => {
  return vaults[token]?.strategy ?? notFound()
}
