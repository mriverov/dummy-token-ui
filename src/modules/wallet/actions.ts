// Connect Wallet
export const CONNECT_WALLET_REQUEST = '[Request] Connect Wallet'
export const CONNECT_WALLET_SUCCESS = '[Success] Connect Wallet'
export const CONNECT_WALLET_FAILURE = '[Failure] Connect Wallet'

// Transfer
export const TRANSFER_TOKEN_REQUEST = '[Request] Transfer Token'
export const TRANSFER_TOKEN_SUCCESS = '[Success] Transfer Token'
export const TRANSFER_TOKEN_FAILURE = '[Failure] Transfer Token'

// Balance
export const SET_BALANCE = '[State] Set Balance'

export function setBalance(balance: string) {
  return { type: SET_BALANCE, payload: { balance } }
}

export function connectWalletRequest() {
  return {
    type: CONNECT_WALLET_REQUEST,
    payload: {},
  }
}

export function connectWalletSuccess(address: string, balance: string) {
  return {
    type: CONNECT_WALLET_SUCCESS,
    payload: {
      address,
      balance,
    },
  }
}

export function connectWalletFailure(error: string) {
  return {
    type: CONNECT_WALLET_FAILURE,
    payload: {
      error,
    },
  }
}

export function transferTokenRequest(payload: { to: string; amount: string }) {
  return { type: TRANSFER_TOKEN_REQUEST, payload }
}
export function transferTokenSuccess(txHash: string) {
  return { type: TRANSFER_TOKEN_SUCCESS, payload: { txHash } }
}
export function transferTokenFailure(error: string) {
  return { type: TRANSFER_TOKEN_FAILURE, payload: { error } }
}

export type ConnectWalletRequestAction = ReturnType<typeof connectWalletRequest>
export type ConnectWalletSuccessAction = ReturnType<typeof connectWalletSuccess>
export type ConnectWalletFailureAction = ReturnType<typeof connectWalletFailure>

export type TransferTokenRequestAction = ReturnType<typeof transferTokenRequest>
export type TransferTokenSuccessAction = ReturnType<typeof transferTokenSuccess>
export type TransferTokenFailureAction = ReturnType<typeof transferTokenFailure>

export type SetBalanceAction = ReturnType<typeof setBalance>
