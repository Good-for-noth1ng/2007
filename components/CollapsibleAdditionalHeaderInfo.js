import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WallHeaderAdditionalInfo from './WallHeaderAdditionalInfo'
import WallHeaderGeneralInfo from './WallHeaderGeneralInfo'

const CollapsibleAdditionalHeaderInfo = ({ name, avatarUrl, status, shouldPerformExpanding, setIsAvatarVisible, canAccess, lang, description, cleanedLinks, cleanedUsers, navigation, }) => {
  const [expanded, setExpanded] = React.useState(false)
  return (
    <>
      <WallHeaderGeneralInfo 
        name={name}
        avatarUrl={avatarUrl}
        status={status}
        expanded={expanded}
        shouldPerformExpanding={shouldPerformExpanding}
        setIsAvatarVisible={setIsAvatarVisible}
        canAccess={canAccess}
        chevronPressHandler={setExpanded}
        lang={lang}
      />
      <WallHeaderAdditionalInfo 
        description={description}
        cleanedLinks={cleanedLinks}
        cleanedUsers={cleanedUsers}
        navigation={navigation}
        lang={lang}
        expanded={expanded}
      />
    </>
  )
}

export default CollapsibleAdditionalHeaderInfo

const styles = StyleSheet.create({})