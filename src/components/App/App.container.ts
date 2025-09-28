import { connect } from 'react-redux'
import { App } from './App'
import {
  selectAddress,
  selectError,
  selectIsConnected,
  selectIsConnecting,
  selectIsTransferring,
  selectPrettyBalance,
} from '../../modules/selectors/wallet'
import {
  connectWalletRequest,
  transferTokenRequest,
  refreshBalanceRequest,
} from '../../modules/wallet/actions'
import { RootState } from '../../modules/store'
import { MapDispatch, MapDispatchProps, MapStateProps } from './App.types'

const mapState = (state: RootState): MapStateProps => ({
  address: selectAddress(state) ?? '',
  balance: selectPrettyBalance(state),
  isConnected: selectIsConnected(state),
  isConnecting: selectIsConnecting(state),
  isTransferring: selectIsTransferring(state),
  error: selectError(state) ?? undefined,
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onConnect: () => dispatch(connectWalletRequest()),
  onTransfer: (to: string, amount: string) => dispatch(transferTokenRequest({ to, amount })),
  onRefreshBalance: () => dispatch(refreshBalanceRequest()),
})

export default connect(mapState, mapDispatch)(App)
