import React, { useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Flex, Text, Skeleton, Image, Tag, Button, LinkExternal } from '@pancakeswap-libs/uikit'
import { provider } from 'web3-core'
import useI18n from 'hooks/useI18n'
import { Vault, VaultWithData } from 'config/constants/vaults'
import {  useVaultHarvestReward } from 'hooks/useVault'
import { useVaultHarvest } from 'hooks/useVaultDeposit'
import CardValue from 'views/Home/components/CardValue'
import Spacer from 'components/Spacer'

const Row = styled.div`
  align-items: center;
  display: flex;
`

const VaultRow = styled.tr`
  cursor:pointer;
  &:hover {
    background-color: #8884;
  }
`
interface VaultCardProps {
  vault: Vault
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  ethereum?: provider
  account?: string
}

const VaultHarvestCard: React.FC<VaultCardProps> = ({ vault, ethereum, cakePrice, bnbPrice, account }) => {
  const TranslateString = useI18n()
  const { reloadToken, reward, } = useVaultHarvestReward(vault, account)
  const { onHarvest, loading } = useVaultHarvest(vault, "")

  const farmImage = vault.tokenSymbol.toLowerCase().replace(" lp", "")

  return (
    <>
      <VaultRow style={{ borderBottom: `solid 2px #8884` }}>
        <td style={{ width: "200px", minWidth: "200px" }}>
          <Flex flexDirection="row" alignItems="center" >
            <Image src={`/images/farms/${farmImage}.png`} width={40} height={40} marginLeft="2" marginRight="2" />
            <span style={{ fontSize: '20px' }}>{vault.tokenSymbol}</span>
          </Flex>
        </td>
        <td style={{ textAlign: "left" }}>
          <Flex>
            <CardValue value={Number(reward)} decimals={8} prefix="" fontSize="inherit"/>
            <Spacer/>
            <b> {vault.harvestReward || vault.tokenSymbol }  </b>
          </Flex>
          {/* {Number(reward).toFixed(8)} {rewardToken} */}
        </td>
        <td style={{ textAlign: "left" }}>
          <Button onClick={() => onHarvest().then(reloadToken)} size="sm" disabled={loading}>
            Harvest
          </Button>
        </td>
      </VaultRow>
    </>
  )
}

export default VaultHarvestCard
