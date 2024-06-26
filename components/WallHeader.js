import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, SafeAreaView, } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme'
import DividerWithLine from '../components/DividerWithLine'
import WallHeaderGeneralInfo from './WallHeaderGeneralInfo';
import WallHeaderCountersGrid from './WallHeaderCountersGrid';
import WallHeaderButtons from './WallHeaderButtons';
import WallHeaderPostSuggestButton from './WallHeaderPostSuggestButton';

const WallHeader = ({name, membersCount, avatarUrl, status, isMember, counters, lastSeen, isOnlineUsingMobile, isOnlineUsingPC, canSendFriendRequest, canWritePrivateMessage, isUserWall, ownerId, navigation }) => {
  return (
    <View style={styles.mainContainer}>
      <WallHeaderGeneralInfo 
        name={name}
        avatarUrl={avatarUrl}
        status={status}
        lastSeen={lastSeen}
        isOnlineUsingMobile={isOnlineUsingMobile}
        isOnlineUsingPC={isOnlineUsingPC}
      />
      <WallHeaderButtons
        isUserWall={isUserWall} 
        isMember={isMember} 
        canSendFriendRequest={canSendFriendRequest} 
        canWritePrivateMessage={canWritePrivateMessage}
      />
      <DividerWithLine dividerHeight={10}/>
      <WallHeaderCountersGrid membersCount={membersCount} counters={counters} ownerId={ownerId} navigation={navigation}/>
      <DividerWithLine dividerHeight={10}/>
      <WallHeaderPostSuggestButton />
    </View>
  )
}

export default WallHeader

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
    backgroundColor: COLORS.very_dark_gray,
    borderRadius: 5,
    marginTop: 5
  },
})