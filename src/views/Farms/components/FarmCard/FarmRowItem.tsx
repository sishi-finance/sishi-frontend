import React, { useCallback, useMemo, useState } from 'react'
import styled from "styled-components"
import { Flex, Text, Skeleton, Image, Tag, Button, LinkExternal } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'


const VaultRowStyled = styled.tr`
  cursor:pointer;
  &:hover {
    background-color: #8884;
  }
`

type VaultFarmItemInfo = {
  farmImage, tokenSymbol,
  onExpandClick,
  expand,
  depositFee,
  roiDay,
  apy,
  yieldTVLUSD,
  walletBalanceUSD,
  stakedUSD,
  tokenBalance, 
  stakedBalance,
}

const VaultFarmItem: React.FC<VaultFarmItemInfo> = ({ farmImage, tokenSymbol, onExpandClick, expand, depositFee, roiDay, apy, yieldTVLUSD, walletBalanceUSD, stakedUSD }) => {
  return <VaultRowStyled style={{ borderBottom: expand ? 'none' : `solid 2px #8884` }} onClick={onExpandClick}>
    <td style={{ width: "220px", minWidth: "220px" }}>
      <Flex flexDirection="row" alignItems="center" >
        <Image src={`/images/farms/${farmImage}.png`} width={34} height={34} marginLeft="2" marginRight="2" />
        <span style={{ fontSize: '18px' }}>{tokenSymbol}</span>
      </Flex>
    </td>
    {/* <td>
      {(depositFee * 100).toFixed(2)}%
    </td> */}
    <td>
      {(roiDay * 100).toFixed(2)}%
    </td>
    <td>
      {(apy * 100).toFixed(2)}%
    </td>
    <td>
      $ {getBalanceNumber(yieldTVLUSD).toFixed(2)}
    </td>
    <td>
      $ {getBalanceNumber(stakedUSD).toFixed(2)}
    </td>
    <td>
      $ {getBalanceNumber(walletBalanceUSD).toFixed(2)}
    </td>
  </VaultRowStyled>
}

export default VaultFarmItem