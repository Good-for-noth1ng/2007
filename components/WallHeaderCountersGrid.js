import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import uuid from 'react-native-uuid';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { COLORS } from '../constants/theme'
import { getShortagedNumber } from '../utils/numShortage'
import { getNameInGroupHeader } from '../utils/getNameByKey';
//TODO: add topic screen
const WallHeaderCountersGrid = ({ membersCount, counters, ownerId, navigation, canAccess, isUserOnHisOwnPage, author, lang }) => {
  let countersGrid = []
  let row = []
  
  const navToGifts = () => {
    if (canAccess) {
      navigation.push('Gifts', { ownerId })
    }
  }

  const navigateToTopics = () => {
    if (canAccess) {
      navigation.push('Topics', {ownerId})
    }
  }

  const navigateToFriends = () => {
    if (isUserOnHisOwnPage) {
      const drawerNavigation = navigation.getParent()
      drawerNavigation.navigate('Friends', {userId: ownerId})
    } else {
      if (canAccess) {
        navigation.push('FriendsList', {userId: ownerId})
      }
    }

  }

  const navigateToAlbums = () => {
    if (canAccess) {
      navigation.push('PhotoAlbumsList', {ownerId})
    }
  }
  
  const navigateToPhotos = () => {
    if (isUserOnHisOwnPage) {
      const drawerNavigation = navigation.getParent()
      drawerNavigation.navigate('PhotosRoute')
    } else {
      if (canAccess) {
        navigation.push('Photos', { ownerId: ownerId, author: author })
      }
    }
  }

  const navigateToVideosList = () => {
    if (isUserOnHisOwnPage) {
      const drawerNavigation = navigation.getParent()
      drawerNavigation.navigate('VideosRoute')
    } else {
      if (canAccess) {
        navigation.push('VideosList', { ownerId: ownerId })
      }
    }
  }

  const navigateToGroupsList = () => {
    if (isUserOnHisOwnPage) {
      const drawerNavigation = navigation.getParent()
      drawerNavigation.navigate('Communities')
    } else {
      if (canAccess) {
        navigation.push('UsersGroups', { userId: ownerId })
      }
    }
  }

  const navigateToSubscriptions = () => {
    if (canAccess) {
      navigation.push('SubscriptionsList', { userId: ownerId })
    }
  }

  const navigateToFollowersList = () => {
    if (canAccess) {
      navigation.push('FollowersList', { userId: ownerId })
    }
  }

  const navigateToMembersList = () => {
    if (canAccess) {
      navigation.push('MembersList', { groupId: -1 * ownerId })
    }
  }

  if (membersCount !== undefined) {
    row.push(
      <TouchableOpacity 
        key={uuid.v4()} 
        style={styles.counterButton} 
        onPress={navigateToMembersList}
        activeOpacity={canAccess ? 0.6 : 1}
      >
        <Text style={styles.counterNumber} key={uuid.v4()}>{getShortagedNumber(membersCount)}</Text>
        <Text style={styles.counterName} key={uuid.v4()}>members</Text>
      </TouchableOpacity>
    );
  }
  for (let key in counters) {
    if (row.length === 3) {
      countersGrid.push(<View key={uuid.v4()} style={styles.counterRow}>{row}</View>)
      row = []
    }
    if (
      key !== 'online_friends' && 
      key !== 'clips_followers' && 
      key !== 'clips_views' && 
      key !== 'clips' && 
      key !== 'clips_likes' && 
      key !== 'pages' &&
      key !== 'audio_playlists' &&
      key !== 'clips_followers' &&
      key !== 'market_services' &&
      key !== 'market' &&
      key !== 'video_playlists' &&
      key !== 'audios' &&
      key !== 'narratives' &&
      key !== 'podcasts' &&
      key !== 'posts' &&
      key !== 'user_photos' &&
      key !== 'addresses' &&
      key !== 'mutual_friends'
    ) {
      if (counters[key] !== 0 && key === 'followers') {
        row.push(
          <TouchableOpacity 
            activeOpacity={canAccess ? 0.6 : 1} 
            key={uuid.v4()} 
            style={styles.counterButton} 
            onPress={navigateToFollowersList}
          >
            <Text style={styles.counterNumber} key={uuid.v4()}>{getShortagedNumber(counters[key])}</Text>
            <Text style={styles.counterName} key={uuid.v4()}>{getNameInGroupHeader(key, lang)}</Text>
          </TouchableOpacity>
        )
      } else if (counters[key] !== 0 && key === 'subscriptions') {
        row.push(
          <TouchableOpacity
            activeOpacity={canAccess ? 0.6 : 1} 
            key={uuid.v4()} 
            style={styles.counterButton} 
            onPress={navigateToSubscriptions}
          >
            <Text style={styles.counterNumber} key={uuid.v4()}>{getShortagedNumber(counters[key])}</Text>
            <Text style={styles.counterName} key={uuid.v4()}>{getNameInGroupHeader(key, lang)}</Text>
          </TouchableOpacity>
        )
      } else if (counters[key] !== 0 && key === 'groups') {
        row.push(
          <TouchableOpacity 
            key={uuid.v4()} 
            style={styles.counterButton} 
            onPress={navigateToGroupsList}
            activeOpacity={canAccess ? 0.6 : 1}
          >
            <Text style={styles.counterNumber} key={uuid.v4()}>{getShortagedNumber(counters[key])}</Text>
            <Text style={styles.counterName} key={uuid.v4()}>{lang == 'ru' ? 'сообщества' : 'groups'}</Text>
          </TouchableOpacity>
        )
      } else if (counters[key] !== 0 && key === 'videos') {
        row.push(
          <TouchableOpacity 
            key={uuid.v4()} 
            style={styles.counterButton} 
            onPress={navigateToVideosList}
            activeOpacity={canAccess ? 0.6 : 1}
          >
            <Text style={styles.counterNumber} key={uuid.v4()}>{getShortagedNumber(counters[key])}</Text>
            <Text style={styles.counterName} key={uuid.v4()}>{getNameInGroupHeader(key, lang)}</Text>
          </TouchableOpacity>
        )
      } else if (counters[key] !== 0 && key === 'photos') {
        row.push(
          <TouchableOpacity 
            key={uuid.v4()} 
            style={styles.counterButton} 
            onPress={navigateToPhotos}
            activeOpacity={canAccess ? 0.6 : 1}
          >
            <Text style={styles.counterNumber} key={uuid.v4()}>{getShortagedNumber(counters[key])}</Text>
            <Text style={styles.counterName} key={uuid.v4()}>{getNameInGroupHeader(key, lang)}</Text>
          </TouchableOpacity>
        )
      } else if (counters[key] !== 0 && key === 'albums') {
        row.push(
          <TouchableOpacity 
            key={uuid.v4()} 
            style={styles.counterButton} 
            onPress={navigateToAlbums}
            activeOpacity={canAccess ? 0.6 : 1}
          >
            <Text style={styles.counterNumber} key={uuid.v4()}>{getShortagedNumber(counters[key])}</Text>
            <Text style={styles.counterName} key={uuid.v4()}>{getNameInGroupHeader(key, lang)}</Text>
          </TouchableOpacity>
        )
      } else if (counters[key] !== 0 && key === 'friends') {
        row.push(
          <TouchableOpacity 
            key={uuid.v4()} 
            style={styles.counterButton} 
            onPress={navigateToFriends}
            activeOpacity={canAccess ? 0.6 : 1}
          >
            <Text style={styles.counterNumber} key={uuid.v4()}>{getShortagedNumber(counters[key])}</Text>
            <Text style={styles.counterName} key={uuid.v4()}>{getNameInGroupHeader(key, lang)}</Text>
          </TouchableOpacity>
        )
      } else if (counters[key] !== 0 && key === 'topics') {
        row.push(
          <TouchableOpacity 
            key={uuid.v4()} 
            style={styles.counterButton} 
            onPress={navigateToTopics}
            activeOpacity={canAccess ? 0.6 : 1}
          >
            <Text style={styles.counterNumber} key={uuid.v4()}>{getShortagedNumber(counters[key])}</Text>
            <Text style={styles.counterName} key={uuid.v4()}>{getNameInGroupHeader(key, lang)}</Text>
          </TouchableOpacity>
        )
      } else if (counters[key] !== 0 && key === 'gifts') {
        row.push(
          <TouchableOpacity 
            key={uuid.v4()} 
            style={styles.counterButton} 
            onPress={navToGifts}
            activeOpacity={canAccess ? 0.6 : 1}
          >
            <Text style={styles.counterNumber} key={uuid.v4()}>{getShortagedNumber(counters[key])}</Text>
            <Text style={styles.counterName} key={uuid.v4()}>{getNameInGroupHeader(key, lang)}</Text>
          </TouchableOpacity>
        )
      } else if(counters[key] !== 0) {
        row.push(
          <TouchableOpacity 
            key={uuid.v4()} 
            style={styles.counterButton}
            activeOpacity={canAccess ? 0.6 : 1}
          >
            <Text style={styles.counterNumber} key={uuid.v4()}>{getShortagedNumber(counters[key])}</Text>
            <Text style={styles.counterName} key={uuid.v4()}>{getNameInGroupHeader(key, lang)}</Text>
          </TouchableOpacity>
        )
      }
    }
  }
  if (row.length > 0) {
    const key = uuid.v4()
    if (row.length === 1) {
      countersGrid.push(<View key={key} style={[styles.counterRow, {justifyContent: 'flex-start'}]}>{row}</View>)
    } else if (row.length === 2) {
      countersGrid.push(<View key={key} style={[styles.counterRow, {justifyContent: 'space-around'}]}>{row}</View>)
    } else {
      countersGrid.push(<View key={key} style={styles.counterRow}>{row}</View>)
    }
  }
  return (
    <View>
      {countersGrid}
    </View>
  )
}

export default WallHeaderCountersGrid

const styles = StyleSheet.create({
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'flex-start',
    gap: 4,
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
  },
  counterButton: {
    width: 105,
    height: 75,
    backgroundColor: COLORS.primary_dark,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',    
    // marginLeft: 3,
    // marginRight: 3
  },
  counterNumber: {
    fontSize: 17,
    color: COLORS.white
  },
  counterName: {
    fontSize: 14,
    color: COLORS.secondary
  },
})