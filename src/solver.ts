export interface GompertzParams {
  a: number,
  b: number,
  c: number,
}

export function solve(
  values: number[], fun: (t: number, ...args: number[]) => number
): GompertzParams | undefined {
  const A_MIN = 1
  const A_MAX = 200
  const B_MIN = 5
  const B_MAX = 20
  const C_MIN = 20
  const C_MAX = 200
  const stepsize = 1

  let result: GompertzParams | undefined
  let leastRes: number | undefined
  for (let i = A_MIN; i <= A_MAX; i = i + stepsize) {
    for (let j = B_MIN; j <= B_MAX; j = j + stepsize) {
      for (let k = C_MIN; k <= C_MAX; k = k + stepsize) {
        const res = _getResidual(values, fun, i * 100000, -j, -k / 1000)
        if (!leastRes || res < leastRes) {
          leastRes = res
          result = { a: i * 100000, b: -j, c: -k / 1000 }
        }
      }
    }
  }
  return result
}

function _getResidual(
  values: number[],
  fun: (t: number, ...funArgs: number[]) => number,
  ...args: number[]
): number {
  let result = 0
  let t = 0

  for (const value of values) {
    const res = value - fun(t, ...args)
    result += Math.pow(res, 2)
    t++
  }

  return result
}
