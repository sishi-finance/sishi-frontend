import { useEffect, useState } from 'react'
import { BLOCKS_PER_DAY, BLOCKS_PER_HOUR } from 'config'
import BigNumber from 'bignumber.js/bignumber'
import { Vault, vaultLists, VaultWithData } from 'config/constants/vaults'
import { provider, } from 'web3-core'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import callMethodWithPool from 'utils/pools'
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

const useVaultAPY = ({ tokenSymbol, tokenAddress, vault: vaultAddress }: Vault) => {
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

  const deltaBlock = 200
  // const deltaBlock = Number(BLOCKS_PER_DAY) * 3
  const currentBlock = useBlock()
  const prevBlock = currentBlock - deltaBlock

  const reloadToken = () => setUpdateToken(updateToken + 1)

  useEffect(() => {
    String(updateToken);
    callMethodWithPool(
      vaultAddress,
      <any>vaultABI,
      "balance",
      [],
    )
      .then(balance => {
        console.log("balance", { balance })
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
    console.log({ currentBlock, prevBlock })
    if (Number.isFinite(currentBlock) && currentBlock > 1) {
      callMethodWithPool(
        vaultAddress,
        <any>vaultABI,
        "getPricePerFullShare",
        [],
      )
        .then(price => {
          console.log("1", { price })
          setPricePerFullShare([new BigNumber(price), true])
        })
        .catch(e => console.error(e));

      agoVaultContract.defaultBlock = prevBlock
      agoVaultContract.methods
        .getPricePerFullShare()
        .call()
        .then(price => {
          console.log("2", { price })
          setOldPricePerFullShare([new BigNumber(price), true])
        })
        .catch(e => console.error(e))
    }


  }, [vaultAddress, vaultABI, agoVaultContract, currentBlock, prevBlock, setPricePerFullShare, setOldPricePerFullShare])

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
      roiHour: roiLoaded ? (roiHour).toFixed(10) : (0).toFixed(10),
      roiDay: roiLoaded ? (roiDay).toFixed(10) : (0).toFixed(10),
      roiWeek: roiLoaded ? (roiWeek).toFixed(10) : (0).toFixed(10),
      roiMonth: roiLoaded ? (roiMonth).toFixed(10) : (0).toFixed(10),
      roiYear: roiLoaded ? (roiYear).toFixed(10) : (0).toFixed(10),
      apy: roiLoaded ? (roiYear).toFixed(10) : (0).toFixed(10),
      apr: roiLoaded ? (roiDay.multipliedBy(365)).toFixed(10) : (0).toFixed(10),
      tvl: vaultTVL.toFixed(10),
      share: vaultShare.toFixed(10),
      balance: vaultShare * pricePerFullShare.toNumber() / 1e18,
      walletBalance: Number(walletBalance).toFixed(10),
      vaultApproved,
    },
    reloadToken,
  }
}



export const useVaults = () => {
  const vaults = vaultLists
  const allVaultWithData = vaultLists.map(useVaultAPY)

  return vaults.map((e, i) => (<VaultWithData><any>{
    ...e,
    ...allVaultWithData[i]
  }))
}


export default useVaultAPY
