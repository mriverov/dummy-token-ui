import { Action, Dispatch } from 'redux'
import {
  ConnectWalletRequestAction,
  TransferTokenRequestAction,
  RefreshBalanceRequestAction,
} from '../../modules/wallet/actions'

export type Props = {
  address: string
  balance: string
  isConnected: boolean
  isConnecting: boolean
  isTransferring: boolean

  error: string | null
  onConnect: () => void
  onTransfer: (to: string, amount: string) => void
  onRefreshBalance: () => void
}

export type MapStateProps = Pick<
  Props,
  'address' | 'balance' | 'isConnected' | 'isConnecting' | 'isTransferring' | 'error'
>
export type MapDispatchProps = Pick<Props, 'onConnect' | 'onTransfer' | 'onRefreshBalance'>
export type MapDispatch = Dispatch<
  ConnectWalletRequestAction | TransferTokenRequestAction | RefreshBalanceRequestAction | Action
>
