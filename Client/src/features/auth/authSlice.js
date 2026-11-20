import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
}

/**
 * Placeholder auth state. Phase 3 will add mock login/signup only.
 * No real authentication exists yet.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    mockSessionCleared() {
      return initialState
    },
  },
})

export const { mockSessionCleared } = authSlice.actions
export default authSlice.reducer
