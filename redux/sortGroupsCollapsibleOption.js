import { createSlice } from "@reduxjs/toolkit";
import uuid from 'react-native-uuid'

export const sortGroupsCollapsibleSlice = createSlice({
  name: 'groupsSortType',
  initialState: {
    buttons: [
      {
        text: "Sort by Default",
        id: uuid.v4(),
        data: 0,
      },
      {
        text: "Sort by Number of Members",
        id: uuid.v4(),
        data: 6,
      },
    ],
    selectedSortType: 0
  },
  reducers: {
    selectSortType: (state, action) => {
      return {
        ...state,
        selectedSortType: action.payload
      }
    }
  }
})

export const { selectSortType } = sortGroupsCollapsibleSlice.actions
export default sortGroupsCollapsibleSlice.reducer