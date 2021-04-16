import { useCallback, useEffect, useState } from 'react'
import { BLOCKS_PER_DAY, BLOCKS_PER_HOUR } from 'config'
import BigNumber from 'bignumber.js/bignumber'
import { Vault, vaultLists, VaultWithData } from 'config/constants/vaults'
import { provider, } from 'web3-core'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import callMethodWithPool, { callMethodWithPoolFactory } from 'utils/pools'
import masterChef from 'config/abi/masterchef.json'
import { getMasterChefAddress, getVaultMasterChefAddress } from 'utils/addressHelpers'
import contracts from 'config/constants/contracts'
import erc20 from 'config/abi/erc20.json'
import useBlock from './useBlock'
import useContract, { useERC20, useERC20ABI, useMasterchef, useStrategy, useStrategyABI, useVault, useVaultABI } from './useContract'



const useBalance = ({ tokenAddress, account, updateToken }) => {
  const [walletBalance, setWalletBalance] = useState(0)
  const tokenAbi = useERC20ABI()

  useEffect(() => {
    String(updateToken);
    if (account) {
      callMethodWithPool(
        tokenAddress,
        <any>tokenAbi,
        "balanceOf",
        [account],
      )
        .then(balance => {
          setWalletBalance(Number(balance) / (10 ** 18))
        })
        .catch(e => console.error(e));
    }
  }, [account, tokenAbi, tokenAddress, setWalletBalance, updateToken]);

  return walletBalance
}

const useAllowance = ({ tokenAddress, allowanceAddress, account, updateToken }) => {
  const [walletApprove, setWalletApprove] = useState(false)
  const tokenAbi = useERC20ABI()

  useEffect(() => {
    String(updateToken);
    if (account) {
      callMethodWithPool(
        tokenAddress,
        <any>tokenAbi,
        "allowance",
        [account, allowanceAddress],
      )
        .then(allowed => {
          setWalletApprove(Number(allowed) / (10 ** 18) >= 100000000)
        })
        .catch(e => console.error(e));
    }
  }, [account, allowanceAddress, tokenAddress, tokenAbi, setWalletApprove, updateToken]);


  return walletApprove
}

const usePendingVaultSishi = ({ account, pid, updateToken }) => {
  const [pendingBalance, setPendingBalance] = useState(0)
  const masterChefAddress = getVaultMasterChefAddress()
  const masterChefABI = masterChef

  useEffect(() => {
    String(updateToken);
    if (account) {
      callMethodWithPool(
        masterChefAddress,
        <any>masterChefABI,
        "pendingSishi",
        [pid, account],
      )
        .then(pending => {
          setPendingBalance(Number(pending) / (10 ** 18))
        })
        .catch(e => console.error(e));
    }
  }, [account, updateToken, setPendingBalance, pid, masterChefAddress, masterChefABI]);

  return pendingBalance
}

const useFarmingBalance = ({ account, pid, updateToken }) => {
  const [farmingBalance, setFarmingBalance] = useState(0)
  const masterChefAddress = getVaultMasterChefAddress()
  const masterChefABI = masterChef

  useEffect(() => {
    String(updateToken);
    if (account) {
      callMethodWithPool(
        masterChefAddress,
        <any>masterChefABI,
        "userInfo",
        [pid, account],
      ).then(([amount]) => {
        setFarmingBalance(Number(amount) / (10 ** 18))
      }).catch(e => console.error(e));
    }
  }, [account, updateToken, setFarmingBalance, pid, masterChefAddress, masterChefABI]);

  return farmingBalance
}

export const useVaultFarmingShare = ({ pid, vaultAddress }) => {
  const [[mulTotal, mulCurrent, allShare, sharePerBlock], setFarmingShare] = useState([0, 0, new BigNumber(0), new BigNumber(0)])
  const masterChefAddress = getVaultMasterChefAddress()
  const masterChefABI = masterChef

  useEffect(() => {
    setTimeout(async () => {

      const [total, [lpAddress, point, ,], perBlock, totalShare] = await Promise.all([
        callMethodWithPool(masterChefAddress, <any>masterChefABI, "totalAllocPoint", []),
        callMethodWithPool(masterChefAddress, <any>masterChefABI, "poolInfo", [pid]),
        callMethodWithPool(masterChefAddress, <any>masterChefABI, "sishiPerBlock", []),
        callMethodWithPool(vaultAddress, <any>erc20, "balanceOf", [masterChefAddress]),
      ])

      setFarmingShare([total, point, totalShare, perBlock])
    }, 0)


  }, [pid, masterChefAddress, masterChefABI, vaultAddress]);

  // console.log("---------------",
  //   Number(
  //     new BigNumber(Number(sharePerBlock))
  //       .multipliedBy(new BigNumber(Number(mulCurrent)))
  //       .dividedBy(new BigNumber(Number(mulTotal)))
  //       .multipliedBy(1e18)
  //       .div(new BigNumber(allShare))
  //   )
  // )

  return {
    mulTotal,
    mulCurrent,
    perShare: new BigNumber(Number(sharePerBlock))
      .multipliedBy(new BigNumber(Number(mulCurrent)))
      .dividedBy(new BigNumber(Number(mulTotal)))
      .multipliedBy(1e18)
      .div(new BigNumber(allShare)),
    sharePerBlock,
  }
}

