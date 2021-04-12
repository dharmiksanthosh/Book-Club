import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Welcome from './screens/WelcomeScreen';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { AppDrawerNavigator } from './components/AppDrawerNavigator';
import { AppTabNavigator } from './components/AppTabNavigator';

//requesterID: jay@shree.com
//password: 123456
//donotid: donor@book.com
//password: 123456

export default class App extends React.Component {
  render(){
    return (
      <AppContainer/>
    );
  }
}
const switchNavigator = createSwitchNavigator({
  Welcome:{screen: Welcome},
  Drawer:{screen:AppDrawerNavigator},
  BottomTabNavigator:{screen:AppTabNavigator}
})
const AppContainer = createAppContainer(switchNavigator);

