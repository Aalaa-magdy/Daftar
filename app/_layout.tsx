import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'


// Ensure splash (index) is the initial screen, not the first modal in the stack
export const unstable_settings = {
  initialRouteName: 'index',
}

const StackLayout = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name="index" />
    </Stack>
  )
}
const RootLayout = () => {
  return (    
        <StackLayout />  
  )
}

export default RootLayout

const styles = StyleSheet.create({})