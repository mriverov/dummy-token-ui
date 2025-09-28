import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import HomePage from './HomePage'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('HomePage', () => {
  const defaultProps = {
    address: '',
    balance: '0 DUMMY',
    isConnected: false,
    isConnecting: false,
    error: null,
    onConnect: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders connect button when not connected', () => {
    render(
      <MemoryRouter>
        <HomePage {...defaultProps} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: /connect/i })).toBeInTheDocument()
  })

  test('shows loading state when connecting', () => {
    render(
      <MemoryRouter>
        <HomePage {...defaultProps} isConnecting={true} />
      </MemoryRouter>,
    )

    const connectButton = screen.getByRole('button', { name: /connect/i })
    expect(connectButton).toHaveClass('loading')
  })

  test('calls onConnect when connect button is clicked', async () => {
    const user = userEvent.setup()
    const onConnect = vi.fn()

    render(
      <MemoryRouter>
        <HomePage {...defaultProps} onConnect={onConnect} />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /connect/i }))
    expect(onConnect).toHaveBeenCalledTimes(1)
  })

  test('shows error message when error exists', () => {
    render(
      <MemoryRouter>
        <HomePage {...defaultProps} error="Connection failed" />
      </MemoryRouter>,
    )

    expect(screen.getByText('Connection failed')).toBeInTheDocument()
  })

  test('navigates to wallet when connected', () => {
    render(
      <MemoryRouter>
        <HomePage {...defaultProps} isConnected={true} />
      </MemoryRouter>,
    )

    expect(mockNavigate).toHaveBeenCalledWith('/wallet')
  })
})
