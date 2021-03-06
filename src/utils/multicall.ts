import { AbiItem } from 'web3-utils'
import { Interface } from '@ethersproject/abi'
import { getWeb3, getWeb3Archive } from 'utils/web3'
import MultiCallAbi from 'config/abi/Multicall.json'
import { getMulticallAddress } from 'utils/addressHelpers'

interface Call {
  address: string // Address of the contract
  name: string // Function name on the contract (exemple: balanceOf)
  params?: any[] // Function params
}

const multicall = async (abi: any[], calls: Call[], ...callOptions) => {
  const web3 = getWeb3()
  const multi = new web3.eth.Contract((MultiCallAbi as unknown) as AbiItem, getMulticallAddress())
  const itf = new Interface(abi)

  const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
  const { returnData, blockNumber } = await multi.methods.aggregate(calldata).call(...callOptions)
  const res = returnData.map((call, i) => {
    try {
      return itf.decodeFunctionResult(calls[i].name, call)
    } catch (error) {
      console.error(calls[i].name, call)
      return new Error(String(error))
    }
  })
  return res
}

const multicallWithArchive = async (abi: any[], calls: Call[], ...callOptions) => {
  const web3 = getWeb3Archive()
  const multi = new web3.eth.Contract((MultiCallAbi as unknown) as AbiItem, getMulticallAddress())
  const itf = new Interface(abi)

  const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
  const { returnData, blockNumber } = await multi.methods.aggregate(calldata).call(...callOptions)
  const res = returnData.map((call, i) => {
    try {
      return itf.decodeFunctionResult(calls[i].name, call)
    } catch (error) {
      console.error(calls[i].name, call)
      return new Error(String(error))
    }
  })
  return res
}

export default multicall
export { multicallWithArchive }

