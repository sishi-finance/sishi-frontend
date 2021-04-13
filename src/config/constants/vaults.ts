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
]