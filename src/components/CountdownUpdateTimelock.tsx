import React from 'react'
import styled from 'styled-components'
import Countdown from "react-countdown";
import { Heading, Text, LinkExternal } from '@pancakeswap-libs/uikit'


const CountdownRender: React.FC<{
  total: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number,
  completed: boolean,
}> = ({ days, hours, minutes, seconds, completed }) => {
  return !completed && <>
    <div style={{ textAlign: 'center', marginBottom: "1em" }}>
      <Text>
        The 
        <a href="https://bscscan.com/tx/0x33f34ddb1ee1592f3706eecf958f8b8cfd6e308b204ebc168f0f0840fce9c2eb" target="_blank" rel="noreferrer"> delay </a>
        in the Timelock contract of Sishi Finance 
        <br/>
        will change from <b>6h</b> to <b>48h</b>
        <> in </>
        {days > 0 && <> {days} day{days > 1 ? "s" : ""} </>}
        <> {String(hours).padStart(2, "0")} hour{hours > 1 ? "s" : ""} </>
        <> {String(minutes).padStart(2, "0")} minute{minutes > 1 ? "s" : ""} </>
        <> {String(seconds).padStart(2, "0")} second{seconds > 1 ? "s" : ""} </>
      </Text>
      {/* <LinkExternal marginX="auto" href="https://docs.sishi.finance/sishi-token/sishi-halving" target="_blank" rel="noreferrer noopener">
        <div style={{ overflow: "hidden", maxWidth: "calc(100vw - 8em)", textOverflow: "ellipsis" }} >
        https://docs.sishi.finance/sishi-token/sishi-halving
        </div>
      </LinkExternal> */}

    </div>

  </>
}
const CountdownComponent: React.FC = () => {

  return <Countdown date={Date.parse('4/14/2021, 10:00:00 PM GMT+7')} renderer={CountdownRender} />
}

export default styled(CountdownComponent)`
  margin: 2em;
`
