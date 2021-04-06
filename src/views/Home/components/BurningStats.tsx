import React, { useEffect, useState } from 'react'
import { Card, CardBody, Heading, LinkExternal, } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js/bignumber'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import useI18n from 'hooks/useI18n'
import { getCakeAddress } from 'utils/addressHelpers'
import { useCake } from 'hooks/useContract'
import CardValue from './CardValue'
import { useFarms, usePriceCakeBusd } from '../../../state/hooks'

const StyledCakeStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const Table = styled('table')`
  width 100%;
  th, td {
    padding 0.5em 0.3em;
    text-align right;
    white-space nowrap;
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

const BurningStats = () => {
  const TranslateString = useI18n()
  const [burningData, setBurningData] = useState([])
  const [isLoadBurningData, setLoadBurningData] = useState(false)


  useEffect(() => {
    setLoadBurningData(true)
    fetch("https://api.sishi.finance/api/burning")
      .then(e => e.json())
      .then(e => setBurningData((e.result || []).reverse()))
      .finally(() => setLoadBurningData(false))
  }, []);


  return (
    <StyledCakeStats>
      <CardBody>
        <Heading size="xl" mb="24px">
          {TranslateString(100534, 'Sishi Burning Stats')}
        </Heading>
        <Row>
          <Table>
            <thead>
              <tr>
                <th>Block</th>
                {/* <th>Address</th> */}
                {/* <th>Tx</th> */}
                <th>Amount</th>
                <th>Price</th>
                <th>Total</th>
                <th className="time">Time</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {
                burningData.slice(0,5).map(
                  (
                    { blockNumber, address, transactionHash, timestamps, amount, price, }) => <tr>
                      <td>{blockNumber}</td>
                      {/* <td>{address.slice(0,6)}...</td> */}
                      {/* <td>{transactionHash.slice(0,6)}...</td> */}
                      <td>{amount.toFixed(2)}</td>
                      <td>${price.toFixed(2)}</td>
                      <td>${(price * amount).toFixed(2)}</td>
                      <td className="time">{new Date(timestamps).toLocaleString()}</td>
                      <td className="link1">
                        <LinkExternal color="primary" fontSize="10" small href={`https://bscscan.com/tx/${transactionHash}`}> </LinkExternal>
                      </td>
                    </tr>
                )
              }

            </tbody>
          </Table>
        </Row>

      </CardBody>
    </StyledCakeStats>
  )
}

export default BurningStats
