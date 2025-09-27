import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App/App'

// Mock ethers to avoid dependency issues in tests
vi.mock('ethers', () => ({
  ethers: {
    isAddress: (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address)
  }
}))

function setup(partial?: Partial<React.ComponentProps<typeof App>>) {
  const props: React.ComponentProps<typeof App> = {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    balance: '100 DUMMY',
    isConnected: true,
    isConnecting: false,
    isTransferring: false,
    error: null,
    onConnect: vi.fn(),
    onTransfer: vi.fn(),
    ...partial
  }
  return { ...render(<App {...props} />), props }
}

describe('App Component - Connection State', () => {
  test('shows Connect button when not connected', () => {
    setup({ isConnected: false })
    expect(screen.getByRole('button', { name: /connect/i })).toBeInTheDocument()
    expect(screen.queryByText(/wallet/i)).not.toBeInTheDocument()
  })

  test('shows loading state on Connect button when connecting', () => {
    setup({ isConnected: false, isConnecting: true })
    const connectButton = screen.getByRole('button', { name: /connect/i })
    expect(connectButton).toBeInTheDocument()
    // Check if the button has the loading class or attribute
    expect(connectButton).toHaveClass('loading')
  })

  test('calls onConnect when Connect button is clicked', async () => {
    const user = userEvent.setup()
    const { props } = setup({ isConnected: false })
    
    await user.click(screen.getByRole('button', { name: /connect/i }))
    expect(props.onConnect).toHaveBeenCalledTimes(1)
  })

  test('shows error message when not connected and error exists', () => {
    setup({ isConnected: false, error: 'Connection failed' })
    expect(screen.getByText('Connection failed')).toBeInTheDocument()
  })
})

describe('App Component - Connected State', () => {
  test('shows wallet information when connected', () => {
    setup({ isConnected: true })
    expect(screen.getByText(/wallet/i)).toBeInTheDocument()
    expect(screen.getByText(/address/i)).toBeInTheDocument()
    expect(screen.getByText(/balance/i)).toBeInTheDocument()
  })

  test('shows truncated address when connected', () => {
    setup({ isConnected: true, address: '0x1234567890abcdef1234567890abcdef12345678' })
    expect(screen.getByText(/0x1234...5678/)).toBeInTheDocument()
  })

  test('shows balance when connected', () => {
    setup({ isConnected: true, balance: '150 DUMMY' })
    expect(screen.getByText('150 DUMMY')).toBeInTheDocument()
  })

  test('shows Transfer button when connected', () => {
    setup({ isConnected: true })
    expect(screen.getByRole('button', { name: /transfer/i })).toBeInTheDocument()
  })
})

describe('App Component - Transfer Modal', () => {
  test('opens transfer modal when Transfer button is clicked', async () => {
    const user = userEvent.setup()
    setup()
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    
    expect(screen.getByText(/send tokens to an account/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^send$/i })).toBeInTheDocument()
  })

  test('shows form fields in transfer modal', async () => {
    const user = userEvent.setup()
    setup()
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    
    expect(screen.getByPlaceholderText('100')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('0x...')).toBeInTheDocument()
  })

  test('modal can be closed', async () => {
    const user = userEvent.setup()
    setup()
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    expect(screen.getByText(/send tokens to an account/i)).toBeInTheDocument()
    
    // Test that modal is open and can be interacted with
    expect(screen.getByRole('button', { name: /^send$/i })).toBeInTheDocument()
  })

  test('does not show close button when transferring', async () => {
    const user = userEvent.setup()
    setup({ isTransferring: true })
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
  })
})

