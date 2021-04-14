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

class Request {
  constructor(
    public address: string,
    public method: string,
    public params: any[],
    public callDefine: CallDefine,
    public resolve: (e) => any,
    public reject: (e) => any,
  ) { }
}

class Pool {
  private queue: Request[] = []
  private abiMap: Record<string, CallDefine> = {}

  public counter = 0
  public processing = 0
  public pending = 0
  public success = 0

  get abi() {
    return Object.entries(this.abiMap)
  }

  private addToABI(req: Request): boolean {
    if (this.abiMap[req.method]) {
      this.abiMap[req.method] = req.callDefine
      return true
    } else if (equal(this.abiMap[req.method], req.callDefine)) {
      return true
    }
  }

  private addToRequestPools(req: Request) {
    this.queue.push(req)
  }

  addToPool(req: Request): boolean {
    if (this.addToABI(req)) {
      this.addToRequestPools(req)
      this.counter++;
      this.pending++;
      return true
    }
    return false
  }

  private async executePool() {
    const queue = this.queue
    const abi = this.abi

    this.queue = []
    this.abiMap = {}
    this.processing += queue.length
    this.pending -= queue.length


    const allResult = await multicall(
      abi,
      queue.map(e => ({
        address: e.address,
        name: e.method,
        params: e.params,
      }))
    )

    console.log({ queue, allResult })

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
    clearTimeout(this._timeout)
    this._timeout = setTimeout(
      this.executePool.bind(this),
      200,
    )
  }
}


let pools: Pool[] = []

export function callMethodWithPool(
  address: string,
  abi: any[],
  method: string,
  params: []
): Promise<any> {
  let callDefine: CallDefine = abi.find(e => e.type == "function" && e.name == method)

  return new Promise((resolve, reject) => {
    let request = new Request(
      address,
      method,
      params,
      callDefine,
      resolve,
      reject
    )

    for (let pool of pools) {
      if (pool.addToPool(request))
        return
    }
    let pool = new Pool()
    pool.addToPool(request)
  })

}