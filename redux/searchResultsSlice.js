import { createSlice } from "@reduxjs/toolkit";

export const searchResultsSlice = createSlice({
    name: 'searchResults',
    initialState: {
        groupsList: []
    },
    reducers: {
        setGroupsList: (state, action) => {
            return {
                ...state,
                groupsList: action.payload
            }
        },
        pushGroupsList: (state, action) => {
            return {
                ...state,
                groupsList: [...state.groupsList, ...action.payload]
            }      
        }
    }
});
export const { setGroupsList, pushGroupsList} = searchResultsSlice.actions;
export default searchResultsSlice.reducer;