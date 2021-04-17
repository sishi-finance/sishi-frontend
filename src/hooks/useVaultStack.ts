

import { useCallback, useState } from 'react';
import { useWallet } from '@binance-chain/bsc-use-wallet';
import { useDispatch } from 'react-redux';
import { approve, stake, unstake } from 'utils/callHelpers';
import { Vault } from 'config/constants/vaults';
import { getVaultMasterChefAddress } from 'utils/addressHelpers';
import { useVault, useVaultMasterChef } from './useContract';

export const useVaultStack = (vault: Vault, reloadToken) => {
  const { account } = useWallet();
  const masterChefContract = useVaultMasterChef()
  const handleStack = useCallback(
    async (amount: string) => {
      console.log("stake", masterChefContract.options.address, vault.farmPid, amount, account)
      const txHash = await stake(masterChefContract, vault.farmPid, amount, account);
      reloadToken?.();
      console.info(txHash);
    },
    [account, reloadToken, masterChefContract, vault.farmPid]
  );

  return { onStack: handleStack };
};

export const useVaultUnstack = (vault: Vault, reloadToken) => {
  // const dispatch = useDispatch()
  const { account } = useWallet()
  const masterChefContract = useVaultMasterChef()
  const handleUnstack = useCallback(
    async (amount: string) => {
      console.log("unstake", masterChefContract.options.address, vault.farmPid, amount, account)
      const txHash = await unstake(masterChefContract, vault.farmPid, amount, account)
      reloadToken?.();
      // dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, reloadToken, masterChefContract, vault.farmPid]
  )

  return { onUnstack: handleUnstack }
}

export const useVaultStackApprove = (vault: Vault, reloadToken) => {
  const vaultContract = useVault(vault);
  const masterChef = useVaultMasterChef()

  const { account }: { account: string } = useWallet()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(vaultContract, masterChef, account)
      reloadToken?.();
      return tx
    } catch (e) {
      console.error(e)
      return false
    }
  }, [account, vaultContract, masterChef, reloadToken])

  return { onApprove: handleApprove }
}

