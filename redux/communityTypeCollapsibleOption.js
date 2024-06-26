import { createSlice } from "@reduxjs/toolkit";
import uuid from 'react-native-uuid'

export const communityTypeCollapsibleSlice = createSlice({
  name: 'communityType',
  initialState: {
    buttons: [
      {
        text: "Any",
        id: uuid.v4(),
        data: '',
      },
      {
        text: "Group",
        id: uuid.v4(),
        data: 'group',
      },
      {
        text: "Page",
        id: uuid.v4(),
        data: 'page',
      },
      {
        text: "Event",
        id: uuid.v4(),
        data: 'event',
      },
    ],
    selectedCommunityType: ''
  },
  reducers: {
    selectCommunityType: (state, action) => {
      return {
        ...state,
        selectedCommunityType: action.payload
      }
    }
  }
})

export const { selectCommunityType } = communityTypeCollapsibleSlice.actions
export default communityTypeCollapsibleSlice.reducer