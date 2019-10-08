import { handler } from './handlers.js'

export const targetMap = new WeakMap()

export function reactive(target) {
  const observed = new Proxy(target, handler)
  return observed
}
