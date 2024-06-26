import { StyleSheet, Text, View, TouchableOpacity, LayoutAnimation } from 'react-native'
import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo' 
import { COLORS } from '../constants/theme'

const PostPollVariant = ({ isLightTheme, id, rate, text, votes, ownerId, accessToken, pollId, multiple, hasVoted, setHasVoted }) => {
  const [checked, setChecked] = React.useState(false)
  const checkVote = () => {
    setChecked(prev => !prev)
  }
  const vote = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
    setChecked(true)
    setHasVoted(true)
  }
  return (
    <TouchableOpacity 
      style={[styles.answ, {backgroundColor: COLORS.light_blue}]} 
      activeOpacity={hasVoted? 1 : 0.8}
      onPress={!hasVoted ? multiple ? checkVote : vote : () => {}}
    >
      <View style={[
        styles.voted, 
        {backgroundColor: COLORS.primary},  
        rate ? {width: `${rate}%`} : {width: 0},
        checked ? {opacity: 1} : {opacity: 0.7}
        ]}
      />
      <View style={styles.voteContainer}>
        <Text style={[
          styles.optionText,
          // isLightTheme ? {color: COLORS.black} : {color: COLORS.primary_text}
        ]}>{text}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Text>{Math.round(rate)} %</Text>
          {
            multiple && !hasVoted?
            <View
              style={{width: 15, height: 15, borderRadius: 5, borderWidth: 1, borderColor: COLORS.secondary}}
            >
              {
                checked ?
                <Entypo name='check' size={15} color={COLORS.secondary}/> : 
                null
              }
            </View> :
            null
          }
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default PostPollVariant

const styles = StyleSheet.create({
  answ: {
    flexDirection: 'row',
    width: '100%',
    minHeight: 35,
    // height: 100,
    flex: 1,
    borderRadius: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  voteContainer: {
    position: 'relative', 
    zIndex: 2, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '100%',
    height: '100%',
    paddingLeft: 10, 
    paddingRight: 10
  },
  optionText: {
    fontSize: 15,
    width: '80%',
    // height: 100
  },
  voted: {
    height: '100%',
    borderRadius: 5,
    position: 'absolute',
    zIndex: 1,

  }
})