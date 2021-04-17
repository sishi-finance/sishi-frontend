import { useCallback, useEffect, useMemo, useState } from 'react'
import { BLOCKS_PER_DAY, BLOCKS_PER_HOUR } from 'config'
import BigNumber from 'bignumber.js/bignumber'
import { MasterChefVaultAddress, Vault, vaultLists, VaultWithData } from 'config/constants/vaults'
import { provider, } from 'web3-core'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import callMethodWithPool, { callMethodWithPoolFactory } from 'utils/pools'
import masterChef from 'config/abi/masterchef.json'
import { getMasterChefAddress, getVaultMasterChefAddress } from 'utils/addressHelpers'
import contracts from 'config/constants/contracts'
import erc20 from 'config/abi/erc20.json'
import sishivault from 'config/abi/sishivault.json'
import { QuoteToken } from 'config/constants/types'
import { useERC20ABI, useStrategy, } from './useContract'


export const fetchPancakeRate = async ({ baseAddress, lpAdress, quoteAddress }) => {
  const erc20ABI = <any>erc20
  const [
    tokenBalanceLP,
    quoteTokenBlanceLP,
    tokenDecimals,
    quoteTokenDecimals,
  ] = await Promise.all([

    // Balance of token in the LP contract
    callMethodWithPool(baseAddress, erc20ABI, 'balanceOf', [lpAdress]),

    // Balance of quote token on LP contract
    callMethodWithPool(quoteAddress, erc20ABI, 'balanceOf', [lpAdress]),

    // Token decimals   
    callMethodWithPool(baseAddress, erc20ABI, 'decimals', []),

    // Quote token decimals
    callMethodWithPool(quoteAddress, erc20ABI, 'decimals', []),

  ])

  // console.log(
  //   { baseAddress, lpAdress, quoteAddress },
  //   "quoteTokenBlanceLP", String(quoteTokenBlanceLP),
  //   "tokenDecimals", String(tokenDecimals),
  //   "tokenBalanceLP", String(tokenBalanceLP),
  //   "quoteTokenDecimals", String(quoteTokenDecimals),
  // )
  return new BigNumber(quoteTokenBlanceLP)
    .multipliedBy(10 ** tokenDecimals)
    .multipliedBy(1e18)
    .div(new BigNumber(tokenBalanceLP))
    .dividedBy(10 ** quoteTokenDecimals)
}

export const useLPRate = ({ baseAddress = "", lpAdress = "", quoteAddress = "" } = {}) => {

  const [rate, setRate] = useState(new BigNumber(0))

  useEffect(() => {

    if (baseAddress && lpAdress && quoteAddress)
      fetchPancakeRate({ baseAddress, lpAdress, quoteAddress })
        .then(r => setRate(r))
    else {
      console.log({ baseAddress, lpAdress, quoteAddress })
      setRate(new BigNumber(1e18))
    }
  }, [baseAddress, lpAdress, quoteAddress])

  // /  console.log("useLPRate", Number(rate))

  return rate
}

export const useYSISHIPrice = () => {
  const ySushiRate = useLPRate({ baseAddress: "0x8abed819ab4fbb9e488d0d1687c93075b73b3db1", lpAdress: "0x6283541b4c79d9a48d258d1c0b788d3f99da5588", quoteAddress: contracts.busd[56] })
  return ySushiRate
}


export const useVaultHarvestReward = (vault: Vault, account: string) => {
  const strategyContract = useStrategy(vault)
  const [reloadToken, reload] = useState(0)
  const [strategyResult, setStrategyResult] = useState(null)
  // const [strategyRewardToken, setStrategyToken] = useState('')
  // const erc20ABI =  useERC20ABI()

  useEffect(() => {
    if (account) {
      String(reloadToken);
      strategyContract.methods
        .harvest()
        .call({ from: account })
        .then(result => setStrategyResult(result))
    }

  }, [vault.strategy, strategyContract, setStrategyResult, account, reloadToken])

  return {
    reward: Number((Number(strategyResult) / (1e18)).toFixed(8)),
    // rewardToken: strategyRewardToken,
    reloadToken: () => reload(Math.random())
  }
}


export const useVaults = () => {
  return vaultLists
}



