import addresses from 'config/constants/contracts'
import { MasterChefVaultAddress } from 'config/constants/vaults'

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
export const getVaultControllerAddress = () => {
  return MasterChefVaultAddress
}
export const getVaultMasterChefAddress = () => {
  return MasterChefVaultAddress
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
export const getControllerAddress = () => {
  return addresses.vaultController[chainId]
}
export const getLotteryTicketAddress = () => {
  return addresses.lotteryNFT[chainId]
}
