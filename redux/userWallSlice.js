import { createSlice } from "@reduxjs/toolkit";

export const userWallSlice = createSlice({
  name: 'userWall',
  initialState: {
    id: 0,
    offset: 0,
    totalPostCount: 0,
    items: [],
    groups: [],
    profiles: []
  },
  reducers: {
    setUserID: (state, action) => {
      return {
        ...state,
        id: action.payload
      }
    },
    setData: (state, action) => {
      return {
        ...state,
        items: action.payload.items,
        groups: action.payload.groups,
        profiles: action.payload.profiles,
        offset: state.offset + 20,
        totalPostCount: action.payload.count
      }
    },
    pushData: (state, action) => {
      return {
        ...state,
        items: [...state.items, ...action.payload.items],
        groups: [...state.groups, ...action.payload.groups],
        profiles: [...state.profiles, ...action.payload.profiles],
        offset: state.offset + 20
      }
    },
    clear: (state, action) => {
      return {
        ...state,
        offset: 0,
        totalPostCount: 0,
        items: [],
        groups: [],
        profiles: []
      }
    }
  }
})
export const { setUserID, setData, pushData, clear } = userWallSlice.actions
export default userWallSlice.reducer