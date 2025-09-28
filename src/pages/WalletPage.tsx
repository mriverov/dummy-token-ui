import { Button, Card, Header } from 'decentraland-ui'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Props } from '../components/App/App.types'
import { ROUTES, MESSAGES } from '../constants'
import '../styles/components.css'

type WalletProps = Pick<
  Props,
  'address' | 'balance' | 'isConnected' | 'isTransferring' | 'error' | 'onRefreshBalance'
>

export default function WalletPage({
  address,
  balance,
  isConnected,
  onRefreshBalance,
}: WalletProps) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isConnected) {
      navigate(ROUTES.HOME)
    }
  }, [isConnected, navigate])

  useEffect(() => {
    if (isConnected && onRefreshBalance) {
      onRefreshBalance()
    }
  }, [isConnected, onRefreshBalance])
  return (
    <div className="container">
      <Card>
        <Header>{MESSAGES.UI.WALLET}</Header>
        <p>
          <strong>Address:</strong>&nbsp;
          {address.slice(0, 6) + '...' + address.slice(-4)}
        </p>
        <p>
          <strong>Balance:</strong>&nbsp;{balance}
          <Link to={ROUTES.TRANSFER}>
            <Button basic className="transfer-button">
              <strong>{MESSAGES.UI.TRANSFER}</strong>
            </Button>
          </Link>
        </p>
      </Card>
    </div>
  )
}
