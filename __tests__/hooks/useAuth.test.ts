import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

jest.mock('@/lib/supabase')

describe('useAuth', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    user_metadata: {}
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with loading state', () => {
    const mockGetSession = jest.mocked(supabase.auth.getSession)
    mockGetSession.mockReturnValue(new Promise(() => {})) // never resolves

    const { result } = renderHook(() => useAuth())

    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBe(null)
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('sets user when session exists', async () => {
    const mockGetSession = jest.mocked(supabase.auth.getSession)
    const mockOnAuthStateChange = jest.mocked(supabase.auth.onAuthStateChange)
    
    mockGetSession.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null
    } as any)
    
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } }
    } as any)

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('provides signOut function', async () => {
    const mockGetSession = jest.mocked(supabase.auth.getSession)
    const mockOnAuthStateChange = jest.mocked(supabase.auth.onAuthStateChange)
    const mockSignOut = jest.mocked(supabase.auth.signOut)
    
    mockGetSession.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null
    } as any)
    
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } }
    } as any)

    mockSignOut.mockResolvedValue({ error: null } as any)

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.signOut()
    })

    expect(mockSignOut).toHaveBeenCalled()
  })
})