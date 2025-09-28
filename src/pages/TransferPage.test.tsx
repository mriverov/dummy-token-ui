import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import TransferPage from './TransferPage'

// Mock ethers
vi.mock('ethers', () => ({
  ethers: {
    isAddress: (address: string) => /^0x[a-fA-F0-9]{40}$/.test(address),
  },
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('TransferPage', () => {
  const defaultProps = {
    balance: '100 DUMMY',
    isTransferring: false,
    error: null,
    onTransfer: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders transfer form', () => {
    render(
      <MemoryRouter>
        <TransferPage {...defaultProps} />
      </MemoryRouter>,
    )

    expect(screen.getByText(/transfer/i)).toBeInTheDocument()
    expect(screen.getByText(/send tokens to an account/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('100')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('0x...')).toBeInTheDocument()
  })

  test('shows send and back buttons', () => {
    render(
      <MemoryRouter>
        <TransferPage {...defaultProps} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: /^send$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
  })

  test('enables send button with valid inputs', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <TransferPage {...defaultProps} />
      </MemoryRouter>,
    )

    await user.type(
      screen.getByPlaceholderText('0x...'),
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    )
    await user.type(screen.getByPlaceholderText('100'), '10')

    const sendButton = screen.getByRole('button', { name: /^send$/i })
    expect(sendButton).toBeEnabled()
  })

  test('disables send button with invalid address', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <TransferPage {...defaultProps} />
      </MemoryRouter>,
    )

    await user.type(screen.getByPlaceholderText('0x...'), 'invalid-address')
    await user.type(screen.getByPlaceholderText('100'), '10')

    const sendButton = screen.getByRole('button', { name: /^send$/i })
    expect(sendButton).toBeDisabled()
  })

  test('disables send button with invalid amount', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <TransferPage {...defaultProps} />
      </MemoryRouter>,
    )

    await user.type(
      screen.getByPlaceholderText('0x...'),
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    )
    await user.type(screen.getByPlaceholderText('100'), 'abc')

    const sendButton = screen.getByRole('button', { name: /^send$/i })
    expect(sendButton).toBeDisabled()
  })

  test('disables send button with amount greater than balance', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <TransferPage {...defaultProps} balance="50 DUMMY" />
      </MemoryRouter>,
    )

    await user.type(
      screen.getByPlaceholderText('0x...'),
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    )
    await user.type(screen.getByPlaceholderText('100'), '100')

    const sendButton = screen.getByRole('button', { name: /^send$/i })
    expect(sendButton).toBeDisabled()
  })

  test('calls onTransfer with correct parameters when send is clicked', async () => {
    const user = userEvent.setup()
    const onTransfer = vi.fn()

    render(
      <MemoryRouter>
        <TransferPage {...defaultProps} onTransfer={onTransfer} />
      </MemoryRouter>,
    )

    await user.type(
      screen.getByPlaceholderText('0x...'),
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    )
    await user.type(screen.getByPlaceholderText('100'), '10')
    await user.click(screen.getByRole('button', { name: /^send$/i }))

    expect(onTransfer).toHaveBeenCalledWith('0x70997970C51812dc3A010C7d01b50e0d17dc79C8', '10')
  })

  test('shows error message when transfer fails', () => {
    render(
      <MemoryRouter>
        <TransferPage {...defaultProps} error="Transfer failed" />
      </MemoryRouter>,
    )

    expect(screen.getByText('Transfer failed')).toBeInTheDocument()
  })

  test('shows loading state when transferring', () => {
    render(
      <MemoryRouter>
        <TransferPage {...defaultProps} isTransferring={true} />
      </MemoryRouter>,
    )

    const sendButton = screen.getByRole('button', { name: /^send$/i })
    expect(sendButton).toHaveClass('loading')
    expect(sendButton).toBeDisabled()
  })

  test('navigates back to wallet after successful transfer', async () => {
    const { rerender } = render(
      <MemoryRouter>
        <TransferPage {...defaultProps} isTransferring={true} />
      </MemoryRouter>,
    )

    // Simulate transfer completion
    rerender(
      <MemoryRouter>
        <TransferPage {...defaultProps} isTransferring={false} />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/wallet')
    })
  })

  test('shows validation error for invalid address', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <TransferPage {...defaultProps} />
      </MemoryRouter>,
    )

    await user.type(screen.getByPlaceholderText('0x...'), 'invalid-address')

    expect(screen.getByText(/invalid address/i)).toBeInTheDocument()
  })

  test('shows validation error for invalid amount format', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <TransferPage {...defaultProps} />
      </MemoryRouter>,
    )

    await user.type(screen.getByPlaceholderText('100'), 'abc')

    expect(screen.getByText(/only positive integers/i)).toBeInTheDocument()
  })

  test('shows validation error for insufficient balance', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <TransferPage {...defaultProps} balance="50 DUMMY" />
      </MemoryRouter>,
    )

    await user.type(
      screen.getByPlaceholderText('0x...'),
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    )
    await user.type(screen.getByPlaceholderText('100'), '100')

    expect(screen.getByText(/insufficient balance/i)).toBeInTheDocument()
  })
})
