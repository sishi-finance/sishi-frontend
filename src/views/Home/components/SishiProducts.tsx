import React from 'react'
import { Card, CardBody, Heading, Link, Text } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js/bignumber'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import useI18n from 'hooks/useI18n'
import { getCakeAddress } from 'utils/addressHelpers'
import CardValue from './CardValue'
import { useFarms, usePriceCakeBusd, useTotalValue } from '../../../state/hooks'


const Table = styled('table')`
  width 100%;
  color: ${({ theme }) => theme.colors.text};
  th, td {
    padding 0.5em 0.3em;
    text-align left;
    white-space nowrap;
    font-family monospace;
    font-weight bold;
  }

  th, td {
    &:first-child,&:nth-child(2)  {
      text-align left;
    }
  }
  .highlight {
    // background-color: ${({ theme }) => theme.colors.backgroundDisabled};
    color: ${({ theme }) => theme.colors.primary};
  }
  thead {
    tr {
      background-color: ${({ theme }) => theme.colors.background};
      border-bottom: solid 1px ${({ theme }) => theme.colors.borderColor};
      th {
      }
    }
  }
  tbody {
    tr {
      border-bottom: solid 1px ${({ theme }) => theme.colors.borderColor};
      td {


      }
    }
    tr:nth-child(2n){
      background-color: ${({ theme }) => theme.colors.background};
    }


  }
`



const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;

`

const ProductSection = styled.div`
  align-items: center;
  flex: 1;
  // border-right: solid #8888 1px; 
  padding: 0 1em;
  text-align: center;
  min-width: 32%;
`

const HeadRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`

const SishiProducts = () => {


  return (
    <div>
      <Table>
        <tbody>
          <tr>
            <td>
              <Link href="/farms" fontSize="12" marginRight="3">sFarm</Link>
            </td>
            <td>The First Yield-Of-Value on BSC</td>
            <td>
              In Production
              {/* <Link href="/farms" fontSize="12" marginRight="3">Earn up to 1000% APY in sFarm</Link> */}
            </td>
          </tr>
          <tr>
            <td>
              <Link href="/vaults" fontSize="12" marginRight="3">sVault</Link>
            </td>
            <td>Advance Yield Optimization Strategy</td>
            <td>
              In Beta Testing
            </td>
          </tr>
          <tr>
            <td>
              <Link href="/#" fontSize="12" marginRight="3">sTerminal</Link>
            </td>
            <td>Advanced Yield Farming Portfolio Management</td>
            <td>In Development</td>
          </tr>
          <tr>
            <td>
              <Link href="/#" fontSize="12" marginRight="3">sStableSwap</Link>
            </td>
            <td>Stable Asset Swap on BSC</td>
            <td>In Development</td>
          </tr>
          <tr>
            <td>
              <Link href="/#" fontSize="12" marginRight="3">sDEX</Link>
            </td>
            <td>Advanced DEX on BSC</td>
            <td>In Planning </td>
          </tr>
          <tr>
            <td>
              <Link href="/#" fontSize="12" marginRight="3">sOption</Link>
            </td>
            <td>The First Option Trading on BSC</td>
            <td>In Planning </td>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}

export default SishiProducts
