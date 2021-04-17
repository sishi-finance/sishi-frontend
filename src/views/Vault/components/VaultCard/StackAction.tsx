import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, IconButton, AddIcon, MinusIcon, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { getBalanceNumber } from 'utils/formatBalance'
import { useVaultStackApprove, useVaultStack, useVaultUnstack } from 'hooks/useVaultStack'
import { VaultWithData } from 'config/constants/vaults'
import UnlockButton from 'components/UnlockButton'
import { useERC20 } from 'hooks/useContract'
import { useApprove } from 'hooks/useApprove'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

interface VaultCardActionsProps {
  vault: VaultWithData,
  reloadToken: any,
  depositBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string,
  tokenDecimal?: number,
  pid?: number
  depositFeeBP?: number,
  account?: string,
  vaultStackApproved?: boolean,
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const VaultStackAction: React.FC<VaultCardActionsProps> = ({ vault, reloadToken, vaultStackApproved, account, depositBalance, tokenBalance, tokenName, depositFeeBP, tokenDecimal = 18 }) => {
  const TranslateString = useI18n()
  const { onStack } = useVaultStack(vault, reloadToken)
  const { onUnstack } = useVaultUnstack(vault, reloadToken)
  const rawStakedBalance = getBalanceNumber(depositBalance, tokenDecimal)
  const rawTokenBalance = getBalanceNumber(tokenBalance, tokenDecimal)
  const displayBalance = rawStakedBalance.toLocaleString()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { onApprove } = useVaultStackApprove(vault, reloadToken)
  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])


  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStack} tokenName={tokenName} depositFeeBP={depositFeeBP} tokenDecimal={tokenDecimal} />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={depositBalance} onConfirm={onUnstack} tokenName={tokenName} tokenDecimal={tokenDecimal} />,
  )

  const renderStakingButtons = () => {
    return vaultStackApproved ? <IconButtonWrapper>
      <IconButton size="sm" variant="tertiary" onClick={onPresentWithdraw} mr="6px" disabled={rawStakedBalance === 0}>
        <MinusIcon color="primary" />
      </IconButton>
      <IconButton size="sm" variant="tertiary" onClick={onPresentDeposit} disabled={rawTokenBalance === 0}>
        <AddIcon color="primary" />
      </IconButton>
    </IconButtonWrapper> : <Button size="sm" disabled={requestedApproval} onClick={handleApprove}>
      {TranslateString(999, 'Approve')}
    </Button>
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      {!account
        ? <UnlockButton mt="8px" fullWidth size="sm"/>
        : <>
          <Heading color={rawStakedBalance === 0 ? 'textDisabled' : 'text'} mr="6px">{displayBalance}</Heading>
          {renderStakingButtons()}
        </>
      }
    </Flex>
  )
}

export default VaultStackAction
