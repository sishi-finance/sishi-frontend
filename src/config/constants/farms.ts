import contracts from './contracts'
import { FarmConfig, QuoteToken } from './types'

const farms: FarmConfig[] = [
  {
    pid: 0,
    risk: 5,
    lpSymbol: 'SISHI',
    lpAddresses: {
      97: '',
      56: '0x672e7976558eD2E6C3f99c0CD7C92a9eec01e9FB',
    },
    tokenSymbol: 'SISHI',
    isTokenOnly: true,
    tokenAddresses: {
      97: '',
      56: '0x8E8538c75f273aB2dF6AdEEcD3622A9c314fcCf3',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 1,
    risk: 5,
    lpSymbol: 'SISHI-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x672e7976558eD2E6C3f99c0CD7C92a9eec01e9FB',
    },
    tokenSymbol: 'SISHI',
    tokenAddresses: {
      97: '',
      56: '0x8E8538c75f273aB2dF6AdEEcD3622A9c314fcCf3',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 2,
    risk: 5,
    lpSymbol: 'SISHI-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xd5f575fcfae274b4fc65069b3c7e43212812f7e6',
    },
    tokenSymbol: 'SISHI',
    tokenAddresses: {
      97: '',
      56: '0x8E8538c75f273aB2dF6AdEEcD3622A9c314fcCf3',
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
  },
  {
    pid: 3,
    risk: 3,
    lpSymbol: 'BNB-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x1b96b92314c44b159149f7e0303511fb2fc4774f',
    },
    tokenSymbol: 'BNB',
    tokenAddresses: {
      97: '',
      56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 4,
    risk: 1,
    lpSymbol: 'USDC-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x680dd100e4b394bda26a59dd5c119a391e747d18',
    },
    tokenSymbol: 'USDC',
    tokenAddresses: {
      97: '',
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 5,
    risk: 3,
    isTokenOnly: true,
    lpSymbol: 'WBNB',
    lpAddresses: {
      97: '',
      56: '0x1b96b92314c44b159149f7e0303511fb2fc4774f', // BNB-BUSD LP
    },
    tokenSymbol: 'WBNB',
    tokenAddresses: {
      97: '',
      56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 6,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'BUSD',
    lpAddresses: {
      97: '',
      56: '0x19e7cbecdd23a16dfa5573df54d98f7caae03019', // EGG-BUSD LP (BUSD-BUSD will ignore)
    },
    tokenSymbol: 'BUSD',
    tokenAddresses: {
      97: '',
      56: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },

  {
    pid: 7,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'CAKE',
    lpAddresses: {
      97: '',
      56: '0x0Ed8E0A2D99643e1e65CCA22Ed4424090B8B7458',
    },
    tokenSymbol: 'CAKE',
    tokenAddresses: {
      97: '',
      56: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 8,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'BAKE',
    lpAddresses: {
      97: '',
      56: '0xE2D1B285d83efb935134F644d00FB7c943e84B5B',
    },
    tokenSymbol: 'BAKE',
    tokenAddresses: {
      97: '',
      56: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 9,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'EGG',
    lpAddresses: {
      97: '',
      56: '0x19e7cbECDD23A16DfA5573dF54d98F7CaAE03019',
    },
    tokenSymbol: 'EGG',
    tokenAddresses: {
      97: '',
      56: '0xF952Fc3ca7325Cc27D15885d37117676d25BfdA6',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 10,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'AUTO',
    lpAddresses: {
      97: '',
      56: '0x7723fe13747Cf31496dA38C5038160A40200BF8e',
    },
    tokenSymbol: 'AUTO',
    tokenAddresses: {
      97: '',
      56: '0xa184088a740c695E156F91f5cC086a06bb78b827',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 11,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'KEBAB',
    lpAddresses: {
      97: '',
      56: '0xD51bee2E0A3886289F6D229b6f30c0C2b34fC0Ec',
    },
    tokenSymbol: 'KEBAB',
    tokenAddresses: {
      97: '',
      56: '0x7979F6C54ebA05E18Ded44C4F986F49a5De551c2',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 12,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'BIFI',
    lpAddresses: {
      97: '',
      56: '0xd3F004E303114423f122c78AFDeD4AcfE97675B1',
    },
    tokenSymbol: 'BIFI',
    tokenAddresses: {
      97: '',
      56: '0xCa3F508B8e4Dd382eE878A314789373D80A5190A',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 13,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'BFI',
    lpAddresses: {
      97: '',
      56: '0x8ac323ca340b9c92b21A4F33AAD23393eB7671DD',
    },
    tokenSymbol: 'BFI',
    tokenAddresses: {
      97: '',
      56: '0x81859801b01764D4f0Fa5E64729f5a6C3b91435b',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 14,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'DODO',
    lpAddresses: {
      97: '',
      56: '0xA0d79F295B19d5240276E9226bF3F592e89A1692',
    },
    tokenSymbol: 'DODO',
    tokenAddresses: {
      97: '',
      56: '0x67ee3Cb086F8a16f34beE3ca72FAD36F7Db929e2',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 15,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'SFP',
    lpAddresses: {
      97: '',
      56: '0x4938fd950E39cF7aFf996DA83D2C7e0B13239951',
    },
    tokenSymbol: 'SFP',
    tokenAddresses: {
      97: '',
      56: '0xD41FDb03Ba84762dD66a0af1a6C8540FF1ba5dfb',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 16,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'LIT',
    lpAddresses: {
      97: '',
      56: '0x581c5de0CF860B740fe1fe96d973631bDd157a5B',
    },
    tokenSymbol: 'LIT',
    tokenAddresses: {
      97: '',
      56: '0xb59490aB09A0f526Cc7305822aC65f2Ab12f9723',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  // {
  //   pid: 17,
  //   risk: 1,
  //   isTokenOnly: true,
  //   lpSymbol: 'DITTO',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x406a30CbeB5D52182BB320e268ad6250B24Ff29d',
  //   },
  //   tokenSymbol: 'DITTO',
  //   tokenAddresses: {
  //     97: '',
  //     56: '0x233d91A0713155003fc4DcE0AFa871b508B3B715',
  //   },
  //   quoteTokenSymbol: QuoteToken.BUSD,
  //   quoteTokenAdresses: contracts.busd,
  // },
  {
    pid: 18,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'ALPHA',
    lpAddresses: {
      97: '',
      56: '0x5bA0d670Ea3db79067eE6861b960f06d53712e18',
    },
    tokenSymbol: 'ALPHA',
    tokenAddresses: {
      97: '',
      56: '0xa1faa113cbE53436Df28FF0aEe54275c13B40975',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 19,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'SXP',
    lpAddresses: {
      97: '',
      56: '0x2F82286c2178e9144F2a7b8d27D5B3203253CBA4',
    },
    tokenSymbol: 'SXP',
    tokenAddresses: {
      97: '',
      56: '0x47BEAd2563dCBf3bF2c9407fEa4dC236fAbA485A',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 20,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'TWT',
    lpAddresses: {
      97: '',
      56: '0x65F898950e1759d95b5aae15F452E37c5bbE641e',
    },
    tokenSymbol: 'TWT',
    tokenAddresses: {
      97: '',
      56: '0x4B0F1812e5Df2A09796481Ff14017e6005508003',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  // {
  //   pid: 21,
  //   risk: 1,
  //   isTokenOnly: true,
  //   lpSymbol: 'CTK',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x37d1D3c7611C5Be8aE137735eD28c61c965CADCB',
  //   },
  //   tokenSymbol: 'CTK',
  //   tokenAddresses: {
  //     97: '',
  //     56: '0xA8c2B8eec3d368C0253ad3dae65a5F2BBB89c929',
  //   },
  //   quoteTokenSymbol: QuoteToken.BUSD,
  //   quoteTokenAdresses: contracts.busd,
  // },
  {
    pid: 22,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'CREAM',
    lpAddresses: {
      97: '',
      56: '0xC4d83EeF4723f65cf8D0e7Cb92d4a6F76FFa21ea',
    },
    tokenSymbol: 'CREAM',
    tokenAddresses: {
      97: '',
      56: '0xd4CB328A82bDf5f03eB737f37Fa6B370aef3e888',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 23,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'BURGER',
    lpAddresses: {
      97: '',
      56: '0x4cE6703ca7D76F3E65B884C957249035011866F2',
    },
    tokenSymbol: 'BURGER',
    tokenAddresses: {
      97: '',
      56: '0xAe9269f27437f0fcBC232d39Ec814844a51d6b8f',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 24,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'BUNNY',
    lpAddresses: {
      97: '',
      56: '0xEC7A69A3A5ee177C84855C86cc926cA0BA6275cc',
    },
    tokenSymbol: 'BUNNY',
    tokenAddresses: {
      97: '',
      56: '0xC9849E6fdB743d08fAeE3E34dd2D1bc69EA11a51',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 25,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'BTCB',
    lpAddresses: {
      97: '',
      56: '0xb8875e207EE8096a929D543C9981C9586992eAcb',
    },
    tokenSymbol: 'BTCB',
    tokenAddresses: {
      97: '',
      56: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 26,
    risk: 1,
    isTokenOnly: true,
    lpSymbol: 'ETH',
    lpAddresses: {
      97: '',
      56: '0xd9A0d1F5e02dE2403f68Bb71a15F8847A854b494',
    },
    tokenSymbol: 'ETH',
    tokenAddresses: {
      97: '',
      56: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  }
]

export default farms
