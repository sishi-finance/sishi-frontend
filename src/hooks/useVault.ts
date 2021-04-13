import { useEffect, useState } from 'react'
import { BLOCKS_PER_DAY, BLOCKS_PER_HOUR } from 'config'
import BigNumber from 'bignumber.js/bignumber'
import { Vault, vaultLists, VaultWithData } from 'config/constants/vaults'
import { provider } from 'web3-core'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useBlock from './useBlock'
import useContract, { useERC20, useVault } from './useContract'



const useVaultAPY = ({ tokenSymbol, tokenAddress }: Vault) => {

  const vaultContract = useVault(tokenSymbol)
  const agoVaultContract = useVault(tokenSymbol)
  const tokenContract = useERC20(tokenAddress)
  const [[pricePerFullShare, loaded1], setPricePerFullShare] = useState([new BigNumber(0), false])
  const [[oldPricePerFullShare, loaded2], setOldPricePerFullShare] = useState([new BigNumber(0), false])
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const [vaultTVL, setVaultTVL] = useState(0)
  const [vaultShare, setVaultShare] = useState(0)
  const [walletBalance, setWalletBalance] = useState(0)

  const deltaBlock = 200
  // const deltaBlock = Number(BLOCKS_PER_DAY) * 3
  const currentBlock = useBlock()
  const prevBlock = currentBlock - deltaBlock

  useEffect(() => {
    vaultContract.methods
      .balance()
      .call()
      .then(balance => {
        console.log("balance", { balance })
        setVaultTVL(Number(balance) / (10 ** 18))
      })
      .catch(e => console.error(e));
  }, [vaultContract, setVaultTVL]);

  useEffect(() => {
    if (account) {
      tokenContract.methods
        .balanceOf(account)
        .call()
        .then(balance => {
          setWalletBalance(Number(balance) / (10 ** 18))
        })
        .catch(e => console.error(e));
    }
  }, [account, tokenContract, setWalletBalance]);

  useEffect(() => {
    if (account) {
      vaultContract.methods
        .balanceOf(account)
        .call()
        .then(balance => {
          setVaultShare(Number(balance) / (10 ** 18))
        })
        .catch(e => console.error(e));
    }
  }, [vaultContract, setVaultShare, account,]);

  useEffect(() => {
    vaultContract.methods
      .balance()
      .call()
      .then(balance => {
        console.log("balance", { balance })
        setVaultTVL(Number(balance) / (10 ** 18))
      })
      .catch(e => console.error(e));
  }, [vaultContract, setVaultTVL]);

  useEffect(() => {

    console.log({ currentBlock, prevBlock })

    if (Number.isFinite(currentBlock) && currentBlock > 1) {
      vaultContract.methods
        .getPricePerFullShare()
        .call()
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


  }, [vaultContract, agoVaultContract, currentBlock, prevBlock, setPricePerFullShare, setOldPricePerFullShare])

  const roiDay = pricePerFullShare
    .div(oldPricePerFullShare)
    .minus(new BigNumber(1))
    .multipliedBy(BLOCKS_PER_DAY)
    .dividedBy(deltaBlock)
  const roiHour = roiDay.dividedBy(24)
  const roiWeek = roiDay.plus(1).exponentiatedBy(7).minus(1)
  const roiMonth = roiDay.plus(1).exponentiatedBy(30).minus(1)
  const roiYear = roiDay.plus(1).exponentiatedBy(365).minus(1)

  return {
    roiLoaded: loaded1 && loaded2,
    vault: "",
    strategy: "",
    calc: {
      roiHour: (roiHour).toFixed(10),
      roiDay: (roiDay).toFixed(10),
      roiWeek: (roiWeek).toFixed(10),
      roiMonth: (roiMonth).toFixed(10),
      roiYear: (roiYear).toFixed(10),
      apy: (roiYear).toFixed(10),
      apr: (roiDay.multipliedBy(365)).toFixed(10),
      tvl: vaultTVL.toFixed(10),
      share: vaultShare.toFixed(10),
      balance: vaultShare * pricePerFullShare.toNumber() / 1e18,
      walletBalance: Number(walletBalance).toFixed(10),
    }
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
