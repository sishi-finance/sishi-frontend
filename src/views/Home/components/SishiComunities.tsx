import { Link } from "@pancakeswap-libs/uikit"
import React from "react"
import styled from 'styled-components'
import {
  DiscordIcon, TelegramIcon, TwitterIcon,
  GithubIcon, DAppRadarIcon, CoingeckoIcon,
  CoinpaprikaIcon, MediumIcon, Publish0xIcon, GitbookIcon,
} from "../icons"



const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: center;
  margin-bottom: 8px;
  > * {
    margin: 0.4em;
    > svg {
      width: 2.5em;
    }
  }

`


const SishiCommunities = () => {


  return (
    <Row>
      <Link external href="https://t.me/sishi_finance" title="Telegram">
        <TelegramIcon />
      </Link>
      <Link external href="https://discord.com/invite/aGQsMxmZbK" title="Discord">
        <DiscordIcon />
      </Link>
      <Link external href="https://twitter.com/0xsishi" title="Twitter">
        <TwitterIcon />
      </Link>
      <Link external href="https://github.com/sishi-finance" title="Github">
        <GithubIcon />
      </Link>
      <Link external href="https://dappradar.com/binance-smart-chain/defi/sishi-finance" title="DAppRadar">
        <DAppRadarIcon />
      </Link>
      <Link external href="https://www.coingecko.com/en/coins/sishi-finance" title="Coingecko">
        <CoingeckoIcon />
      </Link>
      <Link external href="https://coinpaprika.com/coin/sishi-sishi-token/" title="Coinpaprika">
        <CoinpaprikaIcon />
      </Link>
      <Link external href="https://0xsishi.medium.com" title="Medium">
        <MediumIcon />
      </Link>
      <Link external href="https://www.publish0x.com/sishi-finance" title="Publish0x">
        <Publish0xIcon />
      </Link>
      {/* <Link external href="https://docs.sishi.finance">
        <GitbookIcon />
      </Link> */}
    </Row>
  )
}

export default SishiCommunities
