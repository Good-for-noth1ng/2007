import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useDispatch } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CommentReply from './CommentReply'
import { setDataForFetchingCommentThread } from '../redux/commentsSlice'
import { COLORS } from '../constants/theme'
import DividerWithLine from './DividerWithLine'

const CommentReplies = ({lang, threadComments, threadCount, fetchProfileInfo, startOfThreadId, navigation, ownerId, postId, isLightTheme, openCommentMenu, accessToken, type}) => {
  // const dispatch = useDispatch()

  //TODO: pass props directly to screen
  const navigateToCommentThread = () => {
    console.log(ownerId, postId, startOfThreadId)
    navigation.push('CommentThread', {threadMainCommentId: startOfThreadId, ownerId: ownerId, postId: postId,})
  }
  return (
    <View 
      style={[
        styles.repliesListContainer, 
        isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}
      ]}
    >
      {
        threadComments.length > 0 ? 
          threadComments.length === 2 ?
            <>
              <CommentReply 
                lang={lang}
                commentDate={threadComments[0].date} 
                from_id={threadComments[0].from_id} 
                commentText={threadComments[0].text}
                likes={threadComments[0].likes.count}
                commentId={threadComments[0].id}
                author={threadComments[0].author}
                fetchProfileInfo={fetchProfileInfo}
                isLightTheme={isLightTheme}
                openCommentMenu={openCommentMenu}
                ownerId={ownerId}
                navigation={navigation}
                attachments={threadComments[0].attachments}
                is_deleted={threadComments[0].is_deleted}
                accessToken={accessToken}
                type={type}
              />
              <DividerWithLine dividerColor={isLightTheme ? COLORS.white : COLORS.primary_dark} dividerHeight={5}/>
              <CommentReply
                lang={lang}
                commentDate={threadComments[1].date} 
                from_id={threadComments[1].from_id} 
                commentText={threadComments[1].text}
                likes={threadComments[1].likes.count}
                commentId={threadComments[1].id}
                author={threadComments[1].author}
                fetchProfileInfo={fetchProfileInfo}
                isLightTheme={isLightTheme} 
                openCommentMenu={openCommentMenu}
                ownerId={ownerId}
                navigation={navigation}
                attachments={threadComments[1].attachments}
                is_deleted={threadComments[1].is_deleted}
                accessToken={accessToken}
                type={type}
              />
              <DividerWithLine dividerColor={!isLightTheme ? COLORS.white : COLORS.primary_dark} dividerHeight={7}/>
              {
                threadCount > 2 &&
                <TouchableOpacity style={styles.showMoreContainer} onPress={navigateToCommentThread}>
                  <View style={styles.showMoreCommentsButton}> 
                    <AntDesign name={'arrowdown'} color={COLORS.primary} size={15}/>
                    <Text style={styles.showMoreCommentsButtonText}>{lang == 'ru' ? 'Показать еще' : 'Show more'}</Text>
                  </View>
                </TouchableOpacity>
              }
            </> : 
            <CommentReply 
              lang={lang}
              commentDate={threadComments[0].date} 
              from_id={threadComments[0].from_id} 
              commentText={threadComments[0].text}
              likes={threadComments[0].likes.count}
              commentId={threadComments[0].id}
              author={threadComments[0].author}
              fetchProfileInfo={fetchProfileInfo}
              isLightTheme={isLightTheme}
              openCommentMenu={openCommentMenu}
              ownerId={ownerId}
              navigation={navigation}
              attachments={threadComments[0].attachments}
              accessToken={accessToken}
              type={type}
            /> 
        : null
      }
    </View>
  )
}

export default CommentReplies

const styles = StyleSheet.create({
  repliesListContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '100%',
    paddingLeft: 5,
    paddingRight: 5,
  },
  showMoreContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // backgroundColor: COLORS.secondary,
    paddingLeft: '15%'
  },
  showMoreCommentsButton: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  showMoreCommentsButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700'
  }
})