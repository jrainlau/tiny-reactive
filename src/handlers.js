import { reactive } from './reactive.js'
import { track, trigger } from './effect.js'

const isObject = (val) => val !== null && typeof val === 'object'
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)

function createGetter (target, key, receiver) {
  const res = Reflect.get(target, key, receiver)
  track(target, 'get', key)
  return isObject(res)
    ? reactive(res)
    : res
}

function createSetter (target, key, value, receiver) {
  const hadKey = hasOwn(target, key)
  const oldValue = target[key]
  const result = Reflect.set(target, key, value, receiver)
  if (!hadKey) {
    trigger(target, 'add', key)
  } else if (value !== oldValue) {
    trigger(target, 'set', key)
  }

  return result
}

function createDeleteProperty (target, key) {
  const hadKey = hasOwn(target, key)
  const oldValue = target[key]
  const result = Reflect.deleteProperty(target, key)

  if (hadKey) {
    trigger(target, 'delete', key)
  }

  return result
}

export const handler = {
  get: createGetter,
  set: createSetter,
  deleteProperty: createDeleteProperty
}
