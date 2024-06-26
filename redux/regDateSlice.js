import { createSlice } from "@reduxjs/toolkit";

export const regDateSlice = createSlice({
  name: 'userRegDate',
  initialState: {
    name: '',
    imgUrl: '',
    registrationDate: '',
    userId: 0,
    isFetching: false,
    isOpen: false
  },
  reducers: {
    setUserForFetchingInfo: (state, action) => {
      return {
        ...state,
        name: action.payload.name,
        imgUrl: action.payload.imgUrl,
        registrationDate: action.payload.registrationDate,
        userId: action.payload.userId,
        isFetching: action.payload.isFetching,
        isOpen: action.payload.isOpen
      }
    },
    startFetchingProfileInfo: (state, action) => {
      return {
        ...state,
        isOpen: true,
        isFetching: true
      }
    },
    closeRegInfo: (state, action) => {
      return {
        ...state,
        isOpen: false    
      }
    }
  }
})
export const { setUserForFetchingInfo, startFetchingProfileInfo, closeRegInfo } = regDateSlice.actions;
export default regDateSlice.reducer;