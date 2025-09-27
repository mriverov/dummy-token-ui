import { Action, Dispatch } from 'redux'
import {
  ConnectWalletRequestAction,
  TransferTokenRequestAction,
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
}

export type MapStateProps = Pick<
  Props,
  'address' | 'balance' | 'isConnected' | 'isConnecting' | 'isTransferring' | 'error'
>
export type MapDispatchProps = Pick<Props, 'onConnect' | 'onTransfer'>
export type MapDispatch = Dispatch<ConnectWalletRequestAction | TransferTokenRequestAction | Action>
