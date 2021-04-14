import contracts from "./contracts"

export interface Vault {
  tokenSymbol: string,
  tag: string[],
  farmPid: number,
  isTokenOnly: boolean,
  tokenAddress: string,
  vault?: string,
  strategy?: string,
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

export default <Record<string, { vault, strategy }>>{
  BUSD: {
    vault: "0x80C93DF954af9E61DaF72CEC19B51041c1C8fA09",
    strategy: "0xF81D859a4Ed3877F8e81a9090D5a6B1482c07181"
  },
  CAKE: {
    vault: "0xFD3d66E7ed01761e0B83a632736Da5F2F68acde8",
    strategy: "0x4581bdb0c086bDC5AFE17D27F50Fc011a144Deac"
  },
  "ETH-BNB LP": {
    vault: "0x30cd4c7fC04dd15072047918e79CdD23Dae4Cc39",
    strategy: "0xF37111949b12D86229c63B2d1Ad0df3880C9a884"
  },
  XVS: {
    vault: "0x451C79bcDa7608D7824394e384160EfFf47Fe8b8",
    strategy: "0x6B23B55B576657D0E7D0963aEb21b528396DBDac"
  },
  VAI: {
    vault: "0x0f4B0c695418893A8eEfB3eD8D18880147Ef8B18",
    strategy: "0xf7C30769e700d3af6b3347b36Ac663797588b3fD"
  },
  SXP: {
    vault: "0xf8f10825C54A54A8d07D9330c7F96563D57252E2",
    strategy: "0xAB9c148C08cAB3e56Bb8ca2Cd0B240384184E26d"
  },
}


export const vaultLists: Vault[] = [
  {
    tokenSymbol: "BUSD",
    isTokenOnly: true,
    tokenAddress: contracts.busd[56],
    tag: ["Venus"],
    farmPid: 10,
    vault: "0x80C93DF954af9E61DaF72CEC19B51041c1C8fA09",
    strategy: "0xF81D859a4Ed3877F8e81a9090D5a6B1482c07181"
  },
  {
    tokenSymbol: "CAKE",
    isTokenOnly: true,
    tokenAddress: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
    tag: ["Pancake"],
    farmPid: 11,
    vault: "0xFD3d66E7ed01761e0B83a632736Da5F2F68acde8",
    strategy: "0x4581bdb0c086bDC5AFE17D27F50Fc011a144Deac"
  },
  // {
  //   tokenSymbol: "ETH-BNB LP",
  //   isTokenOnly: false,
  //   tokenAddress: "0x70d8929d04b60af4fb9b58713ebcf18765ade422",
  //   tag: ["Pancake"],
  //   farmPid: 11,
  //   vault: "0x30cd4c7fC04dd15072047918e79CdD23Dae4Cc39",
  //   strategy: "0xF37111949b12D86229c63B2d1Ad0df3880C9a884"
  // },
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
    tag: ["Venus"],
    farmPid: 12,
    vault: "0x0f4B0c695418893A8eEfB3eD8D18880147Ef8B18",
    strategy: "0xf7C30769e700d3af6b3347b36Ac663797588b3fD"
  },
  {
    tokenSymbol: "SXP",
    isTokenOnly: true,
    tokenAddress: "0x47bead2563dcbf3bf2c9407fea4dc236faba485a",
    tag: ["Venus"],
    farmPid: 12,
    vault: "0xf8f10825C54A54A8d07D9330c7F96563D57252E2",
    strategy: "0xAB9c148C08cAB3e56Bb8ca2Cd0B240384184E26d"
  },
]