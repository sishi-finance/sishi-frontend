import { useCallback, useEffect, useState } from 'react'
import { BLOCKS_PER_DAY, BLOCKS_PER_HOUR } from 'config'
import BigNumber from 'bignumber.js/bignumber'
import { Vault, vaultLists, VaultWithData } from 'config/constants/vaults'
import { provider, } from 'web3-core'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import callMethodWithPool, { callMethodWithPoolFactory } from 'utils/pools'
import useBlock from './useBlock'
import useContract, { useERC20, useERC20ABI, useVault, useVaultABI } from './useContract'



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



export const useVaults = () => {
  return vaultLists
}


export default useVaultAPY
