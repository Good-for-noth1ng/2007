import { createSlice } from "@reduxjs/toolkit";

export const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    profiles: [],
    groups: [],
    isAuthorInfoOpen: false,
    authorId: null,
    authorName: '',
    authorImgUrl: '',
    registrationDate: '',
    authorCommentId: 0,
    authorInfoIsFetching: false,
    threadReplies: [], 
    threadMainCommentId: 0,
    ownerId: 0,
    postId: 0,
    commentsSortType: 'asc',
  },
  reducers: {
    setCommentsSortType: (state, action) => {
      let sortType
      if (state.commentsSortType === 'asc') {
        sortType = 'desc'
      } else {
        sortType = 'asc'
      }
      return {
        ...state,
        commentsSortType: sortType
      }
    },
    setProfiles: (state, action) => {
      return {
        ...state,
        profiles: action.payload
      }
    },
    pushProfiles: (state, action) => {
      const newState = [...state.profiles]
        for (let i = 0; i < action.payload.length; i++) {
          newState.push(action.payload[i])
        }
        return {
          ...state,
          profiles: newState
        }
    },
    setGroups: (state, action) => {
      return {
        ...state,
        groups: action.payload
      }
    },
    pushGroups: (state, action) => {
      const newState = [...state.groups]
      for (let i = 0; i < action.payload.length; i++) {
        newState.push(action.payload[i])
      }
      return {
        ...state,
        groups: newState
      }
    },
    closeAuthorInfo: (state, action) => {
      return {
        ...state,
        isAuthorInfoOpen: false
      }
    },
    openAuthorInfo: (state, action) => {
      return {
        ...state,
        isAuthorInfoOpen: true
      }
    },




    setRegistrationData: (state, action) => {
      return {
        ...state,
        authorId: action.payload.authorId,
        authorName: action.payload.authorName,
        authorImgUrl: action.payload.authorImgUrl,
        registrationDate: action.payload.registrationDate,
        authorCommentId: action.payload.authorCommentId,
        authorInfoIsFetching: false,
        ownerId: action.payload.ownerId,
        commentText: action.payload.commentText
      }
    },
    // setAuthorName: (state, action) => {
    //   return {
    //     ...state,
    //     authorName: action.payload
    //   }
    // },
    // setAuthorImgUrl: (state, action) => {
    //   return {
    //     ...state,
    //     authorImgUrl: action.payload
    //   }
    // },
    // setRegistrationDate: (state, action) => {
    //   return {
    //     ...state,
    //     registrationDate: action.payload
    //   }
    // },
    startLoadingRegistrationDate: (state, action) => {
      return {
        ...state,
        authorInfoIsFetching: true,
        isAuthorInfoOpen: true
      }
    },
    // stopLoadingRegistrationDate: (state, action) => {
    //   return {
    //     ...state,
    //     authorInfoIsFetching: false
    //   }
    // },



    setThreadData: (state, action) => {
      return {
        ...state,
        threadReplies: action.payload.items,
        profiles: [...state.profiles, ...action.payload.profiles],
        groups: [...state.groups, ...action.payload.groups],
      }
    },
    pushThreadData: (state, action) => {
      return {
        ...state,
        threadReplies: [...state.threadReplies, ...action.payload.items],
        profiles: [...state.profiles, ...action.payload.profiles],
        groups: [...state.groups, ...action.payload.groups],
      }
    },
    setDataForFetchingCommentThread: (state, action) => {
      return {
        ...state,
        threadMainCommentId: action.payload.threadMainCommentId,
        ownerId: action.payload.ownerId,
        postId: action.payload.postId,
      }
    }
  }
});
export const { 
    setProfiles,
    pushProfiles,
    setGroups,
    pushGroups,
    closeAuthorInfo, 
    openAuthorInfo, 
    setAuthorName, 
    setAuthorImgUrl, 
    setRegistrationDate,
    startLoadingRegistrationDate,
    stopLoadingRegistrationDate,
    setThreadData,
    pushThreadData,
    setDataForFetchingCommentThread,
    setRegistrationData,
    setCommentsSortType
} = commentsSlice.actions;
export default commentsSlice.reducer;