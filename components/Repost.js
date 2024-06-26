import { StyleSheet, Text, View, TouchableOpacity, Animated, ToastAndroid, LayoutAnimation } from 'react-native'
import React from 'react'
import * as Clipboard from 'expo-clipboard'
import BottomPost from './BottomPost'
import PostHeader from './PostHeader'
import PostText from './PostText'
import PostPhotos from './PostPhotos'
import PostFiles from './PostFiles'
import PostLinks from './PostLinks'
import PostVideos from './PostVideos'
import PostDivider from './PostDivider'
import PostPoll from './PostPoll'
import PostAudio from './PostAudio'
import PostSigner from './PostSigner'
import { useDispatch } from 'react-redux'
import { COLORS } from '../constants/theme'
import { expandShadow, collapseShadow } from '../redux/globalShadowSlice'

const Repost = ({ data, navigation, openedPost, isLightMode, id, accessToken, func, lang }) => {
  let postPhotos = []
  let postDocs = []
  let postLinks = []
  let postVideos = []
  let postArticle = []
  let postAudios = []
  let postPoll
  const isLightTheme = isLightMode

  if (data.attachments !== undefined && data.type === 'post') {  
    let attachments
    if (data.copy_history !== undefined) {
      attachments = data.copy_history[0].attachments
    } else {
      attachments = data.attachments
    }
    if (attachments !== undefined) {
    for (let i = 0; i < attachments.length; i++) {
      if (attachments[i].type === 'photo') {
        postPhotos.push(attachments[i].photo)
      } else if (attachments[i].type === 'doc') {
        postDocs.push(attachments[i].doc)
      } else if(attachments[i].type === 'link') {
        postLinks.push(attachments[i].link)
      } else if (attachments[i].type === 'video') {
        postVideos.push(attachments[i].video)
      } else if (attachments[i].type === 'audio') {
        postAudios.push(attachments[i])
      } else if (attachments[i].type === 'poll') {
        postPoll = attachments[i].poll
      } else if (attachments[i].type === 'article') {
        postArticle.push(attachments[i])
      }
    }}
  }

  const openPost = () => {
    if(openedPost) {
      navigation.push(
        'OpenPost', 
        {
          ownerId: data.owner_id ? data.owner_id : data.source_id, 
          postId: data.id ? data.id : data.post_id, 
          shouldScroll: false
        }
      )
    }
  }

  return (
    <View style={[
      styles.postContainer, 
      isLightTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark},
      openedPost && {borderRadius: 5}
    ]}>
      <PostHeader 
        dataDate={data.date}
        navigation={navigation} 
        isLightTheme={isLightTheme} 
        isRepost={false} 
        isPinned={data.is_pinned}
        author={data.author} 
        shouldShowMoreButton={openedPost}
        lang={lang}
        data={data}
        func={func}
      />
      <TouchableOpacity activeOpacity={1} onPress={openPost}>
        <PostDivider dividerHeight={12} />
        {
          data.text ? (
          <>
            <PostText dataText={data.text} toOpen={openedPost} isLightTheme={isLightTheme}/>
            <PostDivider dividerHeight={6}/>
          </>
          ) : null 
        }
      </TouchableOpacity>
      <PostHeader 
        // sourceId={data.copy_history[0].owner_id !== undefined && data.copy_history[0].owner_id } 
        dataDate={data.copy_history[0].date} 
        // from_id={data.copy_history[0].from_id !== undefined && data.copy_history[0].from_id}
        navigation={navigation}
        isRepost={true} 
        isLightTheme={isLightTheme}
        author={data.copy_history[0].author}
        lang={lang}
        // onMorePress={} //TODO: add func
      />
      <TouchableOpacity activeOpacity={1} onPress={openPost}>
        <PostDivider dividerHeight={12} />
        {
          data.copy_history[0].text ? (
            <>
              <PostText dataText={data.copy_history[0].text} isLightTheme={isLightTheme} toOpen={openedPost}/>
              <PostDivider dividerHeight={6}/>
            </>
          ) : null
        }
      </TouchableOpacity>
      {
        postPoll ?
          <>
            <PostPoll poll={postPoll} isLightTheme={isLightTheme} accessToken={accessToken}/>
            <PostDivider dividerHeight={5}/>
          </>
          : null
      }
      {
        postPhotos ? (
          <>
            <PostPhotos lang={lang} postPhotos={postPhotos} navigation={navigation} ownerId={data.owner_id} date={data.date} author={data.author}/>
            <PostDivider dividerHeight={5}/>  
          </>
        ) : null
      }
      {
        postVideos ? (
          <>
            <PostVideos postVideos={postVideos} navigation={navigation}/>
            <PostDivider dividerHeight={5}/>  
          </>
        ) : null
      }
      {
        postAudios ? (
          <> 
            <PostAudio postAudios={postAudios} isLightTheme={isLightTheme}/>
            <PostDivider dividerHeight={5}/>
          </> 
        ) : null
      }
      {
        postDocs ? <PostFiles postDocs={postDocs} isLightTheme={isLightTheme}/>  : <PostDivider dividerHeight={5}/>
      }
      { 
        postLinks ? ( 
          <>
            <PostLinks postLinks={postLinks} isLightTheme={isLightTheme}/>
            <PostDivider dividerHeight={6} />
          </>
        ) 
          : null
      }
      {
        postArticle ? (
          <>
            <PostLinks postLinks={postArticle} isLightTheme={isLightTheme} accessToken={accessToken}/>
            <PostDivider dividerHeight={6} />
          </>
        ) : null
      }
      {
        data.signer ? 
        <PostSigner author={data.signer} navigation={navigation}/> :
        null
      }
      <BottomPost 
        dataComments={data.comments} 
        dataLikes={data.likes} 
        dataReposts={data.reposts}
        openedPost={openedPost}
        navigation={navigation}
        data={data}
        isLightTheme={isLightTheme}
      />
    </View>  
  )
}

export default React.memo(Repost, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id && prevProps.isLightMode === nextProps.isLightMode
})

const styles = StyleSheet.create({
  postContainer: {
    padding: 10,
    marginTop: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
})