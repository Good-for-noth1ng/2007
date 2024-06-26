import { createSlice } from "@reduxjs/toolkit";
import uuid from 'react-native-uuid'

const fromButtonData = [
  {
    id: 64738292,
    text: 'From',
    data: 14
  }
]

const toButtonData = [
  {
    id: 64008292,
    text: 'To',
    data: 80
  }
]

for (let i = 14; i < 81; i++) {
    const fromId = uuid.v4()
    const toId = uuid.v4()
    fromButtonData.push({id: fromId, text: `from ${i}`, data: i})
    toButtonData.push({id: toId, text: `to ${i}`, data: i})
}

export const ageCollapsibleSlice = createSlice({
  name: 'ageRange',
  initialState: {
    fromButton: {
      id: 137049350,
      buttonListItems: fromButtonData
    },
    toButton: {
      id: 137049353,
      buttonListItems: toButtonData
    },
    selectedAgeFrom: 14,
    selectedAgeTo: 80,
  },
  reducers: {
    selectAgeFrom: (state, action) => {
      return {
        ...state,
        selectedAgeFrom: action.payload
      }
    },
    selectAgeTo: (state, action) => {
      return {
        ...state,
        selectedAgeTo: action.payload
      }
    } 

  }
})

export const { selectAgeFrom, selectAgeTo } = ageCollapsibleSlice.actions
export default ageCollapsibleSlice.reducer