export const useVaultAPY = ({ tokenSymbol, tokenAddress, vault: vaultAddress, fromBlock = 0 }: Vault) => {
  const [updateToken, setUpdateToken] = useState(0)
  const vaultABI = useVaultABI()
  // const vaultContract = useVault(tokenSymbol)
  const agoVaultContract = useVault(tokenSymbol)
  const [[pricePerFullShare, loaded1], setPricePerFullShare] = useState([new BigNumber(0), false])
  const [[oldPricePerFullShare, loaded2], setOldPricePerFullShare] = useState([new BigNumber(0), false])
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const [vaultTVL, setVaultTVL] = useState(0)
  const [vaultShare, setVaultShare] = useState(0)

  const walletBalance = useBalance({ tokenAddress, account, updateToken })
  const vaultApproved = useAllowance({ tokenAddress, allowanceAddress: vaultAddress, account, updateToken })

  const currentBlock = useBlock()
  const deltaBlock = Number(BLOCKS_PER_HOUR) * 36
  const prevBlock = Math.max(fromBlock + 1000, currentBlock - deltaBlock)
  const callMethodWithAgoPool = callMethodWithPoolFactory(prevBlock)
  const reloadToken = useCallback(() => setUpdateToken(updateToken + 1), [setUpdateToken, updateToken])

  useEffect(() => {
    String(updateToken);
    callMethodWithPool(
      vaultAddress,
      <any>vaultABI,
      "balance",
      [],
    )
      .then(balance => {
        // console.log("balance", { balance })
        setVaultTVL(Number(balance) / (10 ** 18))
      })
      .catch(e => console.error(e));
  }, [vaultAddress, vaultABI, setVaultTVL, updateToken]);


  useEffect(() => {
    String(updateToken);
    if (account) {
      callMethodWithPool(
        vaultAddress,
        <any>vaultABI,
        "balanceOf",
        [account],
      )
        .then(balance => {
          setVaultShare(Number(balance) / (10 ** 18))
        })
        .catch(e => console.error(e));
    }
  }, [vaultAddress, vaultABI, setVaultShare, account, updateToken]);

  useEffect(() => {
    // console.log({ currentBlock, prevBlock })
    if (Number.isFinite(currentBlock) && currentBlock > 1) {
      callMethodWithPool(
        vaultAddress,
        <any>vaultABI,
        "getPricePerFullShare",
        [],
      )
        .then(price => {
          // console.log("1", { price })
          setPricePerFullShare([new BigNumber(price), true])
        })
        .catch(e => console.error(e));
    }


  }, [vaultAddress, vaultABI, agoVaultContract, currentBlock, setPricePerFullShare])

  useEffect(() => {
    if (Number.isFinite(prevBlock) && prevBlock > 1) {
      callMethodWithAgoPool(
        vaultAddress,
        <any>vaultABI,
        "getPricePerFullShare",
        [],
      )
        .then(price => {
          setOldPricePerFullShare([new BigNumber(price), true])
        })
        .catch(e => console.error(e))
    }
  }, [vaultAddress, vaultABI, prevBlock, setPricePerFullShare, setOldPricePerFullShare, callMethodWithAgoPool])

  const roiDay = pricePerFullShare
    .div(oldPricePerFullShare)
    .minus(new BigNumber(1))
    .multipliedBy(BLOCKS_PER_DAY)
    .dividedBy(deltaBlock)
  const roiHour = roiDay.dividedBy(24)
  const roiWeek = roiDay.plus(1).exponentiatedBy(7).minus(1)
  const roiMonth = roiDay.plus(1).exponentiatedBy(30).minus(1)
  const roiYear = roiDay.plus(1).exponentiatedBy(365).minus(1)
  const roiLoaded = loaded1 && loaded2;
  return {
    roiLoaded,
    calc: {
      roiHour: Number(roiLoaded ? (roiHour).toFixed(10) : (0).toFixed(10)),
      roiDay: Number(roiLoaded ? (roiDay).toFixed(10) : (0).toFixed(10)),
      roiWeek: Number(roiLoaded ? (roiWeek).toFixed(10) : (0).toFixed(10)),
      roiMonth: Number(roiLoaded ? (roiMonth).toFixed(10) : (0).toFixed(10)),
      roiYear: Number(roiLoaded ? (roiYear).toFixed(10) : (0).toFixed(10)),
      apy: Number(roiLoaded ? (roiYear).toFixed(10) : (0).toFixed(10)),
      apr: Number(roiLoaded ? (roiDay.multipliedBy(365)).toFixed(10) : (0).toFixed(10)),
      tvl: Number(vaultTVL.toFixed(10)),
      share: Number(vaultShare.toFixed(10)),
      balance: Number(vaultShare * pricePerFullShare.toNumber() / 1e18),
      walletBalance: Number(Number(walletBalance).toFixed(10)),
      vaultApproved,
    },
    reloadToken,
  }
}


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

export const useVaultFarm = ({ tokenSymbol, tokenAddress, vault: vaultAddress, farmPid, lpToken, }: Vault, updateToken) => {

  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const pendingFarming = usePendingVaultSishi({ account, pid: farmPid, updateToken })
  const masterChefAddress = getVaultMasterChefAddress()
  const vaultStackApproved = useAllowance({ tokenAddress: vaultAddress, account, allowanceAddress: masterChefAddress, updateToken })
  const vaultAndFarmBalance = useFarmingBalance({ account, pid: farmPid, updateToken })

  return {
    vaultAndFarmBalance,
    vaultStackApproved,
    pendingFarming,
  }
}


export const useVaultHarvestReward = (vault: Vault, account: string) => {
  const strategyContract = useStrategy(vault.tokenSymbol)
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


export default useVaultAPY
