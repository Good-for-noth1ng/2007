import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice'
import newsReducer from './newsSlice'
import commentsReducer from "./commentsSlice";
import groupReducer from "./groupSlice";
import searchResultsReducer from "./searchResultsSlice";
import colorSchemeReducer from "./colorSchemeSlice";
import userWallReducer from "./userWallSlice";
import optionsReducer from "./optionsSlice"; 
import radioGenderButtonsReducers from "./radioGenderButtonsSlice";
import relationshipStatusCollapsibleReducer from "./relationshipStatusCollapsibleOption";
import ageCollapsibleReducer from "./ageCollapsibleOption"
import sortGroupsCollapsibleReducer from "./sortGroupsCollapsibleOption"
import communityTypeCollapsibleOption from "./communityTypeCollapsibleOption";
import globalShadowReducer from "./globalShadowSlice";
import regDateReducer from "./regDateSlice";
import audioReducer from "./audioSlice";
import audioProgressReducer from "./audioProgressSlice"
import downloadReducer from "./downloadSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    news: newsReducer,
    comments: commentsReducer,
    group: groupReducer,
    searchResults: searchResultsReducer,
    colorScheme: colorSchemeReducer,
    userWall: userWallReducer,
    options: optionsReducer,
    radioGender: radioGenderButtonsReducers,
    relationshipStatus: relationshipStatusCollapsibleReducer,
    ageRange: ageCollapsibleReducer,
    groupsSortType: sortGroupsCollapsibleReducer,
    communityType: communityTypeCollapsibleOption,
    globalShadow: globalShadowReducer,
    userRegDate: regDateReducer, 
    audio: audioReducer,
    audioProgress: audioProgressReducer,
    download: downloadReducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false
    })
  }
})