export const fetchVaultsAPY = async (vaults: Vault[], { currentBlock, bnbBusdRate }: { currentBlock: number, bnbBusdRate: BigNumber }) => {

  const deltaBlock = Number(BLOCKS_PER_HOUR) * 48

  const allVaultsAPY = await Promise.all(vaults.map(async vault => {

    const prevBlock = Math.max(vault.fromBlock + 100, currentBlock - deltaBlock)
    const callMethodWithAgoPool = callMethodWithPoolFactory(prevBlock)

    const [
      rawVaultTVL,
      rawPricePerFullShare,
      rawPricePerFullShareAgo,
      rawTokenQuoteRate,
    ] = await Promise.all([
      callMethodWithPool(vault.vault, <any>sishivault, "balance", []),
      callMethodWithPool(vault.vault, <any>sishivault, "getPricePerFullShare", []),
      callMethodWithAgoPool(vault.vault, <any>sishivault, "getPricePerFullShare", []),
      vault.lpToken ? fetchPancakeRate({
        baseAddress: vault.tokenAddress,
        lpAdress: vault.lpToken.address,
        quoteAddress: vault.lpToken.quoteAddress
      }) : Promise.resolve(new BigNumber(1e18))
    ])

    const vaultTVL = new BigNumber(rawVaultTVL)
    const pricePerFullShare = new BigNumber(rawPricePerFullShare)
    const pricePerFullShareAgo = new BigNumber(rawPricePerFullShareAgo)
    const tokenQuoteRate = new BigNumber(rawTokenQuoteRate)

    const tokenBUSDRate = vault?.lpToken?.quote === QuoteToken.BNB
      ? tokenQuoteRate.multipliedBy(bnbBusdRate)
      : tokenQuoteRate

    const roiDay = pricePerFullShare
      .div(pricePerFullShareAgo)
      .minus(new BigNumber(1))
      .multipliedBy(BLOCKS_PER_DAY)
      .dividedBy(deltaBlock)

    const roiHour = roiDay.dividedBy(24)
    const roiWeek = roiDay.plus(1).exponentiatedBy(7).minus(1)
    const roiMonth = roiDay.plus(1).exponentiatedBy(30).minus(1)
    const roiYear = roiDay.plus(1).exponentiatedBy(365).minus(1)

    return {
      roiLoaded: true,
      tokenBUSDRate,
      pricePerFullShare,
      calc: {
        roiHour: Number((roiHour).toFixed(10)),
        roiDay: Number((roiDay).toFixed(10)),
        roiWeek: Number((roiWeek).toFixed(10)),
        roiMonth: Number((roiMonth).toFixed(10)),
        roiYear: Number((roiYear).toFixed(10)),
        apy: Number((roiYear).toFixed(10)),
        apr: Number((roiDay.multipliedBy(365))),
        tvl: Number(vaultTVL.toFixed(10)),
      },
    }
  }))

  return allVaultsAPY
}

export const fetchVaultUsers = async (vaults: Vault[], account: string) => {

  const allVaultsUser = await Promise.all(vaults.map(async vault => {
    const [
      vaultShare,
      tokenBalance,
      vaultAllowance,
    ] = await Promise.all([
      callMethodWithPool(vault.vault, <any>sishivault, "balanceOf", [account]),
      callMethodWithPool(vault.tokenAddress, <any>erc20, "balanceOf", [account]),
      callMethodWithPool(vault.tokenAddress, <any>erc20, "allowance", [account, vault.vault])
    ])

    return {
      calc: {
        share: new BigNumber(vaultShare),
        walletBalance: new BigNumber(tokenBalance),
        vaultApproved: Number(vaultAllowance) / (10 ** 18) >= 100000000,
      },
    }
  }))


  return allVaultsUser
}

export const fetchVaultFarms = async (vaults: Vault[]) => {
  const allVaultFarmsShare = await Promise.all(vaults.map(async vault => {



    const [mulTotal, [, mulCurrent, ,], rawSharePerBlock, rawTotalShare] = await Promise.all([
      callMethodWithPool(MasterChefVaultAddress, <any>masterChef, "totalAllocPoint", []),
      vault.farmPid > 0
        ? callMethodWithPool(MasterChefVaultAddress, <any>masterChef, "poolInfo", [vault.farmPid])
        : Promise.resolve(["", new BigNumber(0)]),
      callMethodWithPool(MasterChefVaultAddress, <any>masterChef, "sishiPerBlock", []),
      callMethodWithPool(vault.vault, <any>erc20, "balanceOf", [MasterChefVaultAddress]),
    ])

    const sharePerBlock = new BigNumber(rawSharePerBlock)
    const totalShare = new BigNumber(rawTotalShare)

    return {
      mulTotal,
      mulCurrent,
      perShare: new BigNumber(Number(sharePerBlock))
        .multipliedBy(new BigNumber(Number(mulCurrent)))
        .dividedBy(new BigNumber(Number(mulTotal)))
        .multipliedBy(1e18)
        .div(new BigNumber(totalShare)),
      sharePerBlock,
    }
  }))

  return allVaultFarmsShare
}

