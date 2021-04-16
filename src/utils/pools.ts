import { Contract } from "web3-eth-contract";
import equal from "deep-equal"
import { memoize } from "lodash"
import multicall from "./multicall";

type DataType = "address" | "uint256"

interface CallDefine {
  name: string,
  constant?: boolean
  payable?: false,
  stateMutability?: "nonpayable" | "payable",
  type: "function" | "event"
  anonymous?: boolean,
  inputs: { name: string, type: DataType, indexed?: boolean, }[],
  outputs?: { name: string, type: DataType }[],
}

interface Request {
  address: string,
  method: string,
  params: any[],
  callDefine: CallDefine,
  resolve: (e) => any,
  reject: (e) => any,
}

let poolCount = 0

class Pool {
  private queue: Request[] = []

  private abiMap: Record<string, CallDefine> = {}

  public counter = 0

  public processing = 0

  public pending = 0

  public success = 0

  public callParams = []

  get abi() {
    return Object.values(this.abiMap)
  }

  private addToABI(req: Request): boolean {
    if (!this.abiMap[req.method]) {
      // console.log("[Pool] addToABI", req.method, req.callDefine)

      this.abiMap[req.method] = req.callDefine
      return true
    }
    if (equal(this.abiMap[req.method], req.callDefine)) {
      return true
    }
    return false
  }

  private addToRequestPools(req: Request) {
    // console.log("[Pool] addToRequestPools", req)
    this.queue.push(req)
    this.throttleExecutePool()
  }

  addToPool(req: Request): boolean {
    // console.log("[Pool] addToPool", req)
    if (this.addToABI(req)) {
      this.addToRequestPools(req)
      this.counter++;
      this.pending++;
      return true
    }
    return false
  }

  private async executePool() {
    // console.log("[Pool] executePool")

    const queue = this.queue
    const abi = this.abi
    const poolRunId = poolCount++

    this.queue = []
    this.abiMap = {}
    this.processing += queue.length
    this.pending -= queue.length

    // console.log("[Pool] ABI", { queue, abi })

    console.time(`[Pool] [count:${queue.length}] ${poolRunId}`);

    // console.log(`[Pool] [count:${queue.length}] callParams`, { callParams: this.callParams })

    const allResult = await multicall(
      abi,
      queue.map(e => ({
        address: e.address,
        name: e.method,
        params: e.params,
      })),
      ...this.callParams
    )

    console.timeEnd(`[Pool] [count:${queue.length}] ${poolRunId}`)


    queue.forEach((call, index) => {
      try {
        if (allResult[index] instanceof Error) {
          call.reject(allResult[index])
        } else {
          call.resolve(allResult[index])
        }
      } catch (error) {
        console.error(error)
      }
    });

    this.processing -= queue.length
    this.success += queue.length

  }

  _timeout: any

  private throttleExecutePool() {
    if (this.queue.length >= 100) {
      clearTimeout(this._timeout)
      this.executePool();
    } else {
      clearTimeout(this._timeout)
      this._timeout = setTimeout(
        this.executePool.bind(this),
        20,
      )
    }
  }
}


const pools: Pool[] = []

export default function callMethodWithPool(
  address: string,
  abi: any[],
  method: string,
  params: any[]
): Promise<any> {
  const callDefine: CallDefine = abi.find(e => e.type === "function" && e.name === method)

  return new Promise((resolve, reject) => {
    const request: Request = {
      address,
      method,
      params,
      callDefine,
      resolve,
      reject
    }

    if (!pools.some(pool => pool.addToPool(request))) {
      const pool = new Pool()
      pools.push(pool)
      pool.addToPool(request)
    }

  })

}


export const callMethodWithPoolFactory = memoize(
  (blockNumber: number) => {
    const customPools: Pool[] = []

    return function (
      address: string,
      abi: any[],
      method: string,
      params: any[],
    ): Promise<any> {
      const callDefine: CallDefine = abi.find(e => e.type === "function" && e.name === method)

      return new Promise((resolve, reject) => {
        const request: Request = {
          address,
          method,
          params,
          callDefine,
          resolve,
          reject
        }

        if (!customPools.some(pool => pool.addToPool(request))) {
          const pool = new Pool()
          pool.callParams = [{}, blockNumber]
          customPools.push(pool)
          pool.addToPool(request)
        }

      })

    }
  },
)


export const callMethodWithAccountWithPoolFactory = memoize(
  (account: string) => {
    const customPools: Pool[] = []
    return function (
      address: string,
      abi: any[],
      method: string,
      params: any[],
    ): Promise<any> {
      if (!account)
        return Promise.reject(new Error("Account is requirered"))
      const callDefine: CallDefine = abi.find(e => e.type === "function" && e.name === method)

      return new Promise((resolve, reject) => {
        const request: Request = {
          address,
          method,
          params,
          callDefine,
          resolve,
          reject
        }

        if (!customPools.some(pool => pool.addToPool(request))) {
          const pool = new Pool()
          pool.callParams = [{ from: account }]
          customPools.push(pool)
          pool.addToPool(request)
        }

      })

    }
  },
)