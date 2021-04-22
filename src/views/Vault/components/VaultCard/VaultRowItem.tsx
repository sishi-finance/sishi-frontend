import React, { useCallback, useMemo, useState } from 'react'
import styled from "styled-components"
import { Flex, Text, Skeleton, Image, Tag, Button, LinkExternal } from '@pancakeswap-libs/uikit'
import { getBalanceNumber, prettyNumberByPostfix } from 'utils/formatBalance'


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
  const iconSize = String(tokenSymbol).endsWith(" LP") ? 30 : 25
  const iconMarginY = String(tokenSymbol).endsWith(" LP") ? "-9px" : "0px"
  const iconMarginX = String(tokenSymbol).endsWith(" LP") ? "3.5px" : "6px"
  
  return <VaultRowStyled style={{ borderBottom: expand ? 'none' : `solid 2px #8884` }} onClick={onExpandClick}>
    <td style={{ width: "220px", minWidth: "220px" }}>
      <Flex flexDirection="row" alignItems="center" >
        <Image src={`/images/farms/${farmImage}.png`} width={iconSize} height={iconSize} marginLeft={iconMarginX} marginRight={iconMarginX} marginTop={iconMarginY} marginBottom={iconMarginY} />
        <span>{tokenSymbol}</span>
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
      ${prettyNumberByPostfix(getBalanceNumber(yieldTVLUSD))}
    </td>
    <td>
      ${prettyNumberByPostfix(getBalanceNumber(walletBalanceUSD))}
    </td>
  </VaultRowStyled>
}

export default VaultRowItem