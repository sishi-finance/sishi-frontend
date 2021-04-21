import { useCallback, useEffect, useMemo, useState } from 'react'
import { BLOCKS_PER_DAY, BLOCKS_PER_HOUR } from 'config'
import BigNumber from 'bignumber.js/bignumber'
import { MasterChefVaultAddress, Vault, vaultLists, VaultWithData } from 'config/constants/vaults'
import { provider, } from 'web3-core'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import callMethodWithPool, { callMethodWithPoolFactory } from 'utils/pools'
import masterChef from 'config/abi/masterchef.json'
import { getMasterChefAddress, getVaultMasterChefAddress } from 'utils/addressHelpers'
import contracts, { deadAddress } from 'config/constants/contracts'
import erc20 from 'config/abi/erc20.json'
import sishivault from 'config/abi/sishivault.json'
import { QuoteToken } from 'config/constants/types'
import { useERC20ABI, useStrategy, } from './useContract'


export const fetchPancakeRate = async ({ baseAddress, lpAdress, quoteAddress, isLP = false }) => {
  const erc20ABI = <any>erc20
  const [
    tokenBalanceLP,
    quoteTokenBlanceLP,
    tokenDecimals,
    quoteTokenDecimals,
  ] = await Promise.all([

    // Balance of token in the LP contract
    isLP
      ? callMethodWithPool(lpAdress, erc20ABI, 'totalSupply', [])
      : callMethodWithPool(baseAddress, erc20ABI, 'balanceOf', [lpAdress]),

    // Balance of quote token on LP contract
    callMethodWithPool(quoteAddress, erc20ABI, 'balanceOf', [lpAdress]),

    // Token decimals   
    callMethodWithPool(baseAddress, erc20ABI, 'decimals', []),

    // Quote token decimals
    callMethodWithPool(quoteAddress, erc20ABI, 'decimals', []),

  ])




  if (!isLP) {
    return new BigNumber(quoteTokenBlanceLP)
      .multipliedBy(10 ** tokenDecimals)
      .multipliedBy(1e18)
      .div(new BigNumber(tokenBalanceLP))
      .dividedBy(10 ** quoteTokenDecimals)
  }

  return new BigNumber(quoteTokenBlanceLP)
    .multipliedBy(2)
    .multipliedBy(1e18)
    .div(new BigNumber(tokenBalanceLP))
}

