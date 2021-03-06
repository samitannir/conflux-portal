import assert from 'assert'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

import {
  REQUIRED_ERROR,
  INVALID_RECIPIENT_ADDRESS_ERROR,
  KNOWN_RECIPIENT_ADDRESS_ERROR,
} from '../../../send.constants'

const stubs = {
  isValidAddress: sinon
    .stub()
    .callsFake((to) => Boolean(to.match(/^[0xabcdef123456798]+$/))),
}

const toRowUtils = proxyquire('../add-recipient.js', {
  '../../../../helpers/utils/util': {
    isValidAddress: stubs.isValidAddress,
  },
})
const { getToErrorObject, getToWarningObject } = toRowUtils

describe('add-recipient utils', function () {
  describe('getToErrorObject()', function () {
    it('should return a required error if to is falsy', function () {
      assert.deepEqual(getToErrorObject(null), {
        to: REQUIRED_ERROR,
      })
    })

    it('should return null if to is falsy and hexData is truthy', function () {
      assert.deepEqual(getToErrorObject(null, undefined, true), {
        to: null,
      })
    })

    it('should return an invalid recipient error if to is truthy but invalid', function () {
      assert.deepEqual(getToErrorObject('mockInvalidTo'), {
        to: INVALID_RECIPIENT_ADDRESS_ERROR,
      })
    })

    it('should return null if to is truthy and valid', function () {
      assert.deepEqual(getToErrorObject('0xabc123'), {
        to: null,
      })
    })

    it('should return the passed error if to is truthy but invalid if to is truthy and valid', function () {
      assert.deepEqual(
        getToErrorObject('invalid #$ 345878', 'someExplicitError'),
        {
          to: 'someExplicitError',
        }
      )
    })

    it('should return null if to is truthy but part of state tokens', function () {
      assert.deepEqual(
        getToErrorObject(
          '0xabc123',
          undefined,
          false,
          [{ address: '0xabc123' }],
          { address: '0xabc123' }
        ),
        {
          to: null,
        }
      )
    })

    it('should null if to is truthy part of tokens but selectedToken falsy', function () {
      assert.deepEqual(
        getToErrorObject('0xabc123', undefined, false, [
          { address: '0xabc123' },
        ]),
        {
          to: null,
        }
      )
    })

    it('should return null if to is truthy but part of contract metadata', function () {
      assert.deepEqual(
        getToErrorObject(
          '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
          undefined,
          false,
          [{ address: '0xabc123' }],
          { address: '0xabc123' }
        ),
        {
          to: null,
        }
      )
    })
    it('should null if to is truthy part of contract metadata but selectedToken falsy', function () {
      assert.deepEqual(
        getToErrorObject(
          '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
          undefined,
          false,
          [{ address: '0xabc123' }],
          { address: '0xabc123' }
        ),
        {
          to: null,
        }
      )
    })
  })

  describe('getToWarningObject()', function () {
    it('should return a known address recipient if to is truthy but part of state tokens', function () {
      assert.deepEqual(
        getToWarningObject('0xabc123', undefined, [{ address: '0xabc123' }], {
          address: '0xabc123',
        }),
        {
          to: KNOWN_RECIPIENT_ADDRESS_ERROR,
        }
      )
    })

    it('should null if to is truthy part of tokens but selectedToken falsy', function () {
      assert.deepEqual(
        getToWarningObject('0xabc123', undefined, [{ address: '0xabc123' }]),
        {
          to: null,
        }
      )
    })

    it('should return a known address recipient if to is truthy but part of contract metadata', function () {
      assert.deepEqual(
        getToWarningObject(
          '0xD29C3302edfF23bF425Ba6e0Ba6E17dA16FB287C',
          undefined,
          [{ address: '0xabc123' }],
          { address: '0xabc123' }
        ),
        {
          to: KNOWN_RECIPIENT_ADDRESS_ERROR,
        }
      )
    })
    it('should null if to is truthy part of contract metadata but selectedToken falsy', function () {
      assert.deepEqual(
        getToWarningObject(
          '0xD29C3302edfF23bF425Ba6e0Ba6E17dA16FB287C',
          undefined,
          [{ address: '0xabc123' }],
          { address: '0xabc123' }
        ),
        {
          to: KNOWN_RECIPIENT_ADDRESS_ERROR,
        }
      )
    })
  })
})
