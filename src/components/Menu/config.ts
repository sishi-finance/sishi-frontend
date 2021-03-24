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
      },
      {
        label: 'Liquidity',
        href: 'https://exchange.sishi.finance/#/add/0xe9e7cea3dedca5984780bafc599bd69add087d56/0x8E8538c75f273aB2dF6AdEEcD3622A9c314fcCf3',
      },
    ],
  },
  {
    label: 'Farms',
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: 'Staking',
    icon: 'PoolIcon',
    href: '/nests',
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
    label: 'More',
    icon: 'MoreIcon',
    items: [
      {
        label: 'Github',
        href: 'https://github.com/sishi-finance/',
      },
      {
        label: 'Docs',
        href: 'https://docs.sishi.finance',
      },
      {
        label: 'Blog',
        href: 'https://0xsishi.medium.com/',
      },
    ],
  },
]

export default config
