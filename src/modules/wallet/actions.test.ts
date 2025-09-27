import {
  setBalance,
  connectWalletRequest,
  connectWalletSuccess,
  connectWalletFailure,
  transferTokenRequest,
  transferTokenSuccess,
  transferTokenFailure,
  CONNECT_WALLET_REQUEST,
  CONNECT_WALLET_SUCCESS,
  CONNECT_WALLET_FAILURE,
  TRANSFER_TOKEN_REQUEST,
  TRANSFER_TOKEN_SUCCESS,
  TRANSFER_TOKEN_FAILURE,
  SET_BALANCE,
} from './actions'

test('setBalance creates the correct action', () => {
  const action = setBalance('100 DUMMY')
  expect(action).toEqual({
    type: SET_BALANCE,
    payload: { balance: '100 DUMMY' }
  })
})

test('connectWalletRequest creates the correct action', () => {
  const action = connectWalletRequest()
  expect(action).toEqual({
    type: CONNECT_WALLET_REQUEST,
    payload: {}
  })
})

test('connectWalletSuccess creates the correct action', () => {
  const action = connectWalletSuccess('0xabc', '100 DUMMY')
  expect(action).toEqual({
    type: CONNECT_WALLET_SUCCESS,
    payload: {
      address: '0xabc',
      balance: '100 DUMMY'
    }
  })
})

test('connectWalletFailure creates the correct action', () => {
  const action = connectWalletFailure('Connection failed')
  expect(action).toEqual({
    type: CONNECT_WALLET_FAILURE,
    payload: {
      error: 'Connection failed'
    }
  })
})

test('transferTokenRequest creates the correct action', () => {
  const action = transferTokenRequest({ to: '0xto', amount: '10' })
  expect(action).toEqual({
    type: TRANSFER_TOKEN_REQUEST,
    payload: {
      to: '0xto',
      amount: '10'
    }
  })
})

test('transferTokenSuccess creates the correct action', () => {
  const action = transferTokenSuccess('0xtxhash')
  expect(action).toEqual({
    type: TRANSFER_TOKEN_SUCCESS,
    payload: {
      txHash: '0xtxhash'
    }
  })
})

  test('transferTokenFailure creates the correct action', () => {
  const action = transferTokenFailure('Transfer failed')
  expect(action).toEqual({
    type: TRANSFER_TOKEN_FAILURE,
    payload: {
      error: 'Transfer failed'
    }
  })
})
