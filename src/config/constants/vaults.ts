import contracts from "./contracts"

export interface Vault {
  tokenSymbol: string,
  tag: string[],
  farmPid: number,
  isTokenOnly: boolean,
  tokenAddress: string,
}


export interface VaultWithData extends Vault {
  roiLoaded: boolean,
  vault?: string,
  strategy?: string,
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
  }
}

export default <Record<string, { vault, strategy }>>{
  BUSD: {
    vault: "0x532d5775ce71cb967b78acbc290f80df80a9baa5",
    // strategy: "0x7f21fa61e0919c6d0970de835d4c575b54ed1071"
    // vault: "0x93bc288e000b843bcb463e04b558f20c0b2d5719",
    strategy: "0x7f21fa61e0919c6d0970de835d4c575b54ed1071"
  }
}


export const vaultLists: Vault[] = [
  {
    tokenSymbol: "BUSD",
    isTokenOnly: true,
    tokenAddress: contracts.busd[56],
    tag: ["venus", "stable coin"],
    farmPid: 10,
  }
]