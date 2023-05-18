import React from 'react'
import {
  Alert,
  Linking,
  ScrollView,
  View
} from 'react-native'
import { SText } from './Components';
//import { Button, ButtonGroup, Layout, Text } from '@ui-kitten/components';

interface LicenseFile {
  [key: string]: any
}

export function LicenseScreen() {
  const licenseFile: LicenseFile = require('./licenses.json');
  const licenseKeys = Object.keys(licenseFile);

  /*async openUrl(url) {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "エラー",
        "このページを開ませんでした",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  }*/

  return (
    <View level='2' style={{ flex:1, justifyContent:'center', marginVertical:10, marginHorizontal:10 }}>
      <ScrollView>
        {licenseKeys.map((packageName: string) => {
          const license = licenseFile[packageName].licenses
          const licenseUrl = licenseFile[packageName].licenseUrl
          return (
            <View key={packageName}>
              <SText c='s1'>{packageName}:</SText>
              <SText c='label'>{license}</SText>
              <SText c='c1'>{licenseUrl}</SText>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}
