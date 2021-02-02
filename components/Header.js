import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class Header extends React.Component {
  render() {
    return (
      <TouchableOpacity style={styles.textContainer}>
        <Text style={styles.text}>Book Club</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  textContainer: {
    backgroundColor: '#f4c92d',
    borderWidth:10,
    borderColor:'#e8a41f'
  },

  text: {
    fontSize: 25,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
  },
});