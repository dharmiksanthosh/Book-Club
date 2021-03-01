import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Welcome from './screens/WelcomeScreen';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { AppDrawerNavigator } from './components/AppDrawerNavigator';
import { AppTabNavigator } from './components/AppTabNavigator';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
