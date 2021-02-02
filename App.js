import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Welcome from './screens/WelcomeScreen'

export default class App extends React.Component {
  render(){
    return (
      <Welcome/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
