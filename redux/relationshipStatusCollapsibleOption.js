import { createSlice } from "@reduxjs/toolkit";
import uuid from 'react-native-uuid'

export const relationshipStatusCollapsibleSlice = createSlice({
  name: 'relationshipStatus',
  initialState: {
    buttons: [
      {
        text: "Not selected",
        id: uuid.v4(),
        data: 0,
      },
      {
        text: "Single",
        id: uuid.v4(),
        data: 1
      },
      {
        text: "In a relationship",
        id: uuid.v4(),
        data: 2
      },
      {
        text: "Engaged",
        id: uuid.v4(),
        data: 3,
      },
      {
        text: "Married",
        id: uuid.v4(),
        data: 4,
      },
      {
        text: "It's complicated",
        id: uuid.v4(),
        data: 5 
      },
      {
        text: 'Actively searching',
        id: uuid.v4(),
        data: 6
      },
      {
        text: 'In love',
        id: uuid.v4(),
        data: 7
      },
      {
        text: "In a civil union",
        id: uuid.v4(),
        data: 8
      },
    ],
    selectedRelationshipStatus: 0
  },
  reducers: {
    selectRelatioshipStatus: (state, action) => {
      return {
        ...state,
        selectedRelationshipStatus: action.payload
      }
    }
  }
})

export const { selectRelatioshipStatus } = relationshipStatusCollapsibleSlice.actions
export default relationshipStatusCollapsibleSlice.reducer