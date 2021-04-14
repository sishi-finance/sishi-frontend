import { Contract } from "web3-eth-contract";
import equal from "deep-equal"
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



class Pool {
  private queue: Request[] = []

  private abiMap: Record<string, CallDefine> = {}

  public counter = 0

  public processing = 0

  public pending = 0

  public success = 0

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
    console.log("[Pool] executePool")

    const queue = this.queue
    const abi = this.abi

    this.queue = []
    this.abiMap = {}
    this.processing += queue.length
    this.pending -= queue.length

    console.log("[Pool] ABI",{ queue, abi })

    const allResult = await multicall(
      abi,
      queue.map(e => ({
        address: e.address,
        name: e.method,
        params: e.params,
      }))
    )


    queue.forEach((call, index) => {
      try {
        call.resolve(allResult[index])
      } catch (error) {
        console.error(error)
      }
    });

    this.processing -= queue.length
    this.success += queue.length

  }

  _timeout: any

  private throttleExecutePool() {
    console.log("[Pool] throttleExecutePool")

    clearTimeout(this._timeout)
    this._timeout = setTimeout(
      this.executePool.bind(this),
      200,
    )
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