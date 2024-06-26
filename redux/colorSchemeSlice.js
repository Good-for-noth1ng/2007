import { createSlice } from "@reduxjs/toolkit";

export const colorSchemeSlice = createSlice({
  name: 'colorScheme',
  initialState: {
    isCurrentSchemeLight: true
  },
  reducers: {
    toggleCurrentColorScheme: (state, action) => {
      return {
        ...state,
        isCurrentSchemeLight: !state.isCurrentSchemeLight 
      }
    }
  }
});
export const { toggleCurrentColorScheme } = colorSchemeSlice.actions;
export default colorSchemeSlice.reducer;
