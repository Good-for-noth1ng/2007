import { createSlice } from "@reduxjs/toolkit";

export const globalShadowSlice = createSlice({
    name: 'globalShadow',
    initialState: {
      isOpen: false,
      dropdownX: 0,
      dropdownY: 0,
      data: null,
      dropdownType: ''
    },
    reducers: {
      expandShadow: (state, action) => {
        return {
          ...state,
          isOpen: true,
          dropdownX: action.payload.dropdownX,
          dropdownY: action.payload.dropdownY,
          dropdownType: action.payload.dropdownType,
          data: action.payload?.data
        }
      },
      collapseShadow: (state, action) => {
        return {
          ...state,
          isOpen: false,  
        }
      } 
  
    }
  })
  
  export const { expandShadow, collapseShadow } = globalShadowSlice.actions
  export default globalShadowSlice.reducer