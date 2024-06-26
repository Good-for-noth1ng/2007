import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import uuid from 'react-native-uuid'

export const newsSlice = createSlice({
  name: 'news',
  initialState: { 
    openedPost: null,
    items: [],
    groups: [],
    profiles: [],
    currentPage: 'News',
    nextFrom: '',
    scrollToComments: false
  },
  reducers: {
    setOpenedPost: (state, action) => {
      return {
        ...state,
        openedPost: action.payload
      }
    },
    setScrolling: (state, action) => {
      return {
        ...state,
        scrollToComments: action.payload
      }
    },
    setItems: (state, action) => {
      return {
        ...state,
        items: action.payload
      }
    },
    pushItems: (state, action) => {
      return {
        ...state,
        items: state.items.concat(action.payload)
      }
    },
    setGroups: (state, action) => {
      return {
        ...state,
        groups: action.payload
      }
    },
    pushGroups: (state, action) => {
      return {
        ...state,
        groups: state.groups.concat(action.payload)
      }
    },
    setProfiles: (state, action) => {
      return {
        ...state,
        profiles: action.payload
      }
    },
    pushProfiles: (state, action) => {
      return {
        ...state, 
        profiles: state.profiles.concat(action.payload)
      }
    },
    setComments: (state, action) => {
      return {
        ...state,
        comments: action.payload
      }
    },
    setCurrentPage: (state, action) => {
      return {
        ...state,
        currentPage: action.payload
      }
    },
    setNextFrom: (state, action) => {
      return {
        ...state,
        nextFrom: action.payload
      }
    }
  },
})
export const { 
    setOpenedPost, 
    setItems, 
    setGroups, 
    setProfiles, 
    setCurrentPage, 
    setNextFrom, 
    pushGroups, 
    pushItems, 
    pushProfiles,
    setScrolling 
} = newsSlice.actions
export default newsSlice.reducer