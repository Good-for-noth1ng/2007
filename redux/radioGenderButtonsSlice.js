import { createSlice } from "@reduxjs/toolkit";

export const radioGenderButtonsSlice = createSlice({
  name: 'radioGender',
  initialState: {
    buttons: [
      {
        id: 0,
        text: 'Any',
      },
      {
        id: 1,
        text: 'Female',
      },
      {
        id: 2,
        text: 'Male',
      },
    ],
    chosenId: 0
  },
  reducers: {
    chooseButton: (state, action) => {
      return {
        ...state,
        chosenId: action.payload
      }
    }
  }
})
export const {chooseButton} = radioGenderButtonsSlice.actions
export default radioGenderButtonsSlice.reducer