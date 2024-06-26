import { createSlice } from "@reduxjs/toolkit";

export const audioProgressSlice = createSlice({
  name: "audioProgress",
  initialState: {
    played: 0,
  },
  reducers: {
    updateProgress: (state, action) => {
      return {
        played: action.payload
      }
    }
  }
}) 
export const { updateProgress } = audioProgressSlice.actions
export default audioProgressSlice.reducer