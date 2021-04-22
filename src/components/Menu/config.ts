import { MenuEntry } from '@pancakeswap-libs/uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: 'https://exchange.sishi.finance/#/swap?inputCurrency=BNB&outputCurrency=0x8e8538c75f273ab2df6adeecd3622a9c314fccf3',
        // newTab: true,
      },
      {
        label: 'Liquidity',
        href: 'https://exchange.sishi.finance/#/add/0xe9e7cea3dedca5984780bafc599bd69add087d56/0x8E8538c75f273aB2dF6AdEEcD3622A9c314fcCf3',
        // newTab: true,
      },
    ],
  },
  {
    label: 'sFarm',
    icon: 'FarmIcon',
    href: '/farms',
  },
  // {
  //   label: 'Staking',
  //   icon: 'PoolIcon',
  //   href: '/nests',
  // },
  {
    label: 'sVault',
    icon: 'VaultIcon',
    href: '/vaults',
  },
  {
    label: 'sEarn',
    icon: 'VaultIcon',
    href: '/vault-workers',
  },
  // {
  //   label: 'Pools',
  //   icon: 'PoolIcon',
  //   href: '/pools',
  // },
  // {
  //   label: 'Lottery',
  //   icon: 'TicketIcon',
  //   href: '/lottery',
  // },
  // {
  //   label: 'NFT',
  //   icon: 'NftIcon',
  //   href: '/nft',
  // },
  // {
  //   label: 'Info',
  //   icon: 'InfoIcon',
  //   items: [
  //     {
  //       label: 'PancakeSwap',
  //       href: 'https://pancakeswap.info/token/0x8e8538c75f273ab2df6adeecd3622a9c314fccf3',
  //     },
  //     {
  //       label: 'CoinGecko',
  //       href: 'https://www.coingecko.com/en/coins/sishi-finance',
  //     },
  //   ],
  // },

  {
    label: 'Audit',
    icon: 'AuditIcon',
    href:'https://docs.sishi.finance/security/audit',
    newTab: true,
  },
  {
    label: 'Governance',
    icon: 'GroupsIcon',
    href:'https://snapshot.org/#/sishi.eth',
    newTab: true,
  },
  {
    label: 'Listing',
    icon: 'LayerIcon',
    items: [
      {
        label: 'DappRadar',
        href: 'https://dappradar.com/binance-smart-chain/defi/sishi-finance',
        newTab: true,
      },
      // {
      //   label: 'PancakeSwap',
      //   href: 'https://exchange.pancakeswap.finance/#/swap?inputCurrency=BNB&outputCurrency=0x8e8538c75f273ab2df6adeecd3622a9c314fccf3',
      //   newTab: true,
      // },
      // {
      //   label: 'Resfinex',
      //   href: 'https://trade.resfinex.com/trade/SISHI_USDT',
      //   newTab: true,
      // },
      {
        label: 'CoinGecko',
        href: 'https://www.coingecko.com/en/coins/sishi-finance',
        newTab: true,
      },
      {
        label: 'Coinpaprika',
        href: 'https://coinpaprika.com/coin/sishi-sishi-token/',
        newTab: true,
      },
    ],
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    items: [
      {
        label: 'Github',
        href: 'https://github.com/sishi-finance/',
        newTab: true,
      },
      {
        label: 'Docs',
        href: 'https://docs.sishi.finance',
        newTab: true,
      },
      {
        label: 'Medium',
        href: 'https://0xsishi.medium.com/',
        newTab: true,
      },
      {
        label: 'Publish0x',
        href: 'https://www.publish0x.com/sishi-finance',
        newTab: true,
      },
    ],
  },
]

export default config
