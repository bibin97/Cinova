import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  mobileNavOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    mobileNavOpened(state) {
      state.mobileNavOpen = true
    },
    mobileNavClosed(state) {
      state.mobileNavOpen = false
    },
    mobileNavToggled(state) {
      state.mobileNavOpen = !state.mobileNavOpen
    },
  },
})

export const { mobileNavOpened, mobileNavClosed, mobileNavToggled } = uiSlice.actions
export default uiSlice.reducer
