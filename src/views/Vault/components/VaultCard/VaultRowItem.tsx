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

type VaultRowItemInfo = {
  expand, onExpandClick, tag, roiDay,
  apy, farmImage,
  tokenSymbol, yieldTVLUSD, walletBalanceUSD
}

const VaultRowItem: React.FC<VaultRowItemInfo> = ({ expand, onExpandClick, tag, roiDay, apy, farmImage, tokenSymbol, yieldTVLUSD, walletBalanceUSD }) => {
  return <VaultRowStyled style={{ borderBottom: expand ? 'none' : `solid 2px #8884` }} onClick={onExpandClick}>
    <td style={{ width: "200px", minWidth: "200px" }}>
      <Flex flexDirection="row" alignItems="center" >
        <Image src={`/images/farms/${farmImage}.png`} width={40} height={40} marginLeft="2" marginRight="2" />
        <span style={{ fontSize: '20px' }}>{tokenSymbol}</span>
      </Flex>
    </td>
    <td style={{ textAlign: "left" }}>
      {tag.map(e => <>
        <Tag >{e}</Tag>
        {" "}
      </>)}
    </td>
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
      $ {getBalanceNumber(walletBalanceUSD).toFixed(2)}
    </td>
  </VaultRowStyled>
}

export default VaultRowItem