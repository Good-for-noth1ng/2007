import { StyleSheet, Text, View, Modal, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons'
import { COLORS } from '../constants/theme'
import { getTimeDate } from '../utils/date'
import { useDispatch } from 'react-redux'
import { closeAuthorInfo } from '../redux/commentsSlice'
const CommentInfo = ({ isAuthorInfoOpen, authorImgUrl, authorName, regestrationDate, registrationDateIsFetching, handleClosingCommentAuthorInfo }) => {
  const dispatch = useDispatch()
    return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Modal  
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} 
        animationType='slide' 
        transparent={true} 
        visible={isAuthorInfoOpen} 
        onRequestClose={() => {dispatch(closeAuthorInfo())}}
      >
        <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.modalView}>
            {
              registrationDateIsFetching ? 
              <View style={styles.activityContainer}>
                <ActivityIndicator size={50} color={COLORS.primary}/>
              </View> :
              <>
                <View style={styles.commentInfoHeader}>
                  <TouchableOpacity style={styles.crossButton} activeOpacity={1} onPress={handleClosingCommentAuthorInfo}>
                    <AntDesign name='close' size={20} color={COLORS.primary}/>
                  </TouchableOpacity>
                </View>
                <View style={styles.nameAvatarContainer}>
                  <Image style={styles.avatarInfo} source={{uri: authorImgUrl}}/>
                  <Text style={styles.nameInfo}>{authorName}</Text>
                </View>
                <View style={styles.registredContainer}>
                  <Text style={styles.registredText}>Registred: {getTimeDate(regestrationDate)}</Text>
                </View>
              </>
            }  
        </View>
      </View>
    </Modal>
  </View>
  )
}

export default CommentInfo

const styles = StyleSheet.create({
    modalView: {
        width: 250, 
        height: 250, 
        backgroundColor: COLORS.white, 
        justifyContent: 'flex-start', 
        alignItems: 'center',
        shadowColor: COLORS.black,
        borderRadius: 10,
        shadowOffset: {
          width: 10,
          height: 10,
        },
        shadowOpacity: 0.25,
        elevation: 13,
        shadowRadius: 4,
    },
    activityContainer: {
        width: '100%',
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      commentInfoHeader: {
        width: '100%', 
        height: 40, 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        alignItems: 'center',
      },
      crossButton: {
        width: 30, 
        height: 30,
        marginRight: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      nameAvatarContainer: {
        width: 230,
        display: 'flex',
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      avatarInfo: {
        width: 50, 
        height: 50, 
        borderRadius: 100, 
        marginRight: 5,
      },
      nameInfo: {
        fontSize: 16, 
        fontWeight: '700', 
        color: COLORS.black, 
        marginLeft: 5,
      },
      registredContainer: {
        marginTop: 40
      },
      registredText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.black
      },
})