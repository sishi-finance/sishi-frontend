import React, { useState, useEffect, useRef } from 'react'
import { getWeb3 } from 'utils/web3'

const BlockContext = React.createContext(0)

const BlockContextProvider = ({ children }) => {
  const previousBlock = useRef(0)
  const [block, setBlock] = useState(0)

  useEffect(() => {
    const web3 = getWeb3()
    const isConnected = web3.eth.net
      .isListening()
      
    const update = async () => {

      const blockNumber = await web3.eth.getBlockNumber()
      if (blockNumber !== previousBlock.current) {
        previousBlock.current = blockNumber
        setBlock(blockNumber)
      }
    }
    const interval = setInterval(update, 6000)
    
    isConnected
      .then(e => console.log("[web3] connected"))
      .then(e => update())

    return () => clearInterval(interval)
  }, [])

  return <BlockContext.Provider value={block}>{children}</BlockContext.Provider>
}

export { BlockContext, BlockContextProvider }
