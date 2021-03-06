import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, IconButton, AddIcon, MinusIcon, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { getBalanceNumber } from 'utils/formatBalance'
import { useVaultApprove, useVaultDeposit, useVaultWithdrawal } from 'hooks/useVaultDeposit'
import { VaultWithData } from 'config/constants/vaults'
import UnlockButton from 'components/UnlockButton'
import { useERC20 } from 'hooks/useContract'
import { useApprove } from 'hooks/useApprove'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

interface VaultCardActionsProps {
  vault: VaultWithData,
  reloadToken: any
  depositBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string,
  tokenDecimal?: number,
  pid?: number
  depositFeeBP?: number,
  account?: string,
}

const IconButtonWrapper = styled.div`
  display: flex;
  margin-left: auto;
  svg {
    width: 20px;
  }
`

const VaultAction: React.FC<VaultCardActionsProps> = ({ vault, reloadToken, account, depositBalance, tokenBalance, tokenName, depositFeeBP, tokenDecimal = 18 }) => {
  const TranslateString = useI18n()
  const { onDeposit } = useVaultDeposit(vault, reloadToken)
  const { onWithdrawal } = useVaultWithdrawal(vault, reloadToken)
  const rawStakedBalance = getBalanceNumber(depositBalance, tokenDecimal)
  const rawTokenBalance = getBalanceNumber(tokenBalance, tokenDecimal)
  const displayBalance = rawStakedBalance.toLocaleString()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const tokenContract = useERC20(vault.tokenAddress)
  const { onApprove } = useVaultApprove(vault, reloadToken)
  const { disableDeposit = false } = vault
  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])


  console.log("[rawTokenBalance]", tokenName, tokenDecimal, String(tokenBalance), String(rawTokenBalance))


  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onDeposit} tokenName={tokenName} depositFeeBP={depositFeeBP} tokenDecimal={tokenDecimal} />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={depositBalance} onConfirm={onWithdrawal} tokenName={tokenName} tokenDecimal={tokenDecimal} />,
  )

  const renderStakingButtons = () => {
    return vault.calc?.vaultApproved ? <IconButtonWrapper>
      <IconButton size="sm" variant="tertiary" onClick={onPresentWithdraw} mr="6px" disabled={rawStakedBalance === 0}>
        <MinusIcon color="primary" />
      </IconButton>
      <IconButton size="sm" variant="tertiary" onClick={onPresentDeposit} disabled={disableDeposit || rawTokenBalance === 0}>
        <AddIcon color="primary" />
      </IconButton>
    </IconButtonWrapper> : <Button size="sm" ml="auto" disabled={requestedApproval} onClick={handleApprove}>
      {TranslateString(999, 'Approve')}
    </Button>
  }

  return (
    <Flex justifyContent="right" alignItems="center" marginLeft="auto">
      {!account
        ? <UnlockButton mt="8px" ml="auto" size="sm" />
        : <>
          {/* <Heading color={rawStakedBalance === 0 ? 'textDisabled' : 'text'} mr="6px">{displayBalance}</Heading> */}
          {renderStakingButtons()}
        </>
      }
    </Flex>
  )
}

export default VaultAction
