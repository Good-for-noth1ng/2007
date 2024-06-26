import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DividerWithLine = ({
    dividerWidth, 
    dividerHeight, 
    dividerColor, 
    dividerLineHeight, 
    dividerLineWidth, 
    dividerLineColor,
    marginL, 
    marginR,
    marginT, 
    marginB,
    linePosition,
    borderTL,
    borderTR,
    borderBL,
    borderBR,
    componentKey
}) => {
  return (
    <View key={componentKey} style={{
        display: 'flex',
        flexDirection: 'column', 
        justifyContent: linePosition,
        alignItems: 'center',
        width: dividerWidth, 
        height: dividerHeight, 
        backgroundColor: dividerColor,
        marginLeft: marginL,
        marginRight: marginR,
        marginTop: marginT,
        marginBottom: marginB,
        borderBottomLeftRadius: borderBL,
        borderBottomRightRadius: borderBR,
        borderTopRightRadius: borderTR,
        borderTopLeftRadius: borderTL,
    }}>
      <View style={{width: dividerLineWidth, height: dividerLineHeight, backgroundColor: dividerLineColor}}></View>
    </View>
  )
}

export default DividerWithLine

const styles = StyleSheet.create({})