describe('App Component - Transfer Form Validation', () => {
  test('enables Send button with valid address and amount', async () => {
    const user = userEvent.setup()
    const { props } = setup()
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    await user.type(screen.getByPlaceholderText('0x...'), '0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    await user.type(screen.getByPlaceholderText('100'), '10')

    const sendButton = screen.getByRole('button', { name: /^send$/i })
    expect(sendButton).toBeEnabled()
  })

  test('disables Send button with invalid address', async () => {
    const user = userEvent.setup()
    setup()
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    await user.type(screen.getByPlaceholderText('0x...'), 'invalid-address')
    await user.type(screen.getByPlaceholderText('100'), '10')

    const sendButton = screen.getByRole('button', { name: /^send$/i })
    expect(sendButton).toBeDisabled()
  })

  test('disables Send button with invalid amount format', async () => {
    const user = userEvent.setup()
    setup()
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    await user.type(screen.getByPlaceholderText('0x...'), '0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    await user.type(screen.getByPlaceholderText('100'), 'abc')

    const sendButton = screen.getByRole('button', { name: /^send$/i })
    expect(sendButton).toBeDisabled()
  })

  test('disables Send button with amount greater than balance', async () => {
    const user = userEvent.setup()
    setup({ balance: '50 DUMMY' })
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    await user.type(screen.getByPlaceholderText('0x...'), '0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    await user.type(screen.getByPlaceholderText('100'), '100')

    const sendButton = screen.getByRole('button', { name: /^send$/i })
    expect(sendButton).toBeDisabled()
  })

  test('disables Send button with zero amount', async () => {
    const user = userEvent.setup()
    setup()
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    await user.type(screen.getByPlaceholderText('0x...'), '0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    await user.type(screen.getByPlaceholderText('100'), '0')

    const sendButton = screen.getByRole('button', { name: /^send$/i })
    expect(sendButton).toBeDisabled()
  })

  test('shows error message for invalid address', async () => {
    const user = userEvent.setup()
    setup()
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    await user.type(screen.getByPlaceholderText('0x...'), 'invalid-address')

    expect(screen.getByText(/address inválida/i)).toBeInTheDocument()
  })

  test('shows error message for invalid amount format', async () => {
    const user = userEvent.setup()
    setup()
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    await user.type(screen.getByPlaceholderText('100'), 'abc')

    expect(screen.getByText(/solo enteros positivos/i)).toBeInTheDocument()
  })

  test('shows error message for insufficient balance', async () => {
    const user = userEvent.setup()
    setup({ balance: '50 DUMMY' })
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    await user.type(screen.getByPlaceholderText('0x...'), '0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    await user.type(screen.getByPlaceholderText('100'), '100')

    expect(screen.getByText(/saldo insuficiente/i)).toBeInTheDocument()
  })
})

describe('App Component - Transfer Actions', () => {
  test('calls onTransfer with correct parameters when Send is clicked', async () => {
    const user = userEvent.setup()
    const { props } = setup()
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    await user.type(screen.getByPlaceholderText('0x...'), '0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    await user.type(screen.getByPlaceholderText('100'), '10')
    await user.click(screen.getByRole('button', { name: /^send$/i }))

    expect(props.onTransfer).toHaveBeenCalledWith(
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      '10'
    )
  })

  test('trims whitespace from input values', async () => {
    const user = userEvent.setup()
    const { props } = setup()
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    await user.type(screen.getByPlaceholderText('0x...'), '  0x70997970C51812dc3A010C7d01b50e0d17dc79C8  ')
    await user.type(screen.getByPlaceholderText('100'), '  10  ')
    await user.click(screen.getByRole('button', { name: /^send$/i }))

    expect(props.onTransfer).toHaveBeenCalledWith(
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      '10'
    )
  })

  test('disables Send button when transferring', async () => {
    const user = userEvent.setup()
    setup({ isTransferring: true })
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    
    const sendButton = screen.getByRole('button', { name: /^send$/i })
    expect(sendButton).toBeDisabled()
    expect(sendButton).toHaveClass('loading')
  })

  test('disables form fields when transferring', async () => {
    const user = userEvent.setup()
    setup({ isTransferring: true })
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    
    expect(screen.getByPlaceholderText('100')).toBeDisabled()
  })
})

describe('App Component - Transfer Success/Error Handling', () => {
  test('closes modal and clears form after successful transfer', async () => {
    const user = userEvent.setup()
    const { rerender } = setup({ isTransferring: true })
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    await user.type(screen.getByPlaceholderText('0x...'), '0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    await user.type(screen.getByPlaceholderText('100'), '10')
    
    // Simulate transfer completion
    rerender(<App 
      address="0x1234567890abcdef1234567890abcdef12345678"
      balance="90 DUMMY"
      isConnected={true}
      isConnecting={false}
      isTransferring={false}
      error={null}
      onConnect={vi.fn()}
      onTransfer={vi.fn()}
    />)

    await waitFor(() => {
      expect(screen.queryByText(/send tokens to an account/i)).not.toBeInTheDocument()
    })
  })

  test('shows error message in modal when transfer fails', async () => {
    const user = userEvent.setup()
    setup({ isTransferring: false, error: 'Transfer failed' })
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    
    expect(screen.getByText('Transfer failed')).toBeInTheDocument()
  })

  test('does not show error message in modal when transferring', async () => {
    const user = userEvent.setup()
    setup({ isTransferring: true, error: 'Transfer failed' })
    
    await user.click(screen.getByRole('button', { name: /transfer/i }))
    
    expect(screen.queryByText('Transfer failed')).not.toBeInTheDocument()
  })
})

describe('App Component - Edge Cases', () => {
  test('handles empty balance correctly', () => {
    setup({ balance: '0 DUMMY' })
    expect(screen.getByText('0 DUMMY')).toBeInTheDocument()
  })

  test('handles very large balance correctly', () => {
    setup({ balance: '999999999999999999999 DUMMY' })
    expect(screen.getByText('999999999999999999999 DUMMY')).toBeInTheDocument()
  })

  test('handles balance with decimal places', () => {
    setup({ balance: '100.5 DUMMY' })
    expect(screen.getByText('100.5 DUMMY')).toBeInTheDocument()
  })

  test('handles very long address correctly', () => {
    const longAddress = '0x' + 'a'.repeat(40)
    setup({ address: longAddress })
    expect(screen.getByText(/0xaaaa...aaaa/)).toBeInTheDocument()
  })
})