export const useLPRate = ({ baseAddress = "", lpAdress = "", quoteAddress = "", isLP = false } = {}) => {

  const [rate, setRate] = useState(new BigNumber(0))

  useEffect(() => {

    if (baseAddress && lpAdress && quoteAddress)
      fetchPancakeRate({ baseAddress, lpAdress, quoteAddress, isLP })
        .then(r => setRate(r))
    else {
      console.log({ baseAddress, lpAdress, quoteAddress })
      setRate(new BigNumber(1e18))
    }
  }, [baseAddress, lpAdress, quoteAddress, isLP])

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
    String(reloadToken);
    strategyContract.methods
      .harvest()
      .call({ from: account || deadAddress })
      .then(result => setStrategyResult(result))

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

  const deltaBlock = Number(BLOCKS_PER_HOUR) * 36

  const allVaultsAPY = await Promise.all(vaults.map(async vault => {
    try {
      const prevBlock = Math.max(vault.fromBlock, currentBlock - deltaBlock)
      const callMethodWithAgoPool = callMethodWithPoolFactory(prevBlock)
      const currentDelta = currentBlock - prevBlock
      console.log("[deltaBlock] ", vault.tokenSymbol, currentDelta)

      const _q1 = callMethodWithPool(vault.vault, <any>sishivault, "balance", [])
      const _q2 = callMethodWithPool(vault.vault, <any>sishivault, "getPricePerFullShare", [])
        .catch(e => new BigNumber(1e18))
      const _q3 = currentDelta > 0
        ? callMethodWithAgoPool(vault.vault, <any>sishivault, "getPricePerFullShare", [])
          .catch(e => _q2)
        : _q2
        
      const _q4 = vault.lpToken ? fetchPancakeRate({
        baseAddress: vault.tokenAddress,
        lpAdress: vault.lpToken.address,
        quoteAddress: vault.lpToken.quoteAddress,
        isLP: !vault.isTokenOnly,
      }) : Promise.resolve(new BigNumber(1e18))

      const [
        rawVaultTVL,
        rawPricePerFullShare,
        rawPricePerFullShareAgo,
        rawTokenQuoteRate,
      ] = await Promise.all([_q1, _q2, _q3, _q4])

      const vaultTVL = Number(rawVaultTVL)
      const pricePerFullShare = Number(rawPricePerFullShare)
      const pricePerFullShareAgo = Number(rawPricePerFullShareAgo)
      const tokenQuoteRate = Number(rawTokenQuoteRate)

      const tokenBUSDRate = vault?.lpToken?.quote === QuoteToken.BNB
        ? tokenQuoteRate * Number(bnbBusdRate)
        : tokenQuoteRate

      const roiDay = (Number(pricePerFullShare) / Number(pricePerFullShareAgo) - 1) * Number(BLOCKS_PER_DAY) / currentDelta

      const roiHour = roiDay / 24
      const roiWeek = ((roiDay + 1) ** (7)) - 1
      const roiMonth = ((roiDay + 1) ** (30)) - 1
      const roiYear = ((roiDay + 1) ** (365)) - 1

      // console.log({ tokenSymbol: vault.tokenSymbol, vaultTVL: Number(rawVaultTVL), yieldAPY: roiYear.toFixed(10), yieldAPR: (roiDay * 365).toFixed(10) })

      return {
        roiLoaded: true,
        tokenBUSDRate,
        pricePerFullShare: new BigNumber(rawPricePerFullShare),
        calc: {
          roiHour: roiHour.toFixed(10),
          roiDay: roiDay.toFixed(10),
          roiWeek: roiWeek.toFixed(10),
          roiMonth: roiMonth.toFixed(10),
          roiYear: roiYear.toFixed(10),
          apy: roiYear.toFixed(10),
          apr: (roiDay * 365).toFixed(10),
          tvl: Number(vaultTVL.toFixed(10)),
        },
      }
    } catch (error) {

      // console.error(vault.tokenSymbol)
      return {
        roiLoaded: 0,
        tokenBUSDRate: 0,
        pricePerFullShare: new BigNumber(0),
        calc: {
          roiHour: 0,
          roiDay: 0,
          roiWeek: 0,
          roiMonth: 0,
          roiYear: 0,
          apy: 0,
          apr: 0,
          tvl: 0,
        },
      }
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

    if (vault.farmPid < 0) return {
      mulTotal: 0,
      mulCurrent: 0,
      perShare: 0,
      sharePerBlock: new BigNumber(0),
    }

    const [mulTotal, [, mulCurrent, ,], rawSharePerBlock, rawTotalShare] = await Promise.all([
      callMethodWithPool(MasterChefVaultAddress, <any>masterChef, "totalAllocPoint", []),
      vault.farmPid > 0
        ? callMethodWithPool(MasterChefVaultAddress, <any>masterChef, "poolInfo", [vault.farmPid])
        : Promise.resolve(["", new BigNumber(0)]),
      callMethodWithPool(MasterChefVaultAddress, <any>masterChef, "sishiPerBlock", []),
      callMethodWithPool(vault.vault, <any>erc20, "balanceOf", [MasterChefVaultAddress]),
    ])

    const sharePerBlock = new BigNumber(rawSharePerBlock)
    // const totalShare = new BigNumber(rawTotalShare)

    return {
      mulTotal,
      mulCurrent,
      perShare: Number(rawSharePerBlock)
        * Number(mulCurrent)
        / Number(mulTotal)
        * (1e18)
        / (Number(rawTotalShare)),
      // .multipliedBy(new BigNumber(Number(mulCurrent)))
      // .dividedBy(new BigNumber(Number(mulTotal)))
      // .multipliedBy(1e18)
      // .div(new BigNumber(totalShare)),
      // perShare: new BigNumber(Number(sharePerBlock))
      //   .multipliedBy(new BigNumber(Number(mulCurrent)))
      //   .dividedBy(new BigNumber(Number(mulTotal)))
      //   .multipliedBy(1e18)
      //   .div(new BigNumber(totalShare)),
      sharePerBlock,
    }
  }))

  return allVaultFarmsShare
}

export const fetchVaultFarmUsers = async (vaults: Vault[], { account }: { account: string }) => {
  const allVaultFarmUsers = await Promise.all(vaults.map(async vault => {
    if (vault.farmPid < 0) {
      return {
        calc: {
          vaultStackApproved: false,
          vaultAndFarmBalance: new BigNumber(0),
          pendingFarming: new BigNumber(0),
        }
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

    console.log("[debug] vaultAndFarmBalance", Number(new BigNumber(String(vaultAndFarmBalance)),) / 1e18)

    return {
      calc : {
        vaultStackApproved: Number(farmingAllowance) / (10 ** 18) >= 100000000,
        vaultAndFarmBalance: new BigNumber(String(vaultAndFarmBalance)),
        pendingFarming: new BigNumber(pendingFarming),
      }
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
