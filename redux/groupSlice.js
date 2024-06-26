import { createSlice } from "@reduxjs/toolkit";

export const groupSlice = createSlice({
  name: 'group',
  initialState: {
    id: null,
    offset: 0,
    totalPostCount: 0,
    items: [],
    groups: [],
    profiles: []
  },
  reducers: {
    setGroupID: (state, action) => {
      let id 
      if (action.payload > 0) {
        id = action.payload * (-1)
      } else {
        id = action.payload
      }
      return {
        ...state,
        id: id,
        offset: 0,
      }
    },
    increaseOffset: (state, action) => {
      return {
        ...state,
        offset: state.offset + 20
      }
    },
    setData: (state, action) => {
      return {
        ...state,
        items: action.payload.items,
        groups: action.payload.groups,
        profiles: action.payload.profiles,
        offset: state.offset + 20,
        totalPostCount: action.payload.count - 20
      }
    },
    pushData: (state, action) => {
      return {
        ...state,
        items: [...state.items, ...action.payload.items],
        groups: [...state.groups, ...action.payload.groups],
        profiles: [...state.profiles, ...action.payload.profiles],
        offset: state.offset + 20,
        totalPostCount: state.totalPostCount - 20
      }
    }
  },
})
export const { setGroupID, setData, pushData } = groupSlice.actions
export default groupSlice.reducer