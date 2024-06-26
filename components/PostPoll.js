import { StyleSheet, Text, View, TouchableOpacity, LayoutAnimation } from 'react-native'
import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import PostPollVariant from './PostPollVariant'
import { COLORS } from '../constants/theme'

const PostPoll = ({ poll, accessToken, isLightTheme }) => {
  const [hasVoted, setHasVoted] = React.useState(false)
  const vote = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
    setHasVoted(true)
  }
  return (
    <View style={[
      {borderWidth: 1, borderRadius: 5, padding: 5, gap: 10}, 
      isLightTheme ? {borderColor: COLORS.light_smoke} : {borderColor: COLORS.secondary}
    ]}>
      <View>
        {
          poll.question && 
          <Text style={[styles.question, isLightTheme ? {color: COLORS.black} : {color: COLORS.white}]}>{poll.question}</Text>
        }
        <View style={styles.pollInfoContainer}>
          <Text style={styles.pollInfoText}>{poll.anonymous ? 'Anonymous poll' : 'Public poll'}</Text>
          <Entypo name='dot-single' size={20} color={COLORS.secondary}/>
          <Text style={styles.pollInfoText}>{poll.votes}</Text>
        </View>
      </View>
      {
        poll.answers.map(item => {
          return (
            <PostPollVariant 
              text={item.text} 
              rate={item.rate} 
              votes={item.votes} 
              id={item.id} 
              key={item.id}
              accessToken={accessToken}
              isLightTheme={isLightTheme}
              multiple={poll.multiple}
              hasVoted={hasVoted}
              setHasVoted={setHasVoted}
            />
          )
        })
      }
      {
        poll.multiple && !hasVoted ?
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity style={[styles.voteBtn, ]} activeOpacity={0.8} onPress={vote}>
            <Text style={{fontSize: 15, color: COLORS.white}}>{hasVoted ? 'Voted' : 'Vote'}</Text>
          </TouchableOpacity>
        </View> : null
      }
    </View>
  )
}

export default PostPoll

const styles = StyleSheet.create({
  question: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  pollInfoContainer: {
    flexDirection: 'row'
  },
  pollInfoText: {
    fontSize: 14,
    color: COLORS.secondary
  },
  voteBtn: {
    borderRadius: 5, 
    backgroundColor: COLORS.primary, 
    width: 100, 
    height: 30, 
    justifyContent: 'center', 
    alignItems: 'center',
  }
})