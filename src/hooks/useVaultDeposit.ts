import { useCallback, useState } from 'react';
import { useWallet } from '@binance-chain/bsc-use-wallet';
import { useDispatch } from 'react-redux';
import { approve, vaultDeposit, vaultWithdrawal, harvestVault } from 'utils/callHelpers';
import { Vault } from 'config/constants/vaults';
import { useERC20, useStrategy, useVault } from './useContract';

export const useVaultDeposit = (vault: Vault, reloadToken) => {
  // const dispatch = useDispatch();
  const { account } = useWallet();
  const vaultContract = useVault(vault);

  const handleDeposit = useCallback(
    async (amount: string) => {
      const txHash = await vaultDeposit(vaultContract, amount, account);
      // dispatch(fetchFarmUserDataAsync(account))
      reloadToken?.();
      console.info(txHash);
    },
    [account, vaultContract, reloadToken]
  );

  return { onDeposit: handleDeposit };
};


export const useVaultWithdrawal = (vault: Vault, reloadToken) => {
  // const dispatch = useDispatch()
  const { account } = useWallet()
  const vaultContract = useVault(vault);
  const handleWithdrawal = useCallback(
    async (amount: string) => {
      const txHash = await vaultWithdrawal(vaultContract, amount, account)
      reloadToken?.();
      // dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, vaultContract, reloadToken]
  )

  return { onWithdrawal: handleWithdrawal }
}

export const useVaultApprove = (vault: Vault, reloadToken) => {
  const tokenContract = useERC20(vault.tokenAddress);
  const vaultContract = useVault(vault);

  const { account }: { account: string } = useWallet()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(tokenContract, vaultContract, account)
      reloadToken?.();
      return tx
    } catch (e) {
      return false
    }
  }, [account, tokenContract, vaultContract, reloadToken])

  return { onApprove: handleApprove }
}

export const useVaultHarvest = (vault: Vault, reloadToken) => {
  // const tokenContract = useERC20(vault.tokenAddress);
  const strategyContract = useStrategy(vault);
  const [loading, setLoading] = useState(false)

  const { account }: { account: string } = useWallet()

  const handleHarvest = useCallback(async () => {
    try {
      setLoading(true)
      const tx = await harvestVault(strategyContract, account)
      reloadToken?.();
      return tx
    } catch (e) {
      return false
    } finally {
      setLoading(false)
    }
  }, [account, strategyContract, reloadToken, setLoading])

  return {
    onHarvest: handleHarvest,
    loading,
  }
}

