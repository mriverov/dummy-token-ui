import { Button } from 'decentraland-ui'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Props } from '../components/App/App.types'
import { ROUTES, MESSAGES } from '../constants'
import '../styles/components.css'

type HomeProps = Pick<
  Props,
  'address' | 'balance' | 'isConnected' | 'onConnect' | 'isConnecting' | 'error'
>

export default function HomePage({ isConnected, onConnect, isConnecting, error }: HomeProps) {
  const navigate = useNavigate()

  useEffect(() => {
    if (isConnected && !isConnecting && !error) {
      navigate(ROUTES.WALLET)
    }
  }, [isConnected, isConnecting, error, navigate])

  const handleConnect = () => {
    onConnect()
  }

  return (
    <div className="container">
      <>
        <Button primary onClick={handleConnect} loading={isConnecting}>
          {MESSAGES.UI.CONNECT}
        </Button>
        {error ? <p className="error-message">{error}</p> : null}
      </>
    </div>
  )
}
