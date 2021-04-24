import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, IconButton, AddIcon, MinusIcon, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'
import { useApprove } from 'hooks/useApprove'
import { useERC20 } from 'hooks/useContract'
import UnlockButton from 'components/UnlockButton'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

interface FarmCardActionsProps {
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  earnedBalance?: BigNumber
  tokenName?: string,
  tokenDecimal?: number,
  pid?: number
  depositFeeBP?: number,
  account?: string
  approved?: boolean,
  tokenAddress: string,
  rewardToken: string,
}

const IconButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-left: auto;
  > * {
    margin-left: 6px;
    margin-top: 6px;
  }
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<FarmCardActionsProps> = ({ stakedBalance, earnedBalance, tokenBalance, tokenName, tokenAddress, pid, depositFeeBP, account, approved, rewardToken, tokenDecimal = 18 }) => {
  const TranslateString = useI18n()
  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const tokenContract = useERC20(tokenAddress)
  const { onApprove } = useApprove(tokenContract)
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [requestedHarvest, setRequestedHarvest] = useState(false)
  const [requestedCompound, setRequestedCompound] = useState(false)

  const rawStakedBalance = getBalanceNumber(stakedBalance, tokenDecimal)
  const rawEarnedBalance = getBalanceNumber(earnedBalance, tokenDecimal)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])


  const onHarvest = useCallback(async () => {
    try {
      setRequestedHarvest(true)
      await onStake("0")
    } catch (e) {
      console.error(e)
    } finally {
      setRequestedHarvest(false)
    }
  }, [onStake, setRequestedHarvest])

  const onCompound = useCallback(async () => {
    try {
      setRequestedCompound(true)
      await onStake(rawEarnedBalance.toString())
    } catch (e) {
      console.error(e)
    } finally {
      setRequestedCompound(false)
    }
  }, [onStake, rawEarnedBalance, setRequestedCompound])

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} depositFeeBP={depositFeeBP} tokenDecimal={tokenDecimal} />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} tokenDecimal={tokenDecimal} />,
  )

  const renderStakingButtons = () => {
    return rawStakedBalance === 0 ? (
      <Button size="sm" marginLeft="auto" onClick={onPresentDeposit}>{TranslateString(999, 'Stake')}</Button>
    ) : (
      <IconButtonWrapper>
        {
          tokenName === rewardToken && <Button size="sm" variant="primary" onClick={onCompound} disabled={requestedCompound}>
            Compound
          </Button>
        }
        <IconButton size="sm" variant="tertiary" onClick={onPresentWithdraw}>
          <MinusIcon color="primary" />
        </IconButton>
        <IconButton size="sm" variant="tertiary" onClick={onPresentDeposit}>
          <AddIcon color="primary" />
        </IconButton>
        {/* <Button size="sm" variant="tertiary" onClick={onHarvest} disabled={requestedHarvest} px="20.5px">
          Harvest
        </Button> */}

      </IconButtonWrapper>
    )
  }

  return (
    <Flex justifyContent="space-between" alignItems="right">
      {/* <Heading color={rawStakedBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading> */}
      {!account
        ? <UnlockButton ml="auto" size="sm" />
        : <>
          {approved
            ? renderStakingButtons()
            : <Button size="sm" ml="auto" marginLeft="auto" disabled={requestedApproval} onClick={handleApprove}>Approve</Button>}
        </>
      }
    </Flex>
  )
}

export default StakeAction
