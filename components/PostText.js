import { StyleSheet, Text, View, TouchableOpacity, UIManager, Platform, LayoutAnimation } from 'react-native'
import React, { useState, useCallback, memo } from 'react'
import { COLORS } from '../constants/theme'
import { getHyperlinkInText } from '../utils/hyperlinks'
//dataText
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const PostText = ({dataText, toOpen, isLightTheme}) => {
  let postText = ''
  let readMoreText
  if (dataText !== undefined) {
    if (dataText.split(' ').length > 50 && toOpen) {
      postText = dataText.split(' ').slice(0, 70).join(' ')
      readMoreText = true
    } else {
      readMoreText = false
      postText = dataText
    }
  } else {
    postText = ''
    readMoreText = false
  }
  const [text, setText] = useState(postText)
  const [readMore, setReadMore] = useState(readMoreText)
  const handleReadMore = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setText(dataText)
    setReadMore(false)
  }
   
  return (
    <View style={styles.textContainer}>
      <Text style={isLightTheme ? styles.textLight : styles.textDark}>
        {getHyperlinkInText(text)}
        {readMore ? '...' : ''}
      </Text>
        {readMore ? 
          <TouchableOpacity 
            onPress={handleReadMore} 
            style={{width: '100%', height: 28}} 
            activeOpacity={0.6}
          >
            <Text style={styles.showMoreText}>
              {'Read more...'}
            </Text>
          </TouchableOpacity>
        : null}
    </View>
  )
}

export default PostText

const styles = StyleSheet.create({
    showMoreText: {
        color: COLORS.primary,
        fontWeight: '700'
    },
    textLight: {
      fontSize: 15,
      color: COLORS.black
    },
    textDark: {
      fontSize: 15,
      color: COLORS.primary_text
    }
})