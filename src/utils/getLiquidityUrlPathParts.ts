// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.

import contracts from "config/constants/contracts"

// In the URL, using the quote token 'BNB' is represented by 'ETH'
const getLiquidityUrlPathParts = ({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses }) => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  const firstPart = quoteTokenSymbol === 'BNB' ? 'BNB' : quoteTokenAdresses[chainId]
  const secondPart = !!tokenAddresses[chainId] && String(tokenAddresses[chainId]).toLowerCase() === String(contracts.wbnb[chainId]).toLowerCase() 
    ? 'BNB' 
    : tokenAddresses[chainId]
  return `${firstPart}/${secondPart}`
}

export default getLiquidityUrlPathParts
