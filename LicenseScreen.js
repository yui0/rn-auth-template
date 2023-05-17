import React from 'react'
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  View
} from 'react-native'
//import { Button } from './Components';
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
    <View level='2' style={{ flex:1, justifyContent:'center' }}>
      <ScrollView>
        {licenseKeys.map((packageName: string) => {
          const license = licenseFile[packageName].licenses
          const licenseUrl = licenseFile[packageName].licenseUrl
          return (
            <View key={packageName}>
              <Text category='s1'>{packageName}:</Text>
              <Text category='label'>{license}</Text>
              <Text category='c1'>{licenseUrl}</Text>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}
