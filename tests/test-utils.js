import assert from 'node:assert/strict'
import { after, afterEach, before, beforeEach, describe, mock, test } from 'node:test'

const ANY = Symbol('expect.any')

function createMock(implementation = () => undefined) {
  const mocked = mock.fn(implementation)

  mocked.mockResolvedValue = (value) => {
    mocked.mock.mockImplementation(() => Promise.resolve(value))
    return mocked
  }

  mocked.mockRejectedValue = (value) => {
    mocked.mock.mockImplementation(() => Promise.reject(value))
    return mocked
  }

  mocked.mockReturnValue = (value) => {
    mocked.mock.mockImplementation(() => value)
    return mocked
  }

  return mocked
}

function wrapMock(mocked) {
  mocked.mockReturnValue = (value) => {
    mocked.mock.mockImplementation(() => value)
    return mocked
  }

  mocked.mockResolvedValue = (value) => {
    mocked.mock.mockImplementation(() => Promise.resolve(value))
    return mocked
  }

  mocked.mockRejectedValue = (value) => {
    mocked.mock.mockImplementation(() => Promise.reject(value))
    return mocked
  }

  return mocked
}

function callsFor(mocked) {
  return mocked.mock.calls.map(call => call.arguments)
}

function match(actual, expected) {
  if (expected && expected[ANY]) {
    if (expected.klass === Function) return typeof actual === 'function'
    return actual instanceof expected.klass
  }

  try {
    assert.deepStrictEqual(actual, expected)
    return true
  } catch {
    return false
  }
}

function matchArgs(actual, expected) {
  return actual.length === expected.length && actual.every((item, index) => match(item, expected[index]))
}

function assertThrows(received, expected) {
  if (typeof expected === 'string') {
    assert.throws(received, (error) => error?.message === expected)
  } else {
    assert.throws(received, expected)
  }
}

function expect(received) {
  const matchers = {
    toBe: (expected) => assert.strictEqual(received, expected),
    toEqual: (expected) => assert.deepStrictEqual(received, expected),
    toBeNull: () => assert.strictEqual(received, null),
    toBeUndefined: () => assert.strictEqual(received, undefined),
    toBeTruthy: () => assert.ok(received),
    toBeFalsy: () => assert.ok(!received),
    toBeInstanceOf: (expected) => assert.ok(received instanceof expected),
    toContain: (expected) => assert.ok(received.includes(expected)),
    toThrow: (expected) => assertThrows(received, expected),
    toHaveBeenCalled: () => assert.ok(received.mock.callCount() > 0),
    toHaveBeenCalledTimes: (expected) => assert.strictEqual(received.mock.callCount(), expected),
    toHaveBeenCalledWith: (...expected) => {
      assert.ok(callsFor(received).some(args => matchArgs(args, expected)))
    },
    toHaveBeenNthCalledWith: (callNumber, ...expected) => {
      assert.ok(matchArgs(callsFor(received)[callNumber - 1], expected))
    }
  }

  matchers.not = {
    toContain: (expected) => assert.ok(!received.includes(expected)),
    toHaveBeenCalled: () => assert.strictEqual(received.mock.callCount(), 0),
    toThrow: (expected) => assert.doesNotThrow(received, expected)
  }

  matchers.rejects = {
    toThrow: async (expected) => {
      if (typeof expected === 'string') {
        await assert.rejects(received, (error) => error?.message === expected)
      } else {
        await assert.rejects(received, expected)
      }
    }
  }

  return matchers
}

expect.any = (klass) => ({ [ANY]: true, klass })

const jest = {
  fn: createMock,
  spyOn(object, property, accessType) {
    if (accessType === 'get') return wrapMock(mock.getter(object, property))
    return wrapMock(mock.method(object, property))
  },
  restoreAllMocks() {
    mock.restoreAll()
  },
  resetAllMocks() {
    mock.reset()
  },
  useFakeTimers() {
    mock.timers.enable({ apis: ['setTimeout'] })
  },
  useRealTimers() {
    mock.timers.reset()
  },
  advanceTimersByTime(ms) {
    mock.timers.tick(ms)
  }
}

export { after, afterEach, before, beforeEach, describe, expect, jest, test }
