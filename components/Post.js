import { StyleSheet, Text, View, Image, InteractionManager, Animated, ToastAndroid , LayoutAnimation, Dimensions, TouchableOpacity} from 'react-native'
import React, { useState } from 'react'
import * as Clipboard from 'expo-clipboard'
import { COLORS } from '../constants/theme'
import { useSelector, useDispatch } from 'react-redux'
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
import { expandShadow, collapseShadow } from '../redux/globalShadowSlice'
// import PostArticle from './PostArticle'

const globalShadowHeight = Dimensions.get('window').height
const globalShadowWidth = Dimensions.get('window').width

const Post = ({data, navigation, openedPost, isLigthTheme, id, accessToken, fromNewsfeed, func, lang,}) => {
  let postPhotos = []
  let postDocs = []
  let postLinks = []
  let postVideos = []
  let postArticle = []
  let postAudios = []
  let postPoll
  const [showNotInterested, setShowNotInterested] = React.useState(false)
  
  const openPost = () => {
    if (openedPost && data.type !== 'article') {
      navigation.push('OpenPost', {ownerId: data.owner_id ? data.owner_id : data.source_id, postId: data.id ? data.id : data.post_id, shouldScroll: false}) // source_id, post_id
    }
  }
  
  const initPostData = () => {
    // data.type === post
    if (data.attachments !== undefined) {  
      let attachments
      if (data.copy_history !== undefined) {
        attachments = data.copy_history[0].attachments
      } else {
        attachments = data.attachments
      }
      for (let i = 0; i < attachments.length; i++) {
        if (attachments[i].type === 'photo') {
          postPhotos.push(attachments[i].photo)
        } else if (attachments[i].type === 'doc') {
          postDocs.push(attachments[i].doc)
        } else if(attachments[i].type === 'link') {
          postLinks.push(attachments[i].link)
        } else if (attachments[i].type === 'video') {
          postVideos.push(attachments[i].video)
          // postPhotos.push(attachments[i].video)
        } else if (attachments[i].type === 'poll') {
          postPoll = attachments[i].poll
        } else if (attachments[i].type === 'article') {
          postArticle.push(attachments[i])
        } else if (attachments[i].type === 'audio') {
          postAudios.push(attachments[i])
        }
      }
    } else if (data.type === 'audio') {
      // console.log(data.audio.items[0])
      for (let j = 0; j < data.audio.items.length; j++) {
        postAudios.push({ audio: data.audio.items[j]})
      }
    } else if (data.type === 'video') {
      for (let j = 0; j < data.video.items.length; j++) {
        postVideos.push(data.video.items[j])
      }
    }
  }

  initPostData()
  
  const cancelShowNotInterested = async () => {
    const url = `https://api.vk.com/method/newsfeed.unignoreItem?access_token=${accessToken}&v=5.131&owner_id=${data.owner_id}&type=wall&item_id=${data.id ? data.id : data.post_id}`
    const res = await fetch(url)
    const par = await res.json()
    if (par.response == 1) {
      setShowNotInterested(prev => !prev)
    } else {
      ToastAndroid.show(lang == 'ru' ? 'Ошибка соединения' : 'Network Error', ToastAndroid.SHORT)
    }
  }
  
  if (showNotInterested) {
    return (
      <View style={[{borderRadius: 5, gap: 10, marginTop: 5, padding: 5, alignItems: 'center'}, isLigthTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark}]}>
        <Text style={[{fontSize: 15}, isLigthTheme ? {color: COLORS.black} : {color: COLORS.primary_text}]}>{lang == 'ru' ? 'Посты этого сообщества будут показываться реже' : "This community's posts will be shown less often"}</Text>
        <View style={{flexDirection: 'row', gap: 10}}>
          <TouchableOpacity style={{padding: 5, backgroundColor: COLORS.primary, borderRadius: 5}} onPress={cancelShowNotInterested}>
            <Text style={[{fontSize: 15, color: COLORS.white}]}>{lang == 'ru' ? 'Отмена' : 'Cancel'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{padding: 5, backgroundColor: COLORS.primary, borderRadius: 5}}>
            <Text style={[{fontSize: 15, color: COLORS.white}]}>{lang == 'ru' ? 'Пожаловаться' : 'Report'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  return (
    <View 
      style={[
        styles.postContainer, 
        isLigthTheme ? {backgroundColor: COLORS.white} : {backgroundColor: COLORS.primary_dark},
        openedPost && {borderRadius: 5}
      ]}

    >
      <PostHeader 
        dataDate={data.date} 
        navigation={navigation}
        isLightTheme={isLigthTheme}
        isPinned={data.is_pinned}
        author={data.author}
        shouldShowMoreButton={openedPost}
        data={data}
        fromNewsfeed={fromNewsfeed}
        setShowNotInterested={setShowNotInterested}
        lang={lang}
        func={func}
      />
      <TouchableOpacity activeOpacity={1} onPress={openPost}>
        <PostDivider dividerHeight={12}/>
        {
          data.text ? (
            <>
              <PostText lang={lang} dataText={data.text} toOpen={openedPost} isLightTheme={isLigthTheme}/>
              <PostDivider dividerHeight={6}/>
            </>
          ) : null
        }
      </TouchableOpacity>
      {
        postPoll ?
          <>
            <PostPoll poll={postPoll} isLightTheme={isLigthTheme} accessToken={accessToken}/>
            <PostDivider dividerHeight={5}/>
          </>
          : null
      }
      { 
        postPhotos ? (
          <>
            <PostPhotos accessToken={accessToken} lang={lang} postPhotos={postPhotos} navigation={navigation} ownerId={data.owner_id} date={data.date} author={data.author}/>
            {!postVideos && <PostDivider dividerHeight={5}/>}   
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
            <PostAudio postAudios={postAudios} isLightTheme={isLigthTheme}/>
            <PostDivider dividerHeight={5}/>
          </> 
        ) : null
      }
      {
        postDocs ? <PostFiles postDocs={postDocs} isLightTheme={isLigthTheme} lang={lang}/> : <PostDivider dividerHeight={5}/>
      }
      {
        postLinks ? ( 
          <>
            <PostLinks postLinks={postLinks} isLightTheme={isLigthTheme} accessToken={accessToken}/>
            <PostDivider dividerHeight={6} />
          </>
        ) : null
      }
      {
        postArticle ? (
          <>
            <PostLinks postLinks={postArticle} isLightTheme={isLigthTheme} accessToken={accessToken}/>
            <PostDivider dividerHeight={6} />
          </>
        ) : null
      }
      {
        data.signer ? 
        <PostSigner author={data.signer} navigation={navigation}/> :
        null
      }
      {
        !data.shouldRemoveBottom ?  
          <BottomPost 
            dataComments={data.comments} 
            dataLikes={data.likes} 
            dataReposts={data.reposts} 
            openedPost={openedPost}
            data={data}
            navigation={navigation}
            isLightTheme={isLigthTheme}
            accessToken={accessToken}
          /> : null
      }
      
    </View>
  )
}
//TODO: fix memoization
// export default memo(Post, compareStates)
export default React.memo(Post, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id && prevProps.isLigthTheme === nextProps.isLigthTheme
})

const styles = StyleSheet.create({
  postContainer: {
    padding: 10,
    marginTop: 5,
    // borderRadius: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    position: 'relative'
  },
})