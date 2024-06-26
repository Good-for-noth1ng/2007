import { createSlice } from "@reduxjs/toolkit";

export const downloadSlice = createSlice({
  name: 'download',
  initialState: {
    queue: [],
    progress: null
  },
  reducers: {
    pop: (state, action) => {
      return {
        ...state,
        queue: [...state.queue.slice(1, state.queue.length)]
      }
    },
    updateProgress: (state, action) => {
      return {
        ...state,
        progress: action.payload
      }
    },
    push: (state, action) => {
      const hasElemInQueue = state.queue.find(item => item.url === action.payload.url)
      if (hasElemInQueue === undefined) {
        return {
          ...state,
          queue: [...state.queue, action.payload]
        }
      }
    }
  }
})

export const { pop, push, updateProgress } = downloadSlice.actions
export default downloadSlice.reducer