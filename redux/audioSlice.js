import { createSlice } from "@reduxjs/toolkit";

export const audioSlice = createSlice({
  name: 'audio',
  initialState: {
    sound: null,
    info: null,
    prev: null,
    prevInfo: null,
    audios: [],
    index: 0,
    isPlaying: false
  },
  reducers: {
    updateTrack: (state, action) => {
      return {
        ...state,
        sound: action.payload.sound,
        info: action.payload.info,
        audios: action.payload.audios ? action.payload.audios : state.audios,
        index: action.payload.index,
        prev: state.sound,
        prevInfo: state.info,
      }
    },
    setPlayStatus: (state, action) => {
      console.log(action.payload)
      return {
        ...state,
        isPlaying: action.payload
      }
    }
  }
})
export const { updateTrack, setPlayStatus } = audioSlice.actions;
export default audioSlice.reducer