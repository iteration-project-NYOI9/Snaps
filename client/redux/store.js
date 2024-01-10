// Importing store from redux toollkit 
import { configureStore } from '@reduxjs/toolkit'
import snapsReducer from './snapsSlice'

// Exporting store for app use
export const store = configureStore({
  // Only takes one key, which is reducer, which we populate with our slices
  reducer: {
    snaps: snapsReducer,
  },
})