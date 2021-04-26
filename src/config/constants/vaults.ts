import contracts from "./contracts"
import { QuoteToken } from "./types"

export interface Vault {
  tokenSymbol: string,
  tag: string[],
  farmPid: number,
  isTokenOnly: boolean,
  tokenAddress: string,
  vault?: string,
  strategy?: string,
  fromBlock?: number,
  harvestReward?: string,
  disableDeposit?: boolean,
  lpToken?: {
    baseAddress?: string,
    address:string,
    quoteAddress: string,
    quote: string,
  }
}


export interface VaultWithData extends Vault {
  roiLoaded: boolean,
  reloadToken: () => void,
  calc?: {
    roiHour: number,
    roiDay: number,
    roiWeek: number,
    roiMonth: number,
    roiYear: number,
    apy: number,
    apr: number,
    tvl: number,
    balance: number,
    walletBalance: number,
    vaultApproved: boolean,
  }
}

export const MasterChefVaultAddress = "0x94fe35FBDc43f97F4b536B22e2d76BDdC55f9a2b"
export const ControllerVaultAddress = "0x9bf4a4ff8c8505bf75aab566a9b5dd635a68f837"

export const vaultLists: Vault[] = [
  {
    tokenSymbol: "BUSD",
    isTokenOnly: true,
    tokenAddress: contracts.busd[56],
    tag: ["Venus","Deprecated"],
    farmPid: 1,
    vault: "0x80C93DF954af9E61DaF72CEC19B51041c1C8fA09",
    strategy: "0xF81D859a4Ed3877F8e81a9090D5a6B1482c07181",
    fromBlock: 6531895,
    harvestReward: "XVS",
    disableDeposit: true,
  },
  {
    tokenSymbol: "CAKE",
    isTokenOnly: true,
    tokenAddress: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
    tag: ["Pancake"],
    farmPid: 2,
    vault: "0xFD3d66E7ed01761e0B83a632736Da5F2F68acde8",
    strategy: "0x4581bdb0c086bDC5AFE17D27F50Fc011a144Deac",
    fromBlock: 6533850,
    harvestReward: "CAKE",
    lpToken: {
      address:'0x0Ed8E0A2D99643e1e65CCA22Ed4424090B8B7458',
      quoteAddress: contracts.busd[56],
      quote: QuoteToken.BUSD,
    }
  },
  // {
  //   tokenSymbol: "ETH-BNB LP",
  //   isTokenOnly: false,
  //   tokenAddress: "0x70d8929d04b60af4fb9b58713ebcf18765ade422",
  //   tag: ["Pancake"],
  //   farmPid: 6,
  //   vault: "0x30cd4c7fC04dd15072047918e79CdD23Dae4Cc39",
  //   strategy: "0xF37111949b12D86229c63B2d1Ad0df3880C9a884",
  //   fromBlock: 6535717,
  //   harvestReward: "CAKE",
  //   lpToken: {
  //     address:'0x70d8929d04b60af4fb9b58713ebcf18765ade422',
  //     quoteAddress: contracts.wbnb[56],
  //     quote: QuoteToken.BNB,
  //   }
  // },
  // {
  //   tokenSymbol: "CAKE-BNB LP",
  //   isTokenOnly: false,
  //   tokenAddress: "0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6",
  //   tag: ["Pancake"],
  //   farmPid: 10,
  //   vault: "0xF6b2B95f8c09aB726EC6fE50848970d77C2d50c9",
  //   strategy: "0xBF3a27c5083B31Ac479891499fff84407c524f84",
  //   fromBlock: 6704280,
  //   harvestReward: "CAKE",
  //   lpToken: {
  //     address:'0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6',
  //     quoteAddress: contracts.wbnb[56],
  //     quote: QuoteToken.BNB,
  //   }
  // },
  // {
  //   tokenSymbol: "BNB-BUSD LP",
  //   isTokenOnly: false,
  //   tokenAddress: "0x1B96B92314C44b159149f7E0303511fB2Fc4774f",
  //   tag: ["Pancake"],
  //   farmPid: 12,
  //   vault: "0xbbc7f3ee742a4a2fda8313350eb132bce4cc528e",
  //   strategy: "0x8D20701B35C611A36720F0De40c2c8BeFCaD5968",
  //   fromBlock: 6735000,
  //   harvestReward: "CAKE",
  //   lpToken: {
  //     address:'0x1B96B92314C44b159149f7E0303511fB2Fc4774f',
  //     quoteAddress: contracts.busd[56],
  //     quote: QuoteToken.BUSD,
  //   }
  // },

  {
    tokenSymbol: "BNB-BUSD LP",
    isTokenOnly: false,
    tokenAddress: "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16",
    tag: ["Pancake","PCS v2"],
    farmPid: 13,
    vault: "0x698E8923a9acFA361E40e7Bd34d6F429f5910d59",
    strategy: "0xe79e12092F82B36C118bB1CcC821793711095aDe",
    fromBlock: 6873636,
    harvestReward: "CAKE",
    lpToken: {
      address:'0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
      baseAddress: contracts.wbnb[56],
      quoteAddress: contracts.busd[56],
      quote: QuoteToken.BUSD,
    }
  },
  {
    tokenSymbol: "USDC-BUSD LP",
    isTokenOnly: false,
    tokenAddress: "0x2354ef4DF11afacb85a5C7f98B624072ECcddbB1",
    tag: ["Pancake","PCS v2"],
    farmPid: 14,
    vault: "0x17AFF78AE776a67d3560f60E0b045Ae755D47581",
    strategy: "0x16bb754AbB883F89D4F731628f8A43AB66453963",
    fromBlock: 6895768,
    harvestReward: "CAKE",
    lpToken: {
      address:'0x2354ef4DF11afacb85a5C7f98B624072ECcddbB1',
      baseAddress: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      quoteAddress: contracts.busd[56],
      quote: QuoteToken.BUSD,
    }
  },

  // {
  //   tokenSymbol: "XVS",
  //   isTokenOnly: true,
  //   tokenAddress: "0xcf6bb5389c92bdda8a3747ddb454cb7a64626c63",
  //   tag: ["Venus"],
  //   farmPid: 12,
  //   vault: "0x451C79bcDa7608D7824394e384160EfFf47Fe8b8",
  //   strategy: "0x6B23B55B576657D0E7D0963aEb21b528396DBDac"
  // },
  {
    tokenSymbol: "VAI",
    isTokenOnly: true,
    tokenAddress: "0x4bd17003473389a42daf6a0a729f6fdb328bbbd7",
    tag: ["Venus","Deprecated"],
    farmPid: 3,
    vault: "0x0f4B0c695418893A8eEfB3eD8D18880147Ef8B18",
    strategy: "0xf7C30769e700d3af6b3347b36Ac663797588b3fD",
    fromBlock: 6563549,
    harvestReward: "XVS",
    disableDeposit: true,
    lpToken: {
      address:'0xff17ff314925dff772b71abdff2782bc913b3575',
      quoteAddress: contracts.busd[56],
      quote: QuoteToken.BUSD,
    },
  },
  {
    tokenSymbol: "SXP",
    isTokenOnly: true,
    tokenAddress: "0x47bead2563dcbf3bf2c9407fea4dc236faba485a",
    tag: ["Venus","Deprecated"],
    farmPid: 4,
    vault: "0xf8f10825C54A54A8d07D9330c7F96563D57252E2",
    strategy: "0xAB9c148C08cAB3e56Bb8ca2Cd0B240384184E26d",
    fromBlock: 6563997,
    harvestReward: "XVS",
    disableDeposit: true,
    lpToken: {
      address:'0x2f82286c2178e9144f2a7b8d27d5b3203253cba4',
      quoteAddress: contracts.busd[56],
      quote: QuoteToken.BUSD,
    },
  },
  {
    tokenSymbol: "ZEFI",
    isTokenOnly: true,
    tokenAddress: "0x0288D3E353fE2299F11eA2c2e1696b4A648eCC07",
    tag: ["Zcore"],
    farmPid: 7,
    vault: "0x66025f732A5B20dD631EDbA9AAE0665A6B869071",
    strategy: "0xEA2BFb782DB37EbcBc1E16C87CCCB2b9656477dA",
    fromBlock: 6668865,
    harvestReward: "ZEFI",
    lpToken: {
      address:'0x24B87c29e907D6329ED8fD6d7B2ecb074089093E',
      quoteAddress: contracts.busd[56],
      quote: QuoteToken.BUSD,
    },
  },
  {
    tokenSymbol: "ZEFI-BUSD LP",
    isTokenOnly: false,
    tokenAddress: "0x24b87c29e907d6329ed8fd6d7b2ecb074089093e",
    tag: ["Zcore"],
    farmPid: 11,
    vault: "0xCfb0b3b8D59dAa46060A631e338835EE205C5968",
    strategy: "0x79EAaA9Bf7Fd41Ed7f0c76BCe02B7491A9704d01",
    fromBlock: 6707356,
    harvestReward: "ZEFI",
    lpToken: {
      address:'0x24b87c29e907d6329ed8fd6d7b2ecb074089093e',
      quoteAddress: contracts.busd[56],
      quote: QuoteToken.BUSD,
    },
  },
  {
    tokenSymbol: "KEBAB",
    isTokenOnly: true,
    tokenAddress: "0x7979F6C54ebA05E18Ded44C4F986F49a5De551c2",
    tag: ["Kebab"],
    farmPid: 8,
    vault: "0x189a45ac7C1DA043230eBc7EE52B2502eD577E3B",
    strategy: "0x1A6383342530cDFd1479c6Ee9cBfd1e8B29493fC",
    fromBlock: 6670700,
    harvestReward: "KEBAB",
    lpToken: {
      address:'0xd51bee2e0a3886289f6d229b6f30c0c2b34fc0ec',
      quoteAddress: contracts.busd[56],
      quote: QuoteToken.BUSD,
    },
  },
  {
    tokenSymbol: "CUB",
    isTokenOnly: true,
    tokenAddress: "0x50D809c74e0B8e49e7B4c65BB3109AbE3Ff4C1C1",
    tag: ["Cub"],
    farmPid: 9,
    vault: "0xF13dee95D0Db201ba3B7344Cf2f7EdfE23Ba9Ed1",
    strategy: "0x7f9Ef40dF13D7D1497024cD5Dc9F3A66870F3cF8",
    fromBlock: 6671953,
    harvestReward: "CUB",
    lpToken: {
      address:'0x0EF564D4F8D6C0ffE13348A32e21EFd55e508e84',
      quoteAddress: contracts.busd[56],
      quote: QuoteToken.BUSD,
    },
  },

]