export const fetchVaultFarmUsers = async (vaults: Vault[], { account }: { account: string }) => {
  const allVaultFarmUsers = await Promise.all(vaults.map(async vault => {
    if(vault.farmPid < 0){
      return {
        vaultStackApproved: false,
        vaultAndFarmBalance: new BigNumber(0),
        pendingFarming: new BigNumber(0),
      }
    }
    const [
      pendingFarming,
      farmingAllowance,
      [vaultAndFarmBalance],
    ] = await Promise.all([
      callMethodWithPool(MasterChefVaultAddress, <any>masterChef, "pendingSishi", [vault.farmPid, account]),
      callMethodWithPool(vault.vault, <any>erc20, "allowance", [account, MasterChefVaultAddress]),
      callMethodWithPool(MasterChefVaultAddress, <any>masterChef, "userInfo", [vault.farmPid, account],)
    ])

    // console.log("vaultAndFarmBalance", Number(new BigNumber(String(vaultAndFarmBalance)),) / 1e18)

    return {
      vaultStackApproved: Number(farmingAllowance) / (10 ** 18) >= 100000000,
      vaultAndFarmBalance: new BigNumber(String(vaultAndFarmBalance)),
      pendingFarming: new BigNumber(pendingFarming),
    }
  }))

  return allVaultFarmUsers
}

export const useVaultsData = (vaults: Vault[], { currentBlock, bnbBusdRate, token }: { currentBlock: number, bnbBusdRate: BigNumber, sishiBusdRate: BigNumber, token: any }) => {

  const [vaultsAPY, setVaulstAPY] = useState<any[]>(vaults.map(e => ({})))
  const [vaultsFarming, setVaultsFarming] = useState<any[]>(vaults.map(e => ({})))



  useEffect(() => {
    String(token);
    fetchVaultsAPY(vaults, { currentBlock, bnbBusdRate })
      .then(datas => setVaulstAPY(datas));
  }, [vaults, currentBlock, bnbBusdRate, token])

  useEffect(() => {
    String(token);

    fetchVaultFarms(vaults)
      .then(datas => setVaultsFarming(datas));

  }, [vaults, token])

  return useMemo(
    () => {
      // console.log("[allMergeVaults] update")

      return vaults.map((vault, index) => ({
        // ...vault,
        ...vaultsAPY[index] || {},
        ...vaultsFarming[index] || {},
        calc: {
          ...vaultsAPY[index]?.calc || {},
          ...vaultsFarming[index]?.calc || {},
        }
      }))
    },
    [vaultsAPY, vaultsFarming, vaults]
  )
}


export const useVaultsUserData = (vaults: Vault[], { account, token }: { account: string, token: any }) => {
  const [vaultUsers, setVaultUsers] = useState<any[]>(vaults.map(e => ({})))
  const [vaultFarmingUsers, setVaultFarmingUsers] = useState<any[]>(vaults.map(e => ({})))

  useEffect(() => {
    String(token);
    if (account)
      fetchVaultUsers(vaults, account)
        .then(datas => setVaultUsers(datas));
    else
      setVaultUsers(vaults.map(e => ({})))
  }, [vaults, account, token])

  useEffect(() => {
    String(token);
    if (account)
      fetchVaultFarmUsers(vaults, { account })
        .then(datas => setVaultFarmingUsers(datas));
    else
      setVaultFarmingUsers(vaults.map(e => ({})))

  }, [vaults, account, token])

  return useMemo(
    () => vaults.map((vault, index) => ({
      // ...vault,
      ...vaultUsers[index] || {},
      ...vaultFarmingUsers[index] || {},
      calc: {
        ...vaultUsers[index]?.calc || {},
        ...vaultFarmingUsers[index]?.calc || {},
      }
    })),
    [vaults, vaultUsers, vaultFarmingUsers]
  )
}

// export default useVaultAPY
