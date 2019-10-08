import { handler } from './handlers.js'

export function reactive(target) {
  const observed = new Proxy(target, handler)
  return observed
}
