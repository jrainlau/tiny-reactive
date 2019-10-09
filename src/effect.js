export const targetMap = new WeakMap()
export const effectStack = []

export function track (target, operationType, key) {
  const effect = effectStack[effectStack.length - 1]
  if (effect) {
    let depsMap = targetMap.get(target)
    if (depsMap === void 0) {
      targetMap.set(target, (depsMap = new Map()))
    }

    let dep = depsMap.get(key)
    if (dep === void 0) {
      depsMap.set(key, (dep = new Set()))
    }

    if (!dep.has(effect)) {
      dep.add(effect)
    }
  }
}

export function trigger (target, operationType, key) {
  const depsMap = targetMap.get(target)
  if (depsMap === void 0) {
    return
  }
  const effects = new Set()
  if (key !== void 0) {
    const dep = depsMap.get(key)
    dep && dep.forEach(effect => {
      effects.add(effect)
    })
  }
  if (operationType === 'add' || operationType === 'set') {
    const iterationKey = Array.isArray(target) ? 'length' : Symbol('iterate')
    const dep = depsMap.get(iterationKey)
    dep && dep.forEach(effect => {
      effects.add(effect)
    })
  }
  effects.forEach(effect => {
    effect()
  })
}

export function effect (fn) {
  const effect = function effect(...args) {
    return run(effect, fn, args)
  }
  effect()
  return effect
}

export function run(effect, fn, args) {
  if (effectStack.indexOf(effect) === -1) {
    try {
      effectStack.push(effect)
      return fn(...args)
    } finally {
      effectStack.pop()
    }
  